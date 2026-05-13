import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        mobile: { type: String, unique: true, sparse: true },
        password: { type: String, required: true },
        authProvider: {
            type: String,
            enum: ["credentials", "google", "github"],
            default: "credentials",
        },
        resetPasswordTokenHash: { type: String },
        resetPasswordExpires: { type: Date },
        status: { type: String, enum: ["active", "inactive"], default: "active" },
    },
    { timestamps: true }
);

UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = function (candidate: string) {
    if (!this.password) return false;
    return bcrypt.compare(candidate, this.password);
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
