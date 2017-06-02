function QRBitBuffer () {
  this._buffer = []
  this._length = 0
}

QRBitBuffer.prototype = {
  getBuffer: function () {
    return this._buffer
  },
  getAt: function (index) {
    let bufIndex = Math.floor(index / 8)
    return ((this._buffer[bufIndex] >>> (7 - index % 8)) & 1) === 1
  },
  put: function (num, length) {
    for (var i = 0; i < length; i += 1) {
      this.putBit(((num >>> (length - i - 1)) & 1) === 1)
    }
  },
  getLengthInBits: function () {
    return this._length
  },
  putBit: function (bit) {
    var bufIndex = Math.floor(this._length / 8)
    if (this._buffer.length <= bufIndex) {
      this._buffer.push(0)
    }

    if (bit) {
      this._buffer[bufIndex] |= (0x80 >>> (this._length % 8))
    }

    this._length += 1
  }
}

export default QRBitBuffer
