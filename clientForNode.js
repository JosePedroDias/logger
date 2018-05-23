let numFailures = 0;
let skip = true;
let host;

const MAX_FAILURES = 10;
const MIME_JSON = 'application/json';

export function setupLogger(host_) {
  host = host_;
  skip = false;
}

export function set(key, value) {
  if (skip) {
    return;
  }

  fetch(`${host}/${key}`, {
    method: 'POST',
    headers: {
      accept: MIME_JSON,
      'content-type': MIME_JSON
    },
    body: JSON.stringify(value)
  })
    .then(resp => resp.json())
    .catch(() => {
      ++numFailures;
      if (numFailures > MAX_FAILURES) {
        skip = true;
      }
    });
}
