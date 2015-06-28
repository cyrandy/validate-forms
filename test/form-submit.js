function trigger (el, type, options) {

  // default el is `document`
  if ('string' === typeof el) {
    options = type;
    type = el;
    el = document;
  }

  var e = document.createEvent('MouseEvent')
  e.initMouseEvent('click')
  el.dispatchEvent
    ? el.dispatchEvent(e)
    : el.fireEvent('on' + type, e);
}


/**
 * Expose `submitForm`.
 */




/**
 * Submit a `form` programmatically, triggering submit handlers.
 *
 * @param {Element} form
 */

function submitForm (form) {
  var button = document.createElement('button');
  button.style.display = 'none';
  form.appendChild(button);
  trigger(button, 'click');
  form.removeChild(button);
}

module.exports = submitForm;
