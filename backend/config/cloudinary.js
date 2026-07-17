import {v2 as cloudinary} from 'cloudinary';

const normalizeEnvValue = (value) =>
  String(value ?? "").trim().replace(/^['"]|['"]$/g, "");

const connectCloudinary = () => {
  const cloudName = normalizeEnvValue(process.env.CLOUDINARY_NAME);
  const apiKey = normalizeEnvValue(process.env.CLOUDINARY_API_KEY);
  const apiSecret = normalizeEnvValue(process.env.CLOUDINARY_SECRET_KEY);
  const cloudinaryUrl = normalizeEnvValue(process.env.CLOUDINARY_URL);

  if (cloudinaryUrl) {
    cloudinary.config({
      secure: true,
    });
    return;
  }

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Missing Cloudinary configuration. Set CLOUDINARY_URL or CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET_KEY."
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
};

export default connectCloudinary;