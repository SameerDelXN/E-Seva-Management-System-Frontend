import { NextResponse } from 'next/server';
import connectDB from '@/utils/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Developer Password for Admin Creation
const DEVELOPER_PASSWORD = process.env.DEVELOPER_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

// Validation functions
const isValidEmail = (email) => /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email);
const isValidPhone = (phone) => /^\d{10}$/.test(phone);

export async function POST(req) {
    await connectDB();

    try {
        const body = await req.json();
        const { name, email, phone, password, role, devPassword, authToken } = body;

        // Validate required fields
        if (!name || !email || !phone || !password || !role) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
        }

        // Validate phone number
        if (!isValidPhone(phone)) {
            return NextResponse.json({ message: "Phone number must be exactly 10 digits" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (role === 'admin') {
            if (!devPassword || devPassword !== DEVELOPER_PASSWORD) {
                return NextResponse.json({ message: "Unauthorized: Invalid Developer Password" }, { status: 403 });
            }

            let admin = await User.findOne({ role: 'admin' });

            if (admin) {
                admin.name = name;
                admin.email = email;
                admin.phone = phone;
                admin.password = hashedPassword;
                await admin.save();
            } else {
                admin = await User.create({ name, email, phone, password: hashedPassword, role: 'admin' });
            }

            const token = jwt.sign({ id: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
            return NextResponse.json({ message: "Admin updated successfully", token, user: admin }, { status: 200 });
        } 
        else if (role === 'staff_manager' || role === 'staff') {
            if (!authToken) {
                return NextResponse.json({ message: "Unauthorized: Admin token required" }, { status: 401 });
            }

            try {
                const decoded = jwt.verify(authToken, JWT_SECRET);
                if (decoded.role !== 'admin') {
                    return NextResponse.json({ message: "Unauthorized: Only Admin can add Staff Manager or Staff" }, { status: 403 });
                }
            } catch (error) {
                return NextResponse.json({ message: "Invalid or Expired Token" }, { status: 403 });
            }

            const newUser = await User.create({ name, email, phone, password: hashedPassword, role });
            const token = jwt.sign({ id: newUser._id, role: role }, JWT_SECRET, { expiresIn: '7d' });
            return NextResponse.json({ message: `${role} added successfully`, token, user: newUser }, { status: 201 });
        } 
        else {
            return NextResponse.json({ message: "Invalid role provided" }, { status: 400 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}
