import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';

const cloudName = process.env.CLOUDINARY_NAME?.trim();
const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
const apiSecret = process.env.CLOUDINARY_SECRET_KEY?.trim();

console.log('cloudName', cloudName);
console.log('apiKey', apiKey ? apiKey.slice(0, 4) + '...' : 'missing');
console.log('apiSecret', apiSecret ? apiSecret.slice(0, 4) + '...' : 'missing');

const tmp = path.join(process.cwd(), 'cloudinary-rest-test.png');
fs.writeFileSync(tmp, Buffer.from([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A,0x00,0x00,0x00,0x0D,0x49,0x48,0x44,0x52,0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x01,0x08,0x02,0x00,0x00,0x00,0x90,0x77,0x53,0xDE,0x00,0x00,0x00,0x0A,0x49,0x44,0x41,0x54,0x78,0x9C,0x63,0x60,0x00,0x00,0x00,0x02,0x00,0x01,0xE2,0x21,0xBC,0x33,0x00,0x00,0x00,0x00,0x49,0x45,0x4E,0x44,0xAE,0x42,0x60,0x82]));

const form = new FormData();
form.append('file', fs.createReadStream(tmp));
form.append('upload_preset', 'unsigned');
form.append('folder', 'ecommerce-test');

const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

const response = await fetch(url, {
  method: 'POST',
  body: form,
  headers: {
    Authorization: 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64'),
  },
});
const text = await response.text();
console.log('status', response.status);
console.log('response', text);
fs.unlinkSync(tmp);
