import TokenGenerator from "../security/token_generator.js";

const tokenGenerator = new TokenGenerator(process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN || "10m");

export function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Token requerido" })
    }

    const result = tokenGenerator.verify(token);

    if (!result.valid) {
        if (result.expired) {
            return res.status(403).json({ error: "Token expirado" })
        }
        return res.status(403).json({ error: "Token invalido" })
    }

    req.user = result.payload;
    next()
}