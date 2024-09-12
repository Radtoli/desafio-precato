import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.AUTH_TOKEN;

export const validateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: "Token não informado" });
    }
    if (token != secretKey) {
        return res.status(403).json({ error: "Token inválido" });
        
    } else {
        next();
    }
    
};