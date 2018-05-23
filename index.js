const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const PORT = 3000;
const CLIENT_JS_PATH = 'client.js';
const CLIENT_JS_BODY = fs.readFileSync('./clientForBrowser.js').toString();
const STATE = {};
const WAITING = [];
const WAITING_FOR_KEY = {};

const app = express();

function clock() {
  return new Date().toTimeString().split(' ')[0];
}

//function log() {}
function log() {
  console.log.apply(console, arguments);
}

function notifyResps(resps, state) {
  let res;
  while ((res = resps.pop())) {
    try {
      res.send(state);
    } catch (_) {}
  }
}

function notify(key, value) {
  log('notify!');

  if (WAITING.length > 0) {
    log('  %s about to be notified (generic)...', WAITING.length);
    notifyResps(WAITING, STATE);
  }

  const subResps = WAITING_FOR_KEY[key];
  if (subResps && subResps.length > 0) {
    log(
      '  %s about to be notified (waiting for key %s)...',
      subResps.length,
      key
    );
    notifyResps(subResps, value);
  }
}

app.disable('x-powered-by');
app.set('etag', false);

app.use(function(req, res, next) {
  log('%s - %s %s', clock(), req.method, req.path);

  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use(bodyParser.json({ strict: false }));

app.post('/:key', (req, res) => {
  const key = req.params.key;
  if (!key) {
    log('ignoring set of empty key');
    res.send('false');
  }

  const value = req.body;
  if (value === '') {
    delete STATE[key];
  } else {
    STATE[key] = value;
  }

  log('setting', key, 'to', value);
  res.send('true');
  notify(key, value);
});

app.get(`/${CLIENT_JS_PATH}`, (req, res) => {
  res.header({ 'content-type': 'application/javascript' });
  res.send(CLIENT_JS_BODY);
});

app.get('/wait/:key?', (req, res) => {
  const key = req.params.key;
  if (key) {
    let o = WAITING_FOR_KEY[key];
    if (!o) {
      o = [];
      WAITING_FOR_KEY[key] = o;
    }
    o.push(res);
  } else {
    WAITING.push(res);
  }
});

app.get('/:key', (req, res) => {
  const key = req.params.key;
  res.send(STATE[key]);
});

app.get('/', (req, res) => res.send(STATE));

app.listen(PORT, () => log('logger app listening on port %s...', PORT));
