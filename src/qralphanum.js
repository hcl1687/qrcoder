import { QRMode } from './constant'

function getCode (c) {
  if (c >= '0' && c <= '9') {
    return c.charCodeAt(0) - '0'.charCodeAt(0)
  } else if (c >= 'A' && c <= 'Z') {
    return c.charCodeAt(0) - 'A'.charCodeAt(0) + 10
  } else {
    switch (c) {
      case ' ' : return 36
      case '$' : return 37
      case '%' : return 38
      case '*' : return 39
      case '+' : return 40
      case '-' : return 41
      case '.' : return 42
      case '/' : return 43
      case ':' : return 44
      default :
        throw new Error('illegal char :' + c)
    }
  }
}

function QRAlphaNum (data) {
  this._mode = QRMode.MODE_ALPHA_NUM
  this._data = data
}

QRAlphaNum.prototype = {
  getMode: function () {
    return this._mode
  },
  getLength: function (buffer) {
    return this._data.length
  },
  write: function (buffer) {
    let s = this._data
    let i = 0

    while (i + 1 < s.length) {
      buffer.put(
        getCode(s.charAt(i)) * 45 +
        getCode(s.charAt(i + 1)), 11)
      i += 2
    }

    if (i < s.length) {
      buffer.put(getCode(s.charAt(i)), 6)
    }
  }
}

export default QRAlphaNum
