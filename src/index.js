import { QRRSBlock } from './qrrsblock'
import QRUtil from './qrutil'
import QRPolynomial from './qrpolynomial'
import QRBitBuffer from './qrbitbuffer'
import QRNumber from './qrnumber'
import QRAlphaNum from './qralphanum'
import QR8BitByte from './qr8bitbyte'
import QRKanji from './qrkanji'
import GifImage from './gifimage'
import Base64EncodeOutputStream from './base64encode'
import ByteArrayOutputStream from './bytearrayoutputstream'
import type from './type'
import { QRErrorCorrectionLevel, PAD0, PAD1 } from './constant'
import { stringToBytesFuncs, createStringToBytes } from './utils'

/**
 * qrcode
 * @param typeNumber 1 to 40
 * @param errorCorrectionLevel 'L','M','Q','H'
 */
function QRCoder (typeNumber, errorCorrectionLevel) {
  if (type(typeNumber) === 'object') {
    this._options = typeNumber
    typeNumber = this._options.typeNumber
    errorCorrectionLevel = this._options.errorCorrectionLevel
  } else {
    this._options = {
      typeNumber,
      errorCorrectionLevel
    }
  }

  typeNumber = typeNumber || 4
  errorCorrectionLevel = errorCorrectionLevel || 'L'
  this._typeNumber = typeNumber
  this._errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel]
  this._modules = null
  this._moduleCount = 0
  this._dataCache = null
  this._dataList = []

  if (this._options.data) {
    this.addData(this._options.data)
    this.make()
  }
}

