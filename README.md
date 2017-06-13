# QRCoder

QRCoder is *a pure browser qrcode generation* which is standalone.
It is based on a <a href='http://www.d-project.com/qrcode/index.html'>library</a>
which build qrcode in various language.

## install
npm install qrcoder --save

## Example

### default
```javascript
import QRCoder from 'qrcoder'

const qr = new QRCoder({
  data: 'Hi!'
});

// data:image/gif;base64,R0lGODdhUgBS...WQBADs=
const dataURL = qr.getDataURL()

// <img src="data:image/gif;base64,R0lGODdhUgBS...WQBADs=" width="82" height="82"/>
const imgTag = qr.createImgTag()

document.getElementById('placeHolder').innerHTML = imgTag;
```

### specify size
```javascript
import QRCoder from 'qrcoder'

// want to create a qrcode image, which size is 101px
// QRCoder will create a qrcode image to fit this size,
// it try to calc a size which is close to this size,
// but no guarantee to equal it.
// you can use getSize function to get the real size.
// size = moduleCount * cellSize + margin * 2
// in this case, the real size is 100
const qrcoder = new QRCoder({
  data: 'Hi!',
  size: 101
})

// data:image/gif;base64,R0lG...pAoUAAA7
const dataURL = qr.getDataURL()

// <img src="data:image/gif;base64,R0lG...pAoUAAA7" width="100" height="100"/>"
const imgTag = qr.createImgTag()

const size = qrcoder.getSize()  // 100
const cellSize = qrcoder.getCellSize()  // 4
const margin = qrcoder.getMargin()  // 8
const moduleCount = qrcoder.getModuleCount() // 21

document.getElementById('placeHolder').innerHTML = imgTag;
```

### more options
```javascript
import QRCoder from 'qrcoder'

// if specify cellSize or margin or both of them, size will be ignore.
const qr = new QRCoder({
  typeNumber: 4,
  errorCorrectionLevel: 'L',
  mode: 'Byte',
  cellSize: 2,
  margin: 8,
  size: 101,
  alt: '',
  data: 'Hi!'
});

// data:image/gif;base64,R0lGODdhUgBS...WQBADs=
const dataURL = qr.getDataURL()

// <img src="data:image/gif;base64,R0lGODdhUgBS...WQBADs=" width="82" height="82"/>
const imgTag = qr.createImgTag()

document.getElementById('placeHolder').innerHTML = imgTag;
```

### native
```javascript
import QRCoder from 'qrcoder'

const typeNumber = 4
const errorCorrectionLevel = 'L'
const qr = new QRCoder({
  typeNumber,
  errorCorrectionLevel
})
qr.addData('Hi!')
qr.make()
document.getElementById('placeHolder').innerHTML = qr.createImgTag()
```

## API Documentation

### QRCoder Class

#### QRCoder(options) => <code>QRCoder</code>
Create a QRCoder Object.

| Param                | Type                | Description                                 |
| ---------------------| ------------------- | ------------------------------------------- |
| options           | <code>object</code> | options Object


Default options

| Param                | Type                | Description                                 |
| ---------------------| ------------------- | ------------------------------------------- |
| options.typeNumber           | <code>number</code> | default: 4
| options.errorCorrectionLevel | <code>string</code> | default: 'L'
| options.mode                 | <code>string</code> | default: 'Byte'
| options.cellSize             | <code>number</code> | default: 2
| options.margin               | <code>number</code> | default: 8
| options.size                 | <code>number</code> | default: undefined
| options.data                 | <code>string</code> | default: undefined
| options.alt                 | <code>string</code> | default: ''

#### QRCoder.stringToBytes(s) : <code>number[]</code>
Encodes a string into an array of number(byte) using any charset.
This function is used by internal.
Overwrite this function to encode using a multibyte charset.

| Param  | Type                | Description      |
| -------| ------------------- | ---------------- |
| s      | <code>string</code> | string to encode |

### QRCoder

#### addData(data, mode) => <code>void</code>
Add a data to encode.

| Param  | Type                | Description                                                |
| -------| ------------------- | ---------------------------------------------------------- |
| data   | <code>string</code> | string to encode                                           |
| mode   | <code>string</code> | Mode ('Numeric', 'Alphanumeric', 'Byte'(default), 'Kanji') |

#### make() => <code>void</code>
Make a QR Code.

#### getModuleCount() => <code>number</code>
The number of modules(cells) for each orientation.
_[Note] call make() before this function._

#### getSize() => <code>number</code>
The size of the qrcode image.

#### getCellSize() => <code>number</code>
The number of the qrcode's cell.

#### getMargin() => <code>number</code>
The number of the qrcode image's margin.

#### isDark(row, col) => <code>boolean</code>
The module at row and col is dark or not.
_[Note] call make() before this function._

| Param | Type                | Description         |
| ------| ------------------- | ------------------- |
| row   | <code>number</code> | 0 ~ moduleCount - 1 |
| col   | <code>number</code> | 0 ~ moduleCount - 1 |

#### getDataURL() => <code>string</code>
#### createImgTag() => <code>string</code>
#### createSvgTag() => <code>string</code>
#### createTableTag() => <code>string</code>
Helper functions for HTML.

## License
[MIT](https://opensource.org/licenses/mit-license.php)
