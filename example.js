var getToken = require('./index.js')

getToken(['repo'], 'an example', 'http://example.com', function(err, token) {
  console.log('great joerb, %s', token)
})
