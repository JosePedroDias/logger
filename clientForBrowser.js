const TIMEOUT_MS = 5000;

const MIME_JSON = 'application/json';
const HEADER_ACCEPT = 'accept';
const HEADER_CONTENT_TYPE = 'content-type';

export default function logger(host) {
  function get(key = '') {
    return fetch(`${host}/${key}`, {
      timeout: TIMEOUT_MS,
      headers: {
        [HEADER_ACCEPT]: MIME_JSON
      }
    }).then((resp) => resp.json());
  }

  function set(key, value) {
    return fetch(`${host}/${key}`, {
      method: 'POST',
      timeout: TIMEOUT_MS,
      headers: {
        [HEADER_ACCEPT]: MIME_JSON,
        [HEADER_CONTENT_TYPE]: MIME_JSON
      },
      body: JSON.stringify(value)
    }).then((resp) => resp.json());
  }

  function wait(optionalKey) {
    return fetch(`${host}/wait${optionalKey ? '/' + optionalKey : ''}`, {
      timeout: TIMEOUT_MS,
      headers: {
        [HEADER_ACCEPT]: MIME_JSON
      }
    }).then((resp) => resp.json());
  }

  function onChange(onNewData, onError, optionalKey) {
    get(optionalKey)
      .then((o) => {
        function step() {
          wait(optionalKey)
            .then((o) => {
              onNewData(o);
              step();
            })
            .catch(onError);
        }

        onNewData(o);
        step();
      })
      .catch(onError);
  }

  // TODO: SWITCH TO A GENERATOR SOLUTION MAYBE?
  /*async function* onChange(optionalKey) {
    while (true) {
      console.log(`waiting for $${optionalKey}...`);
      const o = await wait(optionalKey);
      console.log(`got result from $${optionalKey}. notifying`);
      yield o;
    }
  }*/

  return { get, set, wait, onChange };
}
