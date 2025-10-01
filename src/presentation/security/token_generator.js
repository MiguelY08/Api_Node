import jwt from "jsonwebtoken";

export default class TokenGenerator {
  constructor(secret, expiresIn = "1h") {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  generate(payload) {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verify(token) {
    try {
      const decoded = jwt.verify(token, this.secret);
      return { valid: true, expired: false, payload: decoded };
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return { valid: false, expired: true, payload: null };
      }
      return { valid: false, expired: false, payload: null };
    }
  }
}