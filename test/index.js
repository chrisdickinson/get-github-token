var mock = require('mock')

var getToken = require('../index.js')

module.exports = runTests

if(require.main === module) {
  runTests(require('tape'))
}

function runTests(test) {
  getToken = mock('../index.js', {
      'promfig': fakePromfig()
    , 'github': fakeGithub()
  }, require)

  var promfigHandlerNext
    , promfigHandler
    , promfigResult
    , ghAuthzNext
    , ghToken
    , ghAuthz
    , ghMain

  test('handles promfig error', function(assert) {
    promfigHandler = promfigHandlerFailure

    getToken([], '', '', fakeGithub()(), function(err) {
      assert.ok(err, 'should have errored')
      assert.end()
    })
  })

  test('handles gh error', function(assert) {
    promfigHandler = promfigHandlerSuccess
    promfigResult = {}
    ghAuthz = ghAuthzFailure

    getToken([], '', '', fakeGithub()(), function(err) {
      assert.ok(err, 'should have errored')
      assert.end()
    })
  })

  test('handles gh tfa fail', function(assert) {
    promfigHandler = promfigHandlerSuccess
    promfigResult = {}
    ghAuthz = ghAuthzTFA
    ghAuthzNext = ghAuthzFailure

    getToken([], '', '', fakeGithub()(), function(err) {
      assert.ok(err, 'should have errored')
      assert.end()
    })
  })

  test('handles gh tfa success', function(assert) {
    promfigHandler = promfigHandlerSuccess
    promfigResult = {}
    ghAuthz = ghAuthzTFA
    ghAuthzNext = ghAuthzSuccess

    getToken([], '', '', fakeGithub()(), function(err) {
      assert.ok(!err, 'should have errored')
      assert.end()
    })
  })

  test('handles gh tfa promfig fail', function(assert) {
    promfigHandlerNext = promfigHandlerFailure
    promfigHandler = promfigHandlerSuccess
    promfigResult = {}
    ghAuthz = ghAuthzTFA
    ghAuthzNext = ghAuthzSuccess

    getToken([], '', '', fakeGithub()(), function(err) {
      assert.ok(!err, 'should have errored')
      assert.end()
    })
  })

  test('handles success', function(assert) {
    promfigHandler = promfigHandlerSuccess
    ghAuthz = ghAuthzSuccess
    ghToken = 'expected'
    promfigResult = {}

    getToken([], '', '', function(err, data) {
      assert.equal(data, 'expected')
      assert.end()
    })

  })

  function ghAuthzTFA(opts, ready) {
    return process.nextTick(function() {
      ghAuthz = ghAuthzNext

      ready(new Error('OTP'))
    })
  }

  function ghAuthzFailure(opts, ready) {
    return process.nextTick(function() {
      ready(new Error('What'))
    })
  }

  function ghAuthzSuccess(opts, ready) {
    return process.nextTick(function() {
      ready(null, {token: ghToken})
    })
  }

  function promfigHandlerSuccess(prompt, cfg, ready) {
    return process.nextTick(function() {
      ready(null, promfigResult)
    })
  }

  function promfigHandlerFailure(prompt, cfg, ready) {
    return process.nextTick(function() {
      ready(new Error('promfig failure'))
    })
  }

  function fakePromfig() {
    return function() {
      fakePromfig.args = [].slice.call(arguments)

      return promfigHandler.apply(this, arguments)
    }
  }

  function fakeGithub() {
    return function() {
      fakeGithub.initArgs = [].slice.call(arguments)

      return {
          authenticate: authn
        , authorization: {create: authz}
      }

      function authn() {
        fakeGithub.authnArgs = [].slice.call(arguments)
      }

      function authz() {
        fakeGithub.authzArgs = [].slice.call(arguments)

        return ghAuthz.apply(this, arguments)
      }
    }
  }
}
