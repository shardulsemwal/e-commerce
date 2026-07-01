# Postman setup for product uploads

Use `multipart/form-data` in Postman for the `POST /api/product/add` request.

Required form-data fields:

- `name` - text
- `description` - text
- `price` - text or number
- `category` - text
- `subCategory` - text
- `sizes` - text; use JSON like `["S","M","L"]` or comma-separated values like `S,M,L`
- `bestseller` - text; use `true` or `false`
- `image1` - file
- `image2` - file
- `image3` - file
- `image4` - file

Notes:

- The backend uploads the received files to Cloudinary.
- You only need to send the image fields you want to attach.
- The route is already wired in [backend/routes/productRoute.js](routes/productRoute.js).