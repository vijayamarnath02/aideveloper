import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        mobile: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        }
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);

