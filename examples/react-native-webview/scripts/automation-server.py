#!/usr/bin/env python3
"""Dev automation command server for the RN example (see src/devAutomation.ts).

Run:      python3 scripts/automation-server.py           # serves :5199
Enqueue:  python3 scripts/automation-server.py run "<js>"   # returns result
Helpers:  click "<css-or-text>" | type "<css>" "<text>" | text  (dump body text)

The app polls GET /next; each command runs inside the widget WebView; the
completion value comes back via POST /result and is printed by `run`.
"""
import json
import sys
import threading
import time
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

PORT = 5199
QUEUE: list[dict] = []
RESULTS: dict[str, dict] = {}
LOCK = threading.Lock()


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):  # quiet
        pass

    def do_GET(self):
        if self.path == '/next':
            with LOCK:
                item = QUEUE.pop(0) if QUEUE else None
            if item is None:
                self.send_response(204)
                self.end_headers()
                return
            body = json.dumps(item).encode()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(body)
        elif self.path.startswith('/await/'):
            cid = self.path.split('/')[-1]
            deadline = time.time() + 20
            while time.time() < deadline:
                with LOCK:
                    if cid in RESULTS:
                        body = json.dumps(RESULTS.pop(cid)).encode()
                        self.send_response(200)
                        self.send_header('Content-Type', 'application/json')
                        self.end_headers()
                        self.wfile.write(body)
                        return
                time.sleep(0.2)
            self.send_response(408)
            self.end_headers()
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == '/result':
            size = int(self.headers.get('Content-Length', 0))
            data = json.loads(self.rfile.read(size) or b'{}')
            with LOCK:
                RESULTS[str(data.get('id'))] = data
            self.send_response(200)
            self.end_headers()
        elif self.path == '/enqueue':
            size = int(self.headers.get('Content-Length', 0))
            data = json.loads(self.rfile.read(size) or b'{}')
            with LOCK:
                QUEUE.append(data)
            self.send_response(200)
            self.end_headers()
        else:
            self.send_response(404)
            self.end_headers()


def serve():
    ThreadingHTTPServer(('127.0.0.1', PORT), Handler).serve_forever()


CLICK_SNIPPET = """
var target = %(sel)s;
var el = null;
try { el = document.querySelector(target); } catch (e) { /* not CSS, use text match */ }
if (!el) {
  var candidates = [];
  var all = document.querySelectorAll('button, a, [role="button"], input, p, span, div, li');
  for (var i = 0; i < all.length; i++) {
    var text = (all[i].textContent || '').trim();
    if (text.indexOf(target) !== -1) { candidates.push(all[i]); }
  }
  // Deepest, tightest match wins; real buttons beat wrappers.
  candidates.sort(function (a, b) {
    var buttonBias = function (n) {
      return n.tagName === 'BUTTON' || n.getAttribute('role') === 'button' ? 0 : 1;
    };
    var aText = (a.textContent || '').length;
    var bText = (b.textContent || '').length;
    return buttonBias(a) - buttonBias(b) || aText - bText;
  });
  el = candidates[0];
}
if (!el) { throw new Error('not found: ' + target); }
el.scrollIntoView({block: 'center'});
['pointerdown','mousedown','pointerup','mouseup','click'].forEach(function (type) {
  el.dispatchEvent(new MouseEvent(type, {bubbles: true, cancelable: true, view: window}));
});
return 'clicked <' + el.tagName + '> ' + (el.textContent || '').trim().slice(0, 50);
"""

TYPE_SNIPPET = """
var el = document.querySelector(%(sel)s);
if (!el) { throw new Error('input not found'); }
var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
setter.call(el, %(text)s);
el.dispatchEvent(new Event('input', {bubbles: true}));
return 'typed';
"""


def run_code(code: str):
    cid = str(time.time())
    payload = json.dumps({'id': cid, 'code': code}).encode()
    urllib.request.urlopen(
        urllib.request.Request(
            f'http://127.0.0.1:{PORT}/enqueue', data=payload,
            headers={'Content-Type': 'application/json'}),
        timeout=5)
    with urllib.request.urlopen(f'http://127.0.0.1:{PORT}/await/{cid}', timeout=25) as r:
        print(r.read().decode())


if __name__ == '__main__':
    if len(sys.argv) == 1:
        print(f'automation server on :{PORT}')
        serve()
    elif sys.argv[1] == 'run':
        run_code(sys.argv[2])
    elif sys.argv[1] == 'click':
        run_code(CLICK_SNIPPET % {'sel': json.dumps(sys.argv[2])})
    elif sys.argv[1] == 'type':
        run_code(TYPE_SNIPPET % {'sel': json.dumps(sys.argv[2]), 'text': json.dumps(sys.argv[3])})
    elif sys.argv[1] == 'text':
        run_code('return document.body.innerText.slice(0, 1500);')
    else:
        print(__doc__)
