import mongoose, { Schema } from "mongoose";

const mailboxesSchema = new Schema(
    {
        firstName: {
            type: String,
            // required: true,
        },
        lastName: {
            type: String,
            // required: true,
        },
        email: {
            type: String,
            // required: true,
        },
        country: {
            type: String,
            // required: false,
        },
        company: {
            type: String,
            // required: false,
        },
        phone: {
            type: String,
            // required: false,
        },
        subject: {
            type: String,
            // required: false,
        },
        detail: {
            type: String,
            // required: false,
        },
        unread: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

const Mailbox = mongoose.models.Mailbox || mongoose.model("Mailbox", mailboxesSchema);

export default Mailbox;
