import { QRMode } from './constant'
import { stringToBytesFuncs } from './utils'

function QR8BitByte (data) {
  this._mode = QRMode.MODE_8BIT_BYTE
  this._data = data
  this._bytes = stringToBytesFuncs['default'](data)
}

QR8BitByte.prototype = {
  getMode: function () {
    return this._mode
  },
  getLength: function (buffer) {
    return this._bytes.length
  },
  write: function (buffer) {
    for (var i = 0; i < this._bytes.length; i += 1) {
      buffer.put(this._bytes[i], 8)
    }
  }
}

export default QR8BitByte
