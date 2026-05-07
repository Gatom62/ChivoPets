import mongoose, { Schema, model } from "mongoose";
import { type } from "node:os";
/**
 * name
 * lastName
 * email
 * password
 * phone
 * address
 * isActive
 */

const userSchema = new Schema(
    {
        name: {
            type: String
        },
        lastName: {
            type: String
        },
        email: {
            type: String
        },
        password: {
            type: String
        },
        phone: {
            type: String
        },
        address: {
            type: String
        },
        isActive: {
            type: Boolean
        }
    },
    {
        timestamps: true,
        strict: false
    }
)

export default model("Users", userSchema)