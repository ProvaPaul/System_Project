import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    skills: [{ type: String }],
    experience: { type: String },
    education: { type: String },
    profile: {
        bio: { type: String },
        location: { type: String },
        website: { type: String },
        github: { type: String },
        linkedin: { type: String }
    },
    applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }]
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
