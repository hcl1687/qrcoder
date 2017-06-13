import QRCoder from '../src/index'
import qrcode from './qrcode'

describe('test qrcode', function () {
  it('type:4, el:L, out: gifimage', () => {
    const typeNumber = 4
    const errorCorrectionLevel = 'L'
    const qr = qrcode(typeNumber, errorCorrectionLevel)
    qr.addData('Hi!')
    qr.make()
    const target = qr.createImgTag()
    const qrcoder = new QRCoder({
      typeNumber,
      errorCorrectionLevel
    })
    qrcoder.addData('Hi!')
    qrcoder.make()
    const source = qrcoder.createImgTag()
    expect(source).to.be.equal(target)
  })
  it('new with options', () => {
    const typeNumber = 4
    const errorCorrectionLevel = 'L'
    const qr = qrcode(typeNumber, errorCorrectionLevel)
    qr.addData('Hi!')
    qr.make()
    const target = qr.createImgTag()
    const qrcoder = new QRCoder({
      typeNumber: 4,
      errorCorrectionLevel: 'L',
      mode: 'Byte',
      cellSize: 2,
      margin: 8,
      data: 'Hi!'
    })
    const source = qrcoder.createImgTag()
    expect(source).to.be.equal(target)
  })
  it('calcTypeNumber', () => {
    const typeNumber = 1
    const errorCorrectionLevel = 'L'
    const qr = qrcode(typeNumber, errorCorrectionLevel)
    qr.addData('Hi!')
    qr.make()
    const target = qr.createImgTag()

    const qrcoder = new QRCoder({
      data: 'Hi!'
    })

    const source = qrcoder.createImgTag()
    expect(source).to.be.equal(target)
  })
  it('calcSpec', () => {
    const typeNumber = 1
    const errorCorrectionLevel = 'L'
    const qr = qrcode(typeNumber, errorCorrectionLevel)
    qr.addData('Hi!')
    qr.make()
    const target = qr.createImgTag(1, 2)

    const qrcoder = new QRCoder({
      data: 'Hi!',
      size: 25
    })

    const source = qrcoder.createImgTag()
    expect(source).to.be.equal(target)
  })
})
