'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var rules = {
  minimum: function minimum(length) {
    return function (val) {
      var l = val.length ? val.length : val;
      return l >= length;
    };
  },
  match: function match(tween) {
    return function (val) {
      var tweenEl = undefined.form.querySelector('[name=' + tween + ']');
      return tweenEl.value === val;
    };
  },
  email: function email() {
    return function (email) {
      var matcher = /.+\@.+\..+/;
      return matcher.test(email);
    };
  }
};

var Field = (function () {
  function Field(el, validator) {
    _classCallCheck(this, Field);

    this.el = el;
    this.validator = validator;
    this.name = el.name;
    this.validates = [];
  }

  _createClass(Field, [{
    key: 'is',
    value: function is(fn) {
      var settings = arguments.length < 2 ? [] : [].slice.call(arguments, 1);
      var rule = rules[fn].apply(this, settings);
      this.validates.push(rule);
    }
  }, {
    key: 'validate',
    value: function validate(e) {
      var _this = this;

      var result = this.validates.reduce(function (isValidate, validate) {
        validate = validate.bind(_this.validator);
        return isValidate & validate(_this.el.value);
      }, true);

      if (result) {
        if (this.validator.onValid) {
          this.validator.onValid(e);
        }
      } else {
        if (this.validator.onError) {
          this.validator.onError(e);
        }
      }

      return result;
    }
  }]);

  return Field;
})();

var Validator = (function () {
  function Validator(form) {
    var _this2 = this;

    _classCallCheck(this, Validator);

    this.onValid = undefined;
    this.onError = undefined;
    this.form = form;
    this.fields = [];
    this.form.addEventListener('submit', function (e) {
      e.preventDefault();
      // if (!this.validateAll()) {
      //   return false
      // }
      if (_this2.onSubmit) {
        _this2.onSubmit();
      }
      return false;
    }, true);
    return this;
  }

  _createClass(Validator, [{
    key: 'validateAll',

    // private
    value: function validateAll() {
      return;
    }
  }, {
    key: 'setSubmitHandler',
    value: function setSubmitHandler(fn) {
      this.onSubmit = fn;
      return this;
    }
  }, {
    key: 'on',

    // on: (evnt) ->
    //   # set default validate cb as @validate
    //   fn = @validate.bind @

    // if arguments.length > 1
    //   setting = [].pop.call arguments
    //   if typeof setting is 'boolean'
    //     useCapture = setting
    //   else if arguments.length is 1
    //     setting['fields'] = @fields
    //     fn = @validate.bind setting

    //   if arguments.length > 1
    //     setting = [].pop.call arguments
    //     setting['fields'] = @fields
    //     fn = @validate.bind setting

    //   @form.addEventListener evnt, fn, useCapture
    //   @

    value: function on(domEvent) {
      var useCapture = arguments[1] === undefined ? false : arguments[1];

      var fn = this.validate;
      this.form.addEventListener(domEvent, fn, useCapture);
      return this;
    }
  }, {
    key: 'validate',
    value: function validate(e) {
      if (e.target.type === 'submit') {
        return null;
      }

      var field = undefined;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var f = _step.value;

          if (e.target.name === f.name) {
            field = f;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return field.validate(e);
    }
  }, {
    key: 'field',
    value: function field(el) {
      var _this3 = this;

      if (typeof el === 'string') {
        el = this.form.querySelector('[name=' + el + ']');
      }
      var field = new Field(el, this);
      this.fields.push(field);
      this.is = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        field.is.apply(field, args);
        return _this3;
      };
      return this;
    }
  }, {
    key: 'setValidHandler',
    value: function setValidHandler(fn) {
      this.onValid = fn;
      return this;
    }
  }, {
    key: 'setErrorHandler',
    value: function setErrorHandler(fn) {
      this.onError = fn;
      return this;
    }
  }]);

  return Validator;
})();

exports['default'] = Validator;
module.exports = exports['default'];