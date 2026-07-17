import 'dotenv/config';
import connectDB from './config/mongodb.js';
import productModel from './models/productModel.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import connectCloudinary from './config/cloudinary.js';

connectCloudinary();

const getFilenameFromUrl = (imageUrl) => {
  try {
    if (imageUrl.includes('://')) {
      const parsedUrl = new URL(imageUrl);
      return path.basename(parsedUrl.pathname);
    }
  } catch (error) {
    // ignore and fall back to string split
  }
  return path.basename(imageUrl.split('?')[0]);
};

const migrateImages = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const products = await productModel.find({});
    console.log(`Found ${products.length} products to migrate`);

    for (const product of products) {
      console.log(`Migrating images for: ${product.name}`);
      
      const newImageUrls = [];
      
      for (const imageUrl of product.image) {
        const filename = getFilenameFromUrl(imageUrl);
        const localPath = path.join(process.cwd(), 'uploads', filename);

        if (imageUrl.includes('res.cloudinary.com')) {
          newImageUrls.push(imageUrl);
          console.log(`  Skipped already-Cloudinary image: ${imageUrl}`);
          continue;
        }
        
        if (fs.existsSync(localPath)) {
          try {
            const result = await cloudinary.uploader.upload(localPath, {
              resource_type: 'auto',
              folder: 'ecommerce-products'
            });
            newImageUrls.push(result.secure_url || result.url);
            console.log(`  Uploaded ${filename} -> ${result.secure_url || result.url}`);
          } catch (error) {
            console.error(`  Failed to upload ${filename}:`, error.message);
            newImageUrls.push(imageUrl);
          }
        } else {
          console.log(`  Local file not found: ${filename}, keeping old URL`);
          newImageUrls.push(imageUrl);
        }
      }
      
      product.image = newImageUrls;
      await product.save();
      console.log(`  Updated product: ${product.name}\n`);
    }

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateImages();
