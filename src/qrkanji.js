import { QRMode } from './constant'
import { stringToBytesFuncs } from './utils'

function QRKanji (data) {
  this._mode = QRMode.MODE_KANJI
  this._data = data
  this._bytes = stringToBytesFuncs['SJIS'](data)

  !(function (c, code) {
    // self test for sjis support.
    let test = stringToBytesFuncs['default'](c)
    if (test.length !== 2 || ((test[0] << 8) | test[1]) !== code) {
      throw new Error('sjis not supported.')
    }
  })('\u53cb', 0x9746)
}

QRKanji.prototype = {
  getMode: function () {
    return this._mode
  },
  getLength: function (buffer) {
    return ~~(this._bytes.length / 2)
  },
  write: function (buffer) {
    let data = this._bytes
    let i = 0

    while (i + 1 < data.length) {
      let c = ((0xff & data[i]) << 8) | (0xff & data[i + 1])
      if (c >= 0x8140 && c <= 0x9FFC) {
        c -= 0x8140
      } else if (c >= 0xE040 && c <= 0xEBBF) {
        c -= 0xC140
      } else {
        throw new Error('illegal char at ' + (i + 1) + '/' + c)
      }

      c = ((c >>> 8) & 0xff) * 0xC0 + (c & 0xff)
      buffer.put(c, 13)

      i += 2
    }

    if (i < data.length) {
      throw new Error('illegal char at ' + (i + 1))
    }
  }
}

export default QRKanji
