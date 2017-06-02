import ByteArrayOutputStream from './bytearrayoutputstream'

function BitOutputStream (out) {
  this._out = out
  this._bitLength = 0
  this._bitBuffer = 0
}

BitOutputStream.prototype = {
  write: function (data, length) {
    if ((data >>> length) !== 0) {
      throw new Error('length over')
    }

    while (this._bitLength + length >= 8) {
      this._out.writeByte(0xff & ((data << this._bitLength) | this._bitBuffer))
      length -= (8 - this._bitLength)
      data >>>= (8 - this._bitLength)
      this._bitBuffer = 0
      this._bitLength = 0
    }

    this._bitBuffer = (data << this._bitLength) | this._bitBuffer
    this._bitLength = this._bitLength + length
  },
  flush: function () {
    if (this._bitLength > 0) {
      this._out.writeByte(this._bitBuffer)
    }
  }
}

function LzwTable () {
  this._map = {}
  this._size = 0
}

LzwTable.prototype = {
  add: function (key) {
    if (this.contains(key)) {
      throw new Error('dup key:' + key)
    }
    this._map[key] = this._size
    this._size += 1
  },
  size: function () {
    return this._size
  },
  indexOf: function (key) {
    return this._map[key]
  },
  contains: function (key) {
    return typeof this._map[key] !== 'undefined'
  }
}

function GifImage (width, height) {
  this._width = width
  this._height = height
  this._data = new Array(width * height)
}

GifImage.prototype = {
  setPixel: function (x, y, pixel) {
    this._data[y * this._width + x] = pixel
  },
  write: function (out) {
    // GIF Signature
    out.writeString('GIF87a')

    // Screen Descriptor
    out.writeShort(this._width)
    out.writeShort(this._height)
    // 2bit
    out.writeByte(0x80)
    out.writeByte(0)
    out.writeByte(0)

    // Global Color Map
    // black
    out.writeByte(0x00)
    out.writeByte(0x00)
    out.writeByte(0x00)

    // white
    out.writeByte(0xff)
    out.writeByte(0xff)
    out.writeByte(0xff)

    // Image Descriptor
    out.writeString(',')
    out.writeShort(0)
    out.writeShort(0)
    out.writeShort(this._width)
    out.writeShort(this._height)
    out.writeByte(0)

    // Local Color Map
    // Raster Data
    let lzwMinCodeSize = 2
    let raster = this.getLZWRaster(lzwMinCodeSize)

    out.writeByte(lzwMinCodeSize)

    let offset = 0
    while (raster.length - offset > 255) {
      out.writeByte(255)
      out.writeBytes(raster, offset, 255)
      offset += 255
    }

    out.writeByte(raster.length - offset)
    out.writeBytes(raster, offset, raster.length - offset)
    out.writeByte(0x00)

    // GIF Terminator
    out.writeString(';')
  },
  getLZWRaster: function (lzwMinCodeSize) {
    let clearCode = 1 << lzwMinCodeSize
    let endCode = (1 << lzwMinCodeSize) + 1
    let bitLength = lzwMinCodeSize + 1

    // Setup LZWTable
    let table = new LzwTable()

    for (let i = 0; i < clearCode; i += 1) {
      table.add(String.fromCharCode(i))
    }
    table.add(String.fromCharCode(clearCode))
    table.add(String.fromCharCode(endCode))

    let byteOut = new ByteArrayOutputStream()
    let bitOut = new BitOutputStream(byteOut)

    // clear code
    bitOut.write(clearCode, bitLength)

    let dataIndex = 0
    let s = String.fromCharCode(this._data[dataIndex])
    dataIndex += 1

    while (dataIndex < this._data.length) {
      let c = String.fromCharCode(this._data[dataIndex])
      dataIndex += 1

      if (table.contains(s + c)) {
        s = s + c
      } else {
        bitOut.write(table.indexOf(s), bitLength)
        if (table.size() < 0xfff) {
          if (table.size() === (1 << bitLength)) {
            bitLength += 1
          }

          table.add(s + c)
        }

        s = c
      }
    }

    bitOut.write(table.indexOf(s), bitLength)
    // end code
    bitOut.write(endCode, bitLength)
    bitOut.flush()

    return byteOut.toByteArray()
  }
}

export default GifImage
