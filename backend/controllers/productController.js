import {v2 as cloudinary} from "cloudinary";
import productModel from "../models/productModel.js";

const parseSizes = (value) => {
    if (Array.isArray(value)) {
        return value;
    }
    if (typeof value !== "string") {
        return [];
    }
    const trimmedValue = value.trim();
    if (!trimmedValue) {
        return [];
    }
    try {
        const parsedValue = JSON.parse(trimmedValue);
        if (Array.isArray(parsedValue)) {
            return parsedValue;
        }
    } catch (error) {
        // Fall back to comma-separated values from Postman form-data.
    }
    return trimmedValue.split(",").map((item) => item.trim()).filter(Boolean);
};
const uploadImage = async (file, req) => {
    return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
};


const addProduct = async (req, res) => {
    console.log("add product api hit");4
    try {
        const { name, description, price, category, subCategory } = req.body;
        const sizes = parseSizes(req.body.sizes);
        const bestseller = req.body.bestseller === true || req.body.bestseller === "true";

        const imageFiles = [
            req.files?.image1?.[0],
            req.files?.image2?.[0],
            req.files?.image3?.[0],
            req.files?.image4?.[0]
        ].filter(Boolean);

        console.log("req.body=", req.body);
        console.log("req.files=", req.files);
        console.log("name=", name);
        console.log("description=", description);
        console.log("price=", price);
        console.log("category=", category);
        console.log("subCategory=", subCategory);
        console.log("bestseller=", bestseller);
        console.log("sizes=", sizes);
        console.log("imageFiles=", imageFiles.length);

        if (!name || !description || !price || !category || !subCategory || !sizes.length || !imageFiles.length) {
            return res.status(400).json({ success: false, message: "Missing required product fields" });
        }
        const uploadedImageUrls = await Promise.all(imageFiles.map((file) => uploadImage(file, req)));
        const product = await productModel.create({
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            image: uploadedImageUrls,
            sizes,
            bestseller,
            date: Date.now()
        });

        res.json({ success: true, message: "Product added successfully", product });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
const listProducts = async (req, res) => {
    try{
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const removeProduct = async (req, res) => {
    try{
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product removed successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
const singleProduct = async (req, res) => {

}
export { addProduct, listProducts, removeProduct, singleProduct };
