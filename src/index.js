let rules = {
  minimum: (length) => {
    return (val) => {
      let l = val.length ? val.length : val
      return l >= length
    }
  }
  , match: (tween) => {
    return (val) => {
      let tweenEl = this.form.querySelector(`[name=${tween}]`)
      return tweenEl.value === val
    }
  }
  , email: () => {
    return (email) => {
      let matcher = /.+\@.+\..+/
      return matcher.test(email)
    }
  }
}

class Field {
  constructor(el, validator) {
    this.el = el
    this.validator = validator
    this.name = el.name
    this.validates = []
  }

  is(fn) {
    let settings = arguments.length < 2 ? [] : [].slice.call(arguments, 1)
    let rule = rules[fn].apply(this, settings)
    this.validates.push(rule)
  }

  validate(e) {
    let result = this.validates.reduce((isValidate, validate) => {
      validate = validate.bind(this.validator)
      return isValidate & validate(this.el.value)
    }, true)

    if (result) {
      if (this.validator.onValid) { this.validator.onValid(e) }
    } else {
      if (this.validator.onError) { this.validator.onError(e) }
    }

    return result
  }
}

class Validator {
  constructor(form, autoSubmit = false) {
    this.onValid = undefined
    this.onError = undefined
    this.form = form
    this.fields = []
    this.form.addEventListener('submit', (e) => {
      e.preventDefault()
      if (!this.validateAll()) { return false }

      if (this.onSubmit) { this.onSubmit() }

      return autoSubmit ? true : false
    }, true)
    return this
  }

  // private
  validateAll() {
    return this.fields.reduce((isValidate, field) => {
      return isValidate & field.validate()
    }, true)
  }

  on(domEvent, useCapture = false) {
    let fn = this.validate
    this.form.addEventListener(domEvent, fn, useCapture)
    return this
  }

  validate(e) {
    if (e.target.type === 'submit') { return null }

    let field
    for (let f of this.fields) {
      if (e.target.name === f.name) { field = f }
    }
    return field.validate(e)
  }

  field(el) {
    if (typeof el === 'string') {
      el = this.form.querySelector(`[name=${el}]`)
    }
    let field = new Field(el, this)
    this.fields.push(field)
    this.is = (...args) => {
      field.is.apply(field, args)
      return this
    }
    return this
  }

  setSubmitHandler(fn) {
    this.onSubmit = fn
    return this
  }

  setValidHandler(fn) {
    this.onValid = fn
    return this
  }

  setErrorHandler(fn) {
    this.onError = fn
    return this
  }
}

export default Validator
