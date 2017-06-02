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

### more options
```javascript
import QRCoder from 'qrcoder'

const qr = new QRCoder({
  typeNumber: 4,
  errorCorrectionLevel: 'L',
  mode: 'Byte',
  cellSize: 2,
  margin: 8,
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

const typeNumber = 4;
const errorCorrectionLevel = 'L';
const qr = new QRCoder(typeNumber, errorCorrectionLevel);
qr.addData('Hi!');
qr.make();
document.getElementById('placeHolder').innerHTML = qr.createImgTag();
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
| options.data                 | <code>string</code> | default: undefined

#### QRCoder(typeNumber, errorCorrectionLevel) => <code>QRCoder</code>
Create a QRCoder Object.

| Param                | Type                | Description                                 |
| ---------------------| ------------------- | ------------------------------------------- |
| typeNumber           | <code>number</code> | Type number (1 ~ 40)                        |
| errorCorrectionLevel | <code>string</code> | Error correction level ('L', 'M', 'Q', 'H') |

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

#### isDark(row, col) => <code>boolean</code>
The module at row and col is dark or not.
_[Note] call make() before this function._

| Param | Type                | Description         |
| ------| ------------------- | ------------------- |
| row   | <code>number</code> | 0 ~ moduleCount - 1 |
| col   | <code>number</code> | 0 ~ moduleCount - 1 |

#### getDataURL(cellSize, margin) => <code>string</code>
#### createImgTag(cellSize, margin) => <code>string</code>
#### createSvgTag(cellSize, margin) => <code>string</code>
#### createTableTag(cellSize, margin) => <code>string</code>
Helper functions for HTML.
 _[Note] call make() before these functions._

| Param    | Type                | Description           |
| ---------| ------------------- | --------------------- |
| cellSize | <code>number</code> | default: 2            |
| margin   | <code>number</code> | default: cellSize * 4 |

## License
[MIT](https://opensource.org/licenses/mit-license.php)
