# logger

basic key value store without auth. has a getter and setter for different keys and a wait which will long poll for changes on root.

the server is a very basic express server (which also serves the client code for convenience).

## server endpoints

`GET /:key?` - returns the value of the whole store or just for a given key

`POST /:key` (JSON body is the value to set) - sets the value for the key

`GET /wait/:key?` - returns once key changes (if provided) or any key changes (of no key is passed)

`GET /client.js` - the browser client is served here for convenience

## client JS API

import the client via script tag or module.

```javascript
const L = logger('http://127.0.0.1:3000');

L.set(k, v).then(noop);

L.get(k).then((o) => console.log(o));

L.onChange(onDataCb, onErrorCb, optionalKey);
```
