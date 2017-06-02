function Base64EncodeOutputStream () {
  this._buffer = 0
  this._buflen = 0
  this._length = 0
  this._base64 = ''
}

Base64EncodeOutputStream.prototype = {
  writeEncoded: function (b) {
    this._base64 += String.fromCharCode(this.encode(b & 0x3f))
  },
  encode: function (n) {
    if (n < 0) {
      // error.
    } else if (n < 26) {
      return 0x41 + n
    } else if (n < 52) {
      return 0x61 + (n - 26)
    } else if (n < 62) {
      return 0x30 + (n - 52)
    } else if (n === 62) {
      return 0x2b
    } else if (n === 63) {
      return 0x2f
    }
    throw new Error('n:' + n)
  },
  writeByte: function (n) {
    this._buffer = (this._buffer << 8) | (n & 0xff)
    this._buflen += 8
    this._length += 1

    while (this._buflen >= 6) {
      this.writeEncoded(this._buffer >>> (this._buflen - 6))
      this._buflen -= 6
    }
  },
  flush: function () {
    if (this._buflen > 0) {
      this.writeEncoded(this._buffer << (6 - this._buflen))
      this._buffer = 0
      this._buflen = 0
    }

    if (this._length % 3 !== 0) {
      let padlen = 3 - this._length % 3
      for (let i = 0; i < padlen; i += 1) {
        this._base64 += '='
      }
    }
  },
  toString: function () {
    return this._base64
  }
}

export default Base64EncodeOutputStream
