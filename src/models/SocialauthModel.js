import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRE } from "../config"
const SocialSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "email required"],
        unique: [true, "email already registered"],
    },
    firstName: String,
    lastName: String,
    profilePhoto: String,
    password: String,
    source: { type: String, required: [true, "source not specified"] },
    lastVisited: { type: Date, default: new Date() },
    googleVerified: { type: Boolean, default: false },
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

const SocialauthModel = mongoose.model("Socialauth", SocialSchema);

export default SocialauthModel;
