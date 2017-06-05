function ByteArrayOutputStream () {
  this._bytes = []
}

ByteArrayOutputStream.prototype = {
  writeByte: function (b) {
    this._bytes.push(b & 0xff)
  },
  writeShort: function (i) {
    this.writeByte(i)
    this.writeByte(i >>> 8)
  },
  writeBytes: function (b, off, len) {
    off = off || 0
    len = len || b.length
    for (let i = 0; i < len; i += 1) {
      this.writeByte(b[i + off])
    }
  },
  writeString: function (s) {
    for (let i = 0; i < s.length; i += 1) {
      this.writeByte(s.charCodeAt(i))
    }
  },
  toByteArray: function () {
    return this._bytes
  },
  toString: function () {
    let s = ''
    s += '['
    for (let i = 0; i < this._bytes.length; i += 1) {
      if (i > 0) {
        s += ','
      }
      s += this._bytes[i]
    }
    s += ']'
    return s
  }
}

export default ByteArrayOutputStream
