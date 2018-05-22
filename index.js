const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const PORT = 3000;
const CLIENT_JS_PATH = 'client.js';
const CLIENT_JS_BODY = fs.readFileSync('./client.js').toString();
const STATE = {};
const WAITING = [];

const app = express();

//function log() {}
function log() {
  console.log.apply(console, arguments);
}

function notify() {
  log('%s about to be notified...', WAITING.length);
  let res;
  while ((res = WAITING.pop())) {
    try {
      res.send(STATE);
    } catch (_) {}
  }
}

app.disable('x-powered-by');
app.set('etag', false);

app.use(function(req, res, next) {
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
  notify();
});

app.get(`/${CLIENT_JS_PATH}`, (req, res) => {
  res.header({ 'content-type': 'application/javascript' });
  res.send(CLIENT_JS_BODY);
});

app.get('/wait', (req, res) => {
  WAITING.push(res);
  log('%s waiting...', WAITING.length);
});

app.get('/:key', (req, res) => {
  const key = req.params.key;
  res.send(STATE[key]);
});

app.get('/', (req, res) => res.send(STATE));

app.listen(PORT, () => log('logger app listening on port %s...', PORT));
