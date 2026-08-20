import mongoose, { Schema, Document } from "mongoose";

export interface IPressRelease extends Document {
    title: string;
    slug: string;
    content: string;
    category: string;
    status: "DRAFT" | "PUBLISHED";
    image?: string;
    publishedAt?: Date;
    isActive?: boolean;
    createdBy: mongoose.Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}

const pressReleaseSchema = new Schema<IPressRelease>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
        },

        content: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            default: "GENERAL",
        },

        status: {
            type: String,
            enum: [
                "DRAFT",
                "PUBLISHED",
            ],
            default: "DRAFT",
        },

        image: {
            type: String,
        },

        publishedAt: {
            type: Date,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IPressRelease>(
    "PressRelease",
    pressReleaseSchema
);
