import jwt from 'jsonwebtoken';
import fs from "fs/promises";

const cleanupUploadedFiles = async (files) => {
    const uploadedFiles = Object.values(files || {}).flat().filter(Boolean);
    await Promise.allSettled(
        uploadedFiles.map((file) => file?.path && fs.unlink(file.path))
    );
};

const adminAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const tokenHeader = req.headers.token;
        const bodyToken = req.body?.token;
        const queryToken = req.query?.token;
        const token = authHeader?.startsWith("Bearer ")
            ? authHeader.slice(7)
            : authHeader || tokenHeader || bodyToken || queryToken;

        if (!token) {
            await cleanupUploadedFiles(req.files);
            return res.status(401).json({
                message: 'No token provided. Send Authorization: Bearer <token> or add a token field.'
            });
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        const isValidAdminToken =
            (typeof token_decode === "object" &&
                token_decode !== null &&
                token_decode.role === "admin" &&
                token_decode.email === process.env.ADMIN_EMAIL) ||
            token_decode === process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD;

        if (!isValidAdminToken) {
            await cleanupUploadedFiles(req.files);
            return res.status(401).json({ message: 'Unauthorized' });
        }

        next();
    } catch (error) {
        await cleanupUploadedFiles(req.files);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default adminAuth;
