# logger

basic key value store without auth. has a getter and setter for different keys and a wait which will long poll for changes on root.

the server is a very basic express server (which also serves the client code for convenience).

# SERVER ENDPOINTS

`GET /:key?` - returns the value of the whole store or just for a given key

`SET /:key` (JSON body is the value to set) - sets the value for the key

`GET /wait/:key?` - returns once key changes (if provided) or any key changes (of no key is passed)

`GET /client.js` - the browser client is served here for convenience

## API

import the client.js file via script tag or module.

```javascript
const L = logger('http://127.0.0.1:3000');

L.set(k, v);

L.get(k); // promise to JSON value for k

L.onChange(onDataCb(), onError(), optionalKey); // every time the store changes, onDataCb is fired. onError is fired after 10 unsuccessful polls will only fire for optionalKey changes if argument is supplied
```

## example usage

You can test the usage locally by:

    python -m SimpleHTTPServer 2244

and visiting the example pages

the `exampleObserver.html` can filter the wait on a key if you pass it a hash in the URL, like this:
<http://127.0.0.1:2244/exampleObserver.html#keygoeshere>
