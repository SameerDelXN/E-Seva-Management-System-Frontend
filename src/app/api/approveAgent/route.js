import { NextResponse } from 'next/server';
import connectDB from '@/utils/mongodb';
import Agent from '@/models/Agent';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    await connectDB();

    try {
        const token = req.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || decoded.role !== "admin") {
            return NextResponse.json({ message: "Access Denied" }, { status: 403 });
        }

        const { agentId, action } = await req.json();
        if (!agentId || !["approve", "reject"].includes(action)) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        const agent = await Agent.findById(agentId);
        if (!agent) {
            return NextResponse.json({ message: "Agent not found" }, { status: 404 });
        }

        agent.status = action === "approve" ? "approved" : "rejected";
        await agent.save();

        return NextResponse.json({ message: `Agent ${action}d successfully` }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}
