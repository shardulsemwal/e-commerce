import fs from "fs";
import path from "path";

const tmp = path.join(process.cwd(), "debug-temp.png");
fs.writeFileSync(tmp, Buffer.from([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A,0x00,0x00,0x00,0x0D,0x49,0x48,0x44,0x52,0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x01,0x08,0x02,0x00,0x00,0x00,0x90,0x77,0x53,0xDE,0x00,0x00,0x00,0x0A,0x49,0x44,0x41,0x54,0x78,0x9C,0x63,0x60,0x00,0x00,0x00,0x02,0x00,0x01,0xE2,0x21,0xBC,0x33,0x00,0x00,0x00,0x00,0x49,0x45,0x4E,0x44,0xAE,0x42,0x60,0x82]));

const loginResp = await fetch("http://localhost:4000/api/user/admin", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "admin@forever.com", password: "qwerty123" }),
});
console.log("login status", loginResp.status);
const loginBody = await loginResp.text();
console.log("login body", loginBody);
const loginJson = JSON.parse(loginBody);
if (!loginJson.token) {
  fs.unlinkSync(tmp);
  process.exit(1);
}
const token = loginJson.token;

const form = new FormData();
form.append("name", "Test Cloudinary 1");
form.append("description", "Test desc");
form.append("category", "Women");
form.append("subCategory", "Topwear");
form.append("price", "99");
form.append("sizes", JSON.stringify(["S", "M"]));
form.append("bestseller", "true");
form.append("image1", fs.createReadStream(tmp));

const addResp = await fetch("http://localhost:4000/api/product/add", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: form,
});
console.log("add status", addResp.status);
console.log("add body", await addResp.text());
fs.unlinkSync(tmp);
