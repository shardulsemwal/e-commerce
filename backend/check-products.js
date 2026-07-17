import 'dotenv/config';
import connectDB from './config/mongodb.js';
import productModel from './models/productModel.js';

const checkProducts = async () => {
  try {
    await connectDB();
    const products = await productModel.find({});
    console.log('Total products:', products.length);
    if (products.length > 0) {
      console.log('First product:', {
        name: products[0].name,
        images: products[0].image
      });
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkProducts();
