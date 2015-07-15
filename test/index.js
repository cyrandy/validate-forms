require('phantomjs-polyfill')
sinon     = require('sinon')
sinonChai = require('sinon-chai')
Validator = require('../lib/index')
submit    = require('./form-submit')

chai.use(sinonChai)

describe('validate-form', function() {
  expect = chai.expect
  beforeEach(function(){
    var form = this.form = window.form = document.createElement('form')
    var input = this.input = document.createElement('input')
    input.name = 'foo'
    form.appendChild(input)
    this.validator = new Validator(form)
  })

  describe('#field', function() {
    it('should be add to validator and be chainable', function() {
      validator = this.validator.field('foo')
      expect(this.validator.fields.length).to.equal(1)
      expect(this.validator.fields[0].name).to.equal('foo')
      expect(validator).to.equal(this.validator)
    })

    it('should add an `is` method to validator', function() {
      expect(this.validator.is).to.be.not.ok
      this.validator.field('foo')
      expect(this.validator.is).to.be.ok
    })

    it('should add an rule', function() {
      validator = this.validator.field('foo')
      validator.is('minimum', 8)
      expect(this.validator.fields[0].validates.length).to.equal(1)
    })

    it('should chain multiple rules', function() {
      validator = this.validator.field('foo')
      validator.is('minimum', 8)
      validator.is('email')
      expect(this.validator.fields[0].validates.length).to.equal(2)
    })

    it('should validate', function() {
      validator = this.validator.field('foo')
      validator.is('minimum', 8)
      this.input.value = 'foo'
      expect(this.validator.fields[0].validate()).to.be.not.ok
      this.input.value = 'foobarbaz'
      expect(this.validator.fields[0].validate()).to.be.ok
    })

    it('should call error handler when is invalid', function() {
      onError = sinon.spy()
      validator = this.validator
        .field('foo')
        .is('minimum', 8)
        .setErrorHandler(onError)

      this.input.value = 'foobar'

      expect(this.validator.fields[0].validate()).to.be.not.ok
      expect(onError).to.have.been.called
    })

    it('should call valid handler when is valid', function() {
      onValid = sinon.spy()
      validator = this.validator
        .field('foo')
        .is('minimum', 8)
        .setValidHandler(onValid)

      this.input.value = 'foobarbaz'

      expect(this.validator.fields[0].validate()).to.be.ok
      expect(onValid).to.have.been.called
    })
  })

  it('should set submit handler', function() {
    fn = function(e) {}
    this.validator.setSubmitHandler(fn)
    expect(this.validator.onSubmit).to.equal(fn)
  })


  it('should call validate on event dispatched', function() {
    /*
     * Skip this test in PhantomJS
     * Phantomjs cause ERROR when create event
     * https://github.com/ariya/phantomjs/issues/11289
     */
    if (window.navigator.userAgent.match(/PhantomJS/)) {
      return 'skipped'
    }
    this.validator.validate = sinon.spy()
    this.validator
      .on('blur')
      .field('foo')
      .is('minimum', 8)
    e = document.createEvent('FocusEvent')
    e.initEvent('blur')
    /*
     * Emulate event target:
     * Object.defineProperty(e, 'target', {value: this.input, enumerable: true})
     */
    this.form.dispatchEvent(e)
    expect(this.validator.validate).to.have.been.calledWith(e)
  })

  it('should set valid handler', function() {
    fn = function() {}
    this.validator.setValidHandler(fn)
    expect(this.validator.onValid).to.be.equal(fn)
  })

  it('should set error handler', function() {
    fn = function() {}
    this.validator.setErrorHandler(fn)
    expect(this.validator.onError).to.be.equal(fn)
  })

  // it('should execute submit handler if all fields validated', function() {
  //   fn = sinon.spy()
  //   this.validator.setSubmitHandler(fn)
  //   submit(this.validator.form)
  //   expect(fn).to.have.been.called
  // })

})
