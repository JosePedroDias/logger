let numFailures = 0;

const MAX_FAILURES = 10;

const MIME_JSON = 'application/json';
const HEADER_ACCEPT = 'accept';
const HEADER_CONTENT_TYPE = 'content-type';

function logger(host) {
  function get(key = '') {
    return fetch(`${host}/${key}`, {
      headers: {
        [HEADER_ACCEPT]: MIME_JSON
      }
    }).then(resp => resp.json());
  }

  function set(key, value) {
    return fetch(`${host}/${key}`, {
      method: 'POST',
      headers: {
        [HEADER_ACCEPT]: MIME_JSON,
        [HEADER_CONTENT_TYPE]: MIME_JSON
      },
      body: JSON.stringify(value)
    }).then(resp => resp.json());
  }

  function wait() {
    return fetch(`${host}/wait`, {}).then(resp => resp.json());
  }

  function onChange(dataCb, errorCb) {
    get()
      .then(o => dataCb(o))
      .catch(() => {});

    function step(failed) {
      if (failed) {
        ++numFailures;
        if (numFailures > MAX_FAILURES) {
          return errorCb();
        }
      }

      wait()
        .then(o => dataCb(o))
        .then(() => step())
        .catch(() => step(true));
    }

    step();
  }

  return { get, set, onChange };
}
