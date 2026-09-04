import jwt from 'jsonwebtoken';

export async function verifyAuth(req, res, next) {
    const cookieToken = req.cookies.token;

    if (!cookieToken) {
        return res.status(401).json({ error: "Access Denied"});
    }

    try {
        const decoded = jwt.verify(cookieToken, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ error: "Invalid Token OR Expired Session"});
        }

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Access Denied"});
    }
};