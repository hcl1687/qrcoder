# QRCoder
===

QRCoder is *a pure browser qrcode generation* which is standalone.
It is based on a <a href='http://www.d-project.com/qrcode/index.html'>library</a>
which build qrcode in various language.

## install
npm install qrcoder --save-dev

## Example
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
