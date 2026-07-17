import express from "express";
import { listProducts, addProduct, removeProduct, singleProduct } from "../controllers/productController.js";
import upload from "../middleware/multer.js"
import adminAuth from "../middleware/adminAuth.js";
const productRouter = express.Router();

productRouter.get("/list", listProducts);
productRouter.post(
  "/debug",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 }
  ]),
  adminAuth,
  (req, res) => {
    const filesMeta = Object.entries(req.files || {}).reduce((acc, [key, value]) => {
      acc[key] = value.map((file) => ({ originalname: file.originalname, mimetype: file.mimetype, size: file.size, bufferLength: file.buffer?.length }));
      return acc;
    }, {});
    res.json({ body: req.body, files: filesMeta });
  }
);
productRouter.post(
  "/add",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 }
  ]),
  adminAuth,
  addProduct
);
productRouter.post("/remove",adminAuth, removeProduct);
productRouter.post("/single", singleProduct);

export default productRouter;


