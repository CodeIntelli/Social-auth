import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRE } from "../config"
const SocialSchema = new mongoose.Schema({
    name: { type: String },
    googleId: { type: String },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, expires: 1200 },
});

// JWT TOKEN
SocialSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE,
    });
};

const SocialauthModel = mongoose.model("TokenVerification", SocialSchema);

export default SocialauthModel;
