import { NextResponse } from 'next/server';
import connectDB from '@/utils/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const POST = async (req) => {
    try {
        await connectDB();

        const { email, password, role } = await req.json(); // Parse request body

        if (!email || !password || !role) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }

        // Check role
        if (user.role !== role) {
            return NextResponse.json({ message: "Access denied for this role" }, { status: 403 });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return NextResponse.json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error", error }, { status: 500 });
    }
};
