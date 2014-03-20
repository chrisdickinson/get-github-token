# get-github-token

Prompt the user for username/password to get a github token. Works with TFA.

![an example](https://f.cloud.github.com/assets/37303/2469021/bdd8ecf2-afea-11e3-92ce-968a3f186752.gif)

```javascript
var getToken = require('get-github-token')

getToken(['scopes'], 'note!', 'http://noteurl.com/', function(err, token) {
  // token will be a string.
})

// or pass your own github api instance!
var gh = new Github({version: '3.0.0', protocol: 'https'})

getToken(['scopes'], 'note!', 'http://noteurl.com/', gh, function(err, token) {
  // token will be a string.
})
```

## API

#### getToken(scopes, note, noteUrl[, github], ready)

```
// signature
getToken(
    scopes:Array<String>
  , note:String
  , noteUrl:String
 [, github:Github]
  , ready:Function(err:Error, token:String)
)
```

Prompts the user for username/password in order to attain a Github oauth
token. Requires a list of [scopes](https://developer.github.com/v3/oauth/#scopes),
a note string, a note url, and a callback. The callback will receive `err` or
`token`, where `token` represents a string containing the oauth token. If not
given, the `github` parameter will be a [node-github](http://npm.im/github) instance
created as a `3.0.0` API against `https` protocol.

## License

MIT
