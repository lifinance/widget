import { files } from './react-files';
export async function createCodesandbox() {
  return fetch('https://codesandbox.io/api/v1/sandboxes/define?json=1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      files,
    }),
  })
    .then((x) => x.json())
    .then((data) => generateIframeData(data.sandbox_id));
}

function generateIframeData(sandbox_id: string) {
  const url = `https://codesandbox.io/embed/${sandbox_id}?fontsize=14&file=%2Fconfig.ts`;
  return {
    src: url,
    style: {
      width: '100%',
      height: '100%',
      border: 0,
      borderRadius: '4px',
      overflow: 'hidden',
    },
    sandbox:
      'allow-modals allow-forms allow-popups allow-scripts allow-same-origin',
  };
}
