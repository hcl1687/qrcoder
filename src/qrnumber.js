import { QRMode } from './constant'

function chatToNum (c) {
  if (c >= '0' && c <= '9') {
    return c.charCodeAt(0) - '0'.charCodeAt(0)
  }
  throw new Error('illegal char :' + c)
}

function strToNum (s) {
  let num = 0
  for (let i = 0; i < s.length; i += 1) {
    num = num * 10 + chatToNum(s.charAt(i))
  }
  return num
}

function QRNumber (data) {
  this._mode = QRMode.MODE_NUMBER
  this._data = data
}

QRNumber.prototype = {
  getMode: function () {
    return this._mode
  },
  getLength: function () {
    return this._data.length
  },
  write: function (buffer) {
    let data = this._data
    let i = 0

    while (i + 2 < data.length) {
      buffer.put(strToNum(data.substring(i, i + 3)), 10)
      i += 3
    }

    if (i < data.length) {
      if (data.length - i === 1) {
        buffer.put(strToNum(data.substring(i, i + 1)), 4)
      } else if (data.length - i === 2) {
        buffer.put(strToNum(data.substring(i, i + 2)), 7)
      }
    }
  }
}

export default QRNumber