QRCoder.prototype = {
  makeImpl: function (test, maskPattern) {
    this._moduleCount = this._typeNumber * 4 + 17
    this._modules = (function (moduleCount) {
      const modules = new Array(moduleCount)
      for (let row = 0; row < moduleCount; row += 1) {
        modules[row] = new Array(moduleCount)
        for (let col = 0; col < moduleCount; col += 1) {
          modules[row][col] = null
        }
      }
      return modules
    })(this._moduleCount)

    this.setupPositionProbePattern(0, 0)
    this.setupPositionProbePattern(this._moduleCount - 7, 0)
    this.setupPositionProbePattern(0, this._moduleCount - 7)
    this.setupPositionAdjustPattern()
    this.setupTimingPattern()
    this.setupTypeInfo(test, maskPattern)

    if (this._typeNumber >= 7) {
      this.setupTypeNumber(test)
    }

    if (this._dataCache == null) {
      this._dataCache = this.createData(this._typeNumber,
        this._errorCorrectionLevel, this._dataList)
    }

    this.mapData(this._dataCache, maskPattern)
  },
  setupPositionProbePattern: function (row, col) {
    for (let r = -1; r <= 7; r += 1) {
      if (row + r <= -1 || this._moduleCount <= row + r) {
        continue
      }

      for (let c = -1; c <= 7; c += 1) {
        if (col + c <= -1 || this._moduleCount <= col + c) {
          continue
        }

        if ((r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
            (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          this._modules[row + r][col + c] = true
        } else {
          this._modules[row + r][col + c] = false
        }
      }
    }
  },
  getBestMaskPattern: function () {
    let minLostPoint = 0
    let pattern = 0
    for (var i = 0; i < 8; i += 1) {
      this.makeImpl(true, i)
      let lostPoint = QRUtil.getLostPoint(this)

      if (i === 0 || minLostPoint > lostPoint) {
        minLostPoint = lostPoint
        pattern = i
      }
    }

    return pattern
  },
  setupTimingPattern: function () {
    for (let r = 8; r < this._moduleCount - 8; r += 1) {
      if (this._modules[r][6] != null) {
        continue
      }
      this._modules[r][6] = (r % 2 === 0)
    }

    for (let c = 8; c < this._moduleCount - 8; c += 1) {
      if (this._modules[6][c] != null) {
        continue
      }
      this._modules[6][c] = (c % 2 === 0)
    }
  },
  setupPositionAdjustPattern: function () {
    let pos = QRUtil.getPatternPosition(this._typeNumber)

    for (let i = 0; i < pos.length; i += 1) {
      for (let j = 0; j < pos.length; j += 1) {
        let row = pos[i]
        let col = pos[j]

        if (this._modules[row][col] != null) {
          continue
        }

        for (let r = -2; r <= 2; r += 1) {
          for (let c = -2; c <= 2; c += 1) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0)) {
              this._modules[row + r][col + c] = true
            } else {
              this._modules[row + r][col + c] = false
            }
          }
        }
      }
    }
  },
  setupTypeNumber: function (test) {
    let bits = QRUtil.getBCHTypeNumber(this._typeNumber)

    for (let i = 0; i < 18; i += 1) {
      let mod = (!test && ((bits >> i) & 1) === 1)
      this._modules[Math.floor(i / 3)][i % 3 + this._moduleCount - 8 - 3] = mod
    }

    for (let i = 0; i < 18; i += 1) {
      let mod = (!test && ((bits >> i) & 1) === 1)
      this._modules[i % 3 + this._moduleCount - 8 - 3][Math.floor(i / 3)] = mod
    }
  },
  setupTypeInfo: function (test, maskPattern) {
    let data = (this._errorCorrectionLevel << 3) | maskPattern
    let bits = QRUtil.getBCHTypeInfo(data)

    // vertical
    for (let i = 0; i < 15; i += 1) {
      let mod = (!test && ((bits >> i) & 1) === 1)

      if (i < 6) {
        this._modules[i][8] = mod
      } else if (i < 8) {
        this._modules[i + 1][8] = mod
      } else {
        this._modules[this._moduleCount - 15 + i][8] = mod
      }
    }

    // horizontal
    for (let i = 0; i < 15; i += 1) {
      let mod = (!test && ((bits >> i) & 1) === 1)

      if (i < 8) {
        this._modules[8][this._moduleCount - i - 1] = mod
      } else if (i < 9) {
        this._modules[8][15 - i - 1 + 1] = mod
      } else {
        this._modules[8][15 - i - 1] = mod
      }
    }

    // fixed module
    this._modules[this._moduleCount - 8][8] = (!test)
  },
  mapData: function (data, maskPattern) {
    let inc = -1
    let row = this._moduleCount - 1
    let bitIndex = 7
    let byteIndex = 0
    let maskFunc = QRUtil.getMaskFunction(maskPattern)

    for (let col = this._moduleCount - 1; col > 0; col -= 2) {
      if (col === 6) {
        col -= 1
      }

      // eslint-disable-next-line no-constant-condition
      while (true) {
        for (let c = 0; c < 2; c += 1) {
          if (this._modules[row][col - c] == null) {
            let dark = false
            if (byteIndex < data.length) {
              dark = (((data[byteIndex] >>> bitIndex) & 1) === 1)
            }

            let mask = maskFunc(row, col - c)

            if (mask) {
              dark = !dark
            }

            this._modules[row][col - c] = dark
            bitIndex -= 1

            if (bitIndex === -1) {
              byteIndex += 1
              bitIndex = 7
            }
          }
        }

        row += inc

        if (row < 0 || this._moduleCount <= row) {
          row -= inc
          inc = -inc
          break
        }
      }
    }
  },
  createBytes: function (buffer, rsBlocks) {
    let offset = 0
    let maxDcCount = 0
    let maxEcCount = 0
    let dcdata = new Array(rsBlocks.length)
    let ecdata = new Array(rsBlocks.length)

    for (let r = 0; r < rsBlocks.length; r += 1) {
      let dcCount = rsBlocks[r].dataCount
      let ecCount = rsBlocks[r].totalCount - dcCount

      maxDcCount = Math.max(maxDcCount, dcCount)
      maxEcCount = Math.max(maxEcCount, ecCount)

      dcdata[r] = new Array(dcCount)

      for (let i = 0; i < dcdata[r].length; i += 1) {
        dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset]
      }
      offset += dcCount

      let rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount)
      let rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1)

      let modPoly = rawPoly.mod(rsPoly)
      ecdata[r] = new Array(rsPoly.getLength() - 1)
      for (let i = 0; i < ecdata[r].length; i += 1) {
        let modIndex = i + modPoly.getLength() - ecdata[r].length
        ecdata[r][i] = (modIndex >= 0) ? modPoly.getAt(modIndex) : 0
      }
    }

    let totalCodeCount = 0
    for (let i = 0; i < rsBlocks.length; i += 1) {
      totalCodeCount += rsBlocks[i].totalCount
    }

    let data = new Array(totalCodeCount)
    let index = 0

    for (let i = 0; i < maxDcCount; i += 1) {
      for (let r = 0; r < rsBlocks.length; r += 1) {
        if (i < dcdata[r].length) {
          data[index] = dcdata[r][i]
          index += 1
        }
      }
    }

    for (let i = 0; i < maxEcCount; i += 1) {
      for (let r = 0; r < rsBlocks.length; r += 1) {
        if (i < ecdata[r].length) {
          data[index] = ecdata[r][i]
          index += 1
        }
      }
    }

    return data
  },
  createData: function (typeNumber, errorCorrectionLevel, dataList) {
    let rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel)
    let buffer = new QRBitBuffer()

    for (let i = 0; i < dataList.length; i += 1) {
      let data = dataList[i]
      buffer.put(data.getMode(), 4)
      buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber))
      data.write(buffer)
    }

    // calc num max data.
    let totalDataCount = 0
    for (let i = 0; i < rsBlocks.length; i += 1) {
      totalDataCount += rsBlocks[i].dataCount
    }

    if (buffer.getLengthInBits() > totalDataCount * 8) {
      throw new Error('code length overflow. (' +
        buffer.getLengthInBits() + '>' + totalDataCount * 8 + ')')
    }

    // end code
    if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
      buffer.put(0, 4)
    }

    // padding
    while (buffer.getLengthInBits() % 8 !== 0) {
      buffer.putBit(false)
    }

    // padding
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break
      }
      buffer.put(PAD0, 8)

      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break
      }
      buffer.put(PAD1, 8)
    }

    return this.createBytes(buffer, rsBlocks)
  },
  addData: function (data, mode) {
    mode = mode || this._options.mode || 'Byte'
    let newData = null

    switch (mode) {
      case 'Numeric':
        newData = new QRNumber(data)
        break
      case 'Alphanumeric':
        newData = new QRAlphaNum(data)
        break
      case 'Byte':
        newData = new QR8BitByte(data)
        break
      case 'Kanji':
        newData = new QRKanji(data)
        break
      default:
        throw new Error('mode:' + mode)
    }

    this._dataList.push(newData)
    this._dataCache = null
  },
  isDark: function (row, col) {
    if (row < 0 || this._moduleCount <= row || col < 0 || this._moduleCount <= col) {
      throw new Error(row + ',' + col)
    }
    return this._modules[row][col]
  },
  getModuleCount: function () {
    return this._moduleCount
  },
  make: function () {
    this.makeImpl(false, this.getBestMaskPattern())
  },
  createTableTag: function (cellSize, margin) {
    cellSize = cellSize || this._options.cellSize || 2
    margin = margin || this._options.margin || cellSize * 4

    let qrHtml = ''
    qrHtml += '<table style="'
    qrHtml += ' border-width: 0px; border-style: none;'
    qrHtml += ' border-collapse: collapse;'
    qrHtml += ' padding: 0px; margin: ' + margin + 'px;'
    qrHtml += '">'
    qrHtml += '<tbody>'

    for (let r = 0; r < this.getModuleCount(); r += 1) {
      qrHtml += '<tr>'
      for (let c = 0; c < this.getModuleCount(); c += 1) {
        qrHtml += '<td style="'
        qrHtml += ' border-width: 0px; border-style: none;'
        qrHtml += ' border-collapse: collapse;'
        qrHtml += ' padding: 0px; margin: 0px;'
        qrHtml += ' width: ' + cellSize + 'px;'
        qrHtml += ' height: ' + cellSize + 'px;'
        qrHtml += ' background-color: '
        qrHtml += this.isDark(r, c) ? '#000000' : '#ffffff'
        qrHtml += ';'
        qrHtml += '"/>'
      }

      qrHtml += '</tr>'
    }

    qrHtml += '</tbody>'
    qrHtml += '</table>'

    return qrHtml
  },
  createSvgTag: function (cellSize, margin) {
    cellSize = cellSize || this._options.cellSize || 2
    margin = margin || this._options.margin || cellSize * 4
    let size = this.getModuleCount() * cellSize + margin * 2
    let c
    let mc
    let r
    let mr
    let qrSvg = ''
    let rect

    rect = 'l' + cellSize + ',0 0,' + cellSize +
      ' -' + cellSize + ',0 0,-' + cellSize + 'z '

    qrSvg += '<svg'
    qrSvg += ' width="' + size + 'px"'
    qrSvg += ' height="' + size + 'px"'
    qrSvg += ' xmlns="http://www.w3.org/2000/svg"'
    qrSvg += '>'
    qrSvg += '<path d="'

    for (r = 0; r < this.getModuleCount(); r += 1) {
      mr = r * cellSize + margin
      for (c = 0; c < this.getModuleCount(); c += 1) {
        if (this.isDark(r, c)) {
          mc = c * cellSize + margin
          qrSvg += 'M' + mc + ',' + mr + rect
        }
      }
    }

    qrSvg += '" stroke="transparent" fill="black"/>'
    qrSvg += '</svg>'

    return qrSvg
  },
  createImgTag: function (cellSize, margin, alt) {
    cellSize = cellSize || this._options.cellSize || 2
    margin = margin || this._options.margin || cellSize * 4

    let size = this.getModuleCount() * cellSize + margin * 2
    let dataUrl = this.getDataURL(cellSize, margin)

    return createImgTag(size, size, dataUrl, alt)
  },
  getDataURL: function (cellSize, margin) {
    cellSize = cellSize || this._options.cellSize || 2
    margin = margin || this._options.margin || cellSize * 4

    let size = this.getModuleCount() * cellSize + margin * 2
    let min = margin
    let max = size - margin

    return getGifDataURL(size, size, (x, y) => {
      if (min <= x && x < max && min <= y && y < max) {
        let c = Math.floor((x - min) / cellSize)
        let r = Math.floor((y - min) / cellSize)
        return this.isDark(r, c) ? 0 : 1
      } else {
        return 1
      }
    })
  }
}

QRCoder.stringToBytesFuncs = stringToBytesFuncs

QRCoder.stringToBytes = stringToBytesFuncs['default']
/**
 * @param unicodeData base64 string of byte array.
 * [16bit Unicode],[16bit Bytes], ...
 * @param numChars
 */
QRCoder.createStringToBytes = createStringToBytes

function createImgTag (width, height, dataUrl, alt) {
  let img = ''
  img += '<img'
  img += '\u0020src="'
  img += dataUrl
  img += '"'
  img += '\u0020width="'
  img += width
  img += '"'
  img += '\u0020height="'
  img += height
  img += '"'
  if (alt) {
    img += '\u0020alt="'
    img += alt
    img += '"'
  }
  img += '/>'

  return img
}

function getGifDataURL (width, height, getPixel) {
  let gif = new GifImage(width, height)
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      gif.setPixel(x, y, getPixel(x, y))
    }
  }

  var b = new ByteArrayOutputStream()
  gif.write(b)

  let base64 = new Base64EncodeOutputStream()
  let bytes = b.toByteArray()
  for (let i = 0; i < bytes.length; i += 1) {
    base64.writeByte(bytes[i])
  }
  base64.flush()

  return 'data:image/gif;base64,' + base64
}

export default QRCoder
