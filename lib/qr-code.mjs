import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vendorPath = path.join(rootDir, "public", "vendor", "qrcode-generator.js");
let qrcodeFactory = null;

function getQrcodeFactory() {
  if (!qrcodeFactory) {
    const source = fs.readFileSync(vendorPath, "utf8");
    qrcodeFactory = new Function("module", "exports", `${source}\nreturn qrcode;`)({ exports: {} }, {});
  }
  return qrcodeFactory;
}

export function createQrMatrix(text) {
  const value = String(text || "");
  if (!value) throw new Error("二维码内容不能为空");
  const qr = getQrcodeFactory()(0, "M");
  qr.addData(value);
  qr.make();
  const count = qr.getModuleCount();
  return Array.from({ length: count }, (_, row) => (
    Array.from({ length: count }, (_, column) => qr.isDark(row, column))
  ));
}

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
    }
    table[index] = value >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let value = 0xffffffff;
  for (const byte of buffer) value = crcTable[(value ^ byte) & 0xff] ^ (value >>> 8);
  return (value ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data = Buffer.alloc(0)) {
  const typeBuffer = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, checksum]);
}

export function createQrPng(text, options = {}) {
  const scale = Math.max(2, Math.min(40, Math.trunc(options.scale || 10)));
  const margin = Math.max(0, Math.min(16, Math.trunc(options.margin ?? 4)));
  const matrix = createQrMatrix(text);
  const imageSize = (matrix.length + margin * 2) * scale;
  const stride = 1 + imageSize * 4;
  const raw = Buffer.alloc(stride * imageSize, 0xff);

  for (let y = 0; y < imageSize; y += 1) {
    const rowOffset = y * stride;
    raw[rowOffset] = 0;
    const matrixY = Math.floor(y / scale) - margin;
    for (let x = 0; x < imageSize; x += 1) {
      const matrixX = Math.floor(x / scale) - margin;
      const dark = matrixY >= 0 && matrixX >= 0 && matrixY < matrix.length && matrixX < matrix.length
        ? matrix[matrixY][matrixX]
        : false;
      const pixelOffset = rowOffset + 1 + x * 4;
      const shade = dark ? 0 : 255;
      raw[pixelOffset] = shade;
      raw[pixelOffset + 1] = shade;
      raw[pixelOffset + 2] = shade;
      raw[pixelOffset + 3] = 255;
    }
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(imageSize, 0);
  header.writeUInt32BE(imageSize, 4);
  header[8] = 8;
  header[9] = 6;
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", header),
    pngChunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    pngChunk("IEND"),
  ]);
}

export function writeQrPngFile(text, filePath, options = {}) {
  const target = path.resolve(filePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, createQrPng(text, options));
  return target;
}
