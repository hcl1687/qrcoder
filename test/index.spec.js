import QRCoder from '../src/index'

describe('test qrcode', function () {
  it('type:4, el:L, out: gifimage', () => {
    const typeNumber = 4
    const errorCorrectionLevel = 'L'
    const qrcode = window.qrcode
    const qr = qrcode(typeNumber, errorCorrectionLevel)
    qr.addData('Hi!')
    qr.make()
    const target = qr.createImgTag()
    const qrcoder = new QRCoder(typeNumber, errorCorrectionLevel)
    qrcoder.addData('Hi!')
    qrcoder.make()
    const source = qrcoder.createImgTag()
    expect(source).to.be.equal(target)
  })
  it('new with options', () => {
    const typeNumber = 4
    const errorCorrectionLevel = 'L'
    const qrcode = window.qrcode
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
    console.log(source)
    console.log(qrcoder.getDataURL())
    expect(source).to.be.equal(target)
  })
})
