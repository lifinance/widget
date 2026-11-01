import { toDataURL } from 'qrcode'
import { OATH_WALLET_ICON } from '../config/oathWallet.js'

export interface OathConnectionDialog {
  close: () => void
}

/** Only pairing data is passed to the QR renderer; it is never logged or persisted here. */
export const openOathConnectionDialog = async (
  uri: string,
  onCancel: () => void,
  signal: AbortSignal
): Promise<OathConnectionDialog> => {
  if (!/^wc:[^@]+@2\?/.test(uri)) {
    throw new Error('Invalid WalletConnect pairing URI')
  }
  const qr = await toDataURL(uri, {
    width: 288,
    margin: 2,
    errorCorrectionLevel: 'M',
  })
  signal.throwIfAborted()
  const previousFocus = document.activeElement
  const dialog = document.createElement('dialog')
  dialog.setAttribute('aria-label', 'Connect Oath Wallet')
  // Shadow styles cannot alter the embedding application's wallet rows or theme.
  const content = document.createElement('div')
  const shadow = content.attachShadow({ mode: 'open' })
  const style = document.createElement('style')
  style.textContent = `
    :host{display:block;font:16px/1.5 system-ui,sans-serif;color:#18202b;text-align:center}
    *{box-sizing:border-box} h2{font-size:22px;margin:12px 0} p{margin:12px 0;color:#485465}
    .logo{width:48px;height:48px;border-radius:12px}.qr{display:block;width:min(288px,100%);height:auto;margin:auto}
    a,button{font:inherit;display:block;width:100%;border-radius:12px;padding:12px;margin-top:12px;cursor:pointer}
    a{color:#155eef;text-decoration:none} .open{background:#155eef;color:white}
    button{border:1px solid #d0d5dd;background:white;color:#18202b}a:focus-visible,button:focus-visible{outline:3px solid #155eef;outline-offset:3px}
  `
  shadow.append(style)
  const logo = document.createElement('img')
  logo.src = OATH_WALLET_ICON
  logo.alt = ''
  logo.className = 'logo'
  const title = document.createElement('h2')
  title.textContent = 'Connect Oath Wallet'
  const instructions = document.createElement('p')
  instructions.textContent =
    'Scan this QR code with Oath on your iPhone, then review and approve the connection in the app.'
  const image = document.createElement('img')
  image.src = qr
  image.alt = 'WalletConnect pairing QR code for Oath Wallet'
  image.className = 'qr'
  shadow.append(logo, title, instructions, image)
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  if (isIOS) {
    const open = document.createElement('a')
    open.textContent = 'Open Oath on this iPhone or iPad'
    open.className = 'open'
    open.href = `oathwallet://wc?uri=${encodeURIComponent(uri)}`
    shadow.append(open)
  }
  const download = document.createElement('a')
  download.textContent = 'Get Oath for iOS'
  download.href = 'https://apps.apple.com/app/id6780187283'
  download.target = '_blank'
  download.rel = 'noopener noreferrer'
  const cancel = document.createElement('button')
  cancel.type = 'button'
  cancel.textContent = 'Cancel'
  let closed = false
  const close = () => {
    if (closed) {
      return
    }
    closed = true
    signal.removeEventListener('abort', close)
    dialog.close()
    dialog.remove()
    if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
      previousFocus.focus()
    }
  }
  const cancelConnection = () => {
    close()
    onCancel()
  }
  cancel.addEventListener('click', cancelConnection)
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault()
    cancelConnection()
  })
  shadow.append(download, cancel)
  dialog.append(content)
  dialog.style.cssText =
    'border:1px solid #d0d5dd;border-radius:24px;padding:24px;width:384px;max-width:calc(100vw - 32px);max-height:calc(100dvh - 32px);overflow:auto;background:white;'
  signal.addEventListener('abort', close, { once: true })
  document.body.append(dialog)
  try {
    dialog.showModal()
    cancel.focus()
  } catch (error) {
    close()
    throw error
  }
  return { close }
}
