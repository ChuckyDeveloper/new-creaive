// models/User.ts
import { Schema, model, models, type Model } from "mongoose";
import bcrypt from "bcryptjs";

export type Role = "user" | "manager" | "admin" | "master";

export interface IUser {
    name: string;          // virtual (คำนวณจาก firstName + lastName)
    username: string;
    firstName: string;
    lastName: string;
    role: Role;

    email: string;
    passwordHash?: string; // ทำให้ optional ใน TS (เพราะ OAuth ไม่ต้องมี)

    company?: string;
    position?: string;
    phone?: string;

    provider?: "google" | "credentials";
    providerId?: string;
    picture?: string;
    emailVerified?: boolean;

    createdAt: Date;
    updatedAt: Date;
}

export interface IUserMethods {
    comparePassword(candidate: string): Promise<boolean>;
}

export type UserModel = Model<IUser, {}, IUserMethods>;

export const ROLES: Role[] = ["user", "manager", "admin", "master"];

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
    {
        username: {
            type: String,
            // required: true,
            trim: true,
            lowercase: true,
            unique: true,
            index: true,
            minlength: 3,
            maxlength: 50,
        },

        // ✅ ทำ required แบบมีเงื่อนไข: ต้องมีเฉพาะบัญชี local (credentials)
        firstName: {
            type: String,
            trim: true,
            maxlength: 100,
            required: function (this: any) {
                return this.provider !== "google"; // google ไม่บังคับ
            },
        },
        lastName: {
            type: String,
            trim: true,
            maxlength: 100,
            required: function (this: any) {
                return this.provider !== "google"; // google ไม่บังคับ
            },
        },

        role: { type: String, enum: ROLES, default: "user", index: true },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            index: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"],
        },

        // ✅ บังคับเฉพาะ provider = credentials เท่านั้น
        passwordHash: {
            type: String,
            select: false,
            required: function (this: any) {
                return this.provider === "credentials";
            },
        },

        company: { type: String, trim: true, maxlength: 200 },
        position: { type: String, trim: true, maxlength: 100 },
        phone: {
            type: String,
            trim: true,
            match: [/^\+?[0-9\- ()]{7,20}$/, "Invalid phone number"],
        },

        provider: {
            type: String,
            enum: ["google", "credentials"],
            default: "credentials",
            index: true,
        },
        providerId: { type: String, index: true },
        picture: { type: String },
        emailVerified: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,               // ✅ เปิด virtuals ใน JSON
            transform(_doc, ret) {
                delete ret.passwordHash;    // ซ่อน hash
                return ret;
            },
        },
        toObject: {
            virtuals: true,               // ✅ เปิด virtuals ใน Object
            transform(_doc, ret) {
                delete ret.passwordHash;
                return ret;
            },
        },
    }
);

const User = (models.User as UserModel) || model<IUser, UserModel>("User", UserSchema);
export default User;