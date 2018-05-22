# logger

basic key value store without auth. has a getter and setter for different keys and a wait which will long poll for changes on root.

the server is a very basic express server (which also serves the client code for convenience).

## API

import the client.js file via script tag or module.

```javascript
const L = logger('http://127.0.0.1:3000');

L.set(k, v);

L.get(k); // promise to JSON value for k

L.onChange(onDataCb(), onError()); // every time the store changes, onDataCb is fired. onError is fired after 10 unsuccessful polls
```

## example usage

You can test the usage locally by:

    python -m SimpleHTTPServer 2244

and visiting the example pages
