import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {

    // Support token in either `token` header or `Authorization: Bearer <token>`
    let token = req.headers.token;
    if (!token && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ');
        if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
            token = parts[1];
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized. Login again." });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = token_decode.id;
        next();

    } catch (error) {
        console.error('authUser error:', error);
        return res.status(401).json({ success: false, message: error.message || 'Invalid token' });

    }
}

export default authUser;