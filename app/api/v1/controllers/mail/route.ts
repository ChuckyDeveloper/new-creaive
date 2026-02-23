

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { connectDB } from "../../lib/db";
import Mailbox from "../../models/Mail";
import { requireRole } from "../../lib/auth";
import { logger } from "../../lib/logger";

export async function POST(req: NextRequest) {
    try {
        logger.request(req, "mail POST start");
        const body = await req.json();
        const {
            firstName,
            lastName,
            email,
            country,
            company,
            phone,
            subject,
            detail,
        } = body;

        await connectDB();
        const newMail = await Mailbox.create({
            firstName,
            lastName,
            email,
            country,
            company,
            phone,
            subject,
            detail,
        });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Contact Form" <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_RECEIVER,
            subject: subject || "New Contact Message",
            html: `
                <h3>New Contact Submission</h3>
                <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Country:</strong> ${country}</p>
                <p><strong>Company:</strong> ${company}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong><br/>${detail}</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        logger.response(req, 200, { id: newMail._id });
        return NextResponse.json({ success: true, message: "Mail sent and saved." });
    } catch (err) {
        logger.failure(req, err);
        return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const gate = requireRole(req, ["master"]);
    if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

    try {
        logger.request(req, "mail GET list");
        await connectDB();
        const mails = await Mailbox.find().sort({ createdAt: -1 }).lean();
        logger.response(req, 200, { count: mails.length });
        return NextResponse.json(mails);
    } catch (err) {
        logger.failure(req, err);
        return NextResponse.json({ error: "Failed to retrieve messages." }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const gate = requireRole(req, ["master"]);
    if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

    try {
        const { id, unread } = await req.json();
        logger.request(req, "mail PATCH", { id, unread });

        if (!id) {
            return NextResponse.json({ error: "Missing mail id." }, { status: 400 });
        }
        await connectDB();
        const updated = await Mailbox.findByIdAndUpdate(
            id,
            { $set: { unread: unread } },
            { new: true }
        ).lean();
        if (!updated) {
            return NextResponse.json({ error: "Mail not found." }, { status: 404 });
        }
        logger.response(req, 200, { id, unread });
        return NextResponse.json({ success: true, mail: updated });
    } catch (err) {
        logger.failure(req, err);
        return NextResponse.json({ error: "Failed to update message." }, { status: 500 });
    }
}
