function Base64DecodeInputStream (str) {
  this._str = str
  this._pos = 0
  this._buffer = 0
  this._buflen = 0
}

Base64DecodeInputStream.prototype = {
  read: function () {
    while (this._buflen < 8) {
      if (this._pos >= this._str.length) {
        if (this._buflen === 0) {
          return -1
        }
        throw new Error('unexpected end of file./' + this._buflen)
      }

      let c = this._str.charAt(this._pos)
      this._pos += 1

      if (c === '=') {
        this._buflen = 0
        return -1
      } else if (c.match(/^\s$/)) {
        // ignore if whitespace.
        continue
      }

      this._buffer = (this._buffer << 6) | this.decode(c.charCodeAt(0))
      this._buflen += 6
    }

    var n = (this._buffer >>> (this._buflen - 8)) & 0xff
    this._buflen -= 8
    return n
  },
  decode: function (c) {
    if (c >= 0x41 && c <= 0x5a) {
      return c - 0x41
    } else if (c >= 0x61 && c <= 0x7a) {
      return c - 0x61 + 26
    } else if (c >= 0x30 && c <= 0x39) {
      return c - 0x30 + 52
    } else if (c === 0x2b) {
      return 62
    } else if (c === 0x2f) {
      return 63
    } else {
      throw new Error('c:' + c)
    }
  }
}

export default Base64DecodeInputStream
