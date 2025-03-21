import { NextResponse } from 'next/server';
import connectDB from '@/utils/mongodb';
import Agent from '@/models/Agent';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import multerS3 from 'multer-s3';
import s3 from '@/utils/s3';

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, `agents/${Date.now()}_${file.originalname}`);
        },
    }),
});

export const config = {
    api: { bodyParser: false },
};

export async function POST(req) {
    await connectDB();

    return new Promise((resolve) => {
        upload.fields([
            { name: 'aadharCard', maxCount: 1 },
            { name: 'shopLicense', maxCount: 1 },
            { name: 'ownerPhoto', maxCount: 1 },
            { name: 'supportingDocument', maxCount: 1 }
        ])(req, {}, async (err) => {
            if (err) {
                return resolve(NextResponse.json({ message: "File upload error", error: err.message }, { status: 500 }));
            }

            const { fullName, mobileNo, email, address, shopName, shopAddress, location, referralCode, username, password } = req.body;

            if (!fullName || !mobileNo || !email || !address || !shopName || !shopAddress || !location || !username || !password) {
                return resolve(NextResponse.json({ message: "All fields are required" }, { status: 400 }));
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const existingAgent = await Agent.findOne({ $or: [{ username }, { mobileNo }] });
            if (existingAgent) {
                return resolve(NextResponse.json({ message: "Username or Mobile Number already exists" }, { status: 400 }));
            }

            const newAgent = await Agent.create({
                fullName,
                mobileNo,
                email,
                address,
                shopName,
                shopAddress,
                aadharCard: req.files?.aadharCard[0]?.location || '',
                shopLicense: req.files?.shopLicense[0]?.location || '',
                ownerPhoto: req.files?.ownerPhoto[0]?.location || '',
                supportingDocument: req.files?.supportingDocument[0]?.location || '',
                location,
                referralCode,
                username,
                password: hashedPassword,
                status: 'pending' // NEW: Default status is pending
            });

            return resolve(NextResponse.json({ message: "Agent registration request submitted. Awaiting approval.", user: newAgent }, { status: 201 }));
        });
    });
}
