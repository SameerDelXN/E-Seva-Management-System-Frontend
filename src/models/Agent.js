import mongoose from 'mongoose';

const AgentSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    mobileNo: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    shopName: { type: String, required: true },
    shopAddress: { type: String, required: true },
    aadharCard: { type: String, required: true }, 
    shopLicense: { type: String, required: true }, 
    ownerPhoto: { type: String, required: true }, 
    supportingDocument: { type: String, required: true }, 
    location: { type: String, required: true },
    referralCode: { type: String },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String,  default: 'pending' }, // NEW FIELD
}, { timestamps: true });

export default mongoose.models.Agent || mongoose.model('Agent', AgentSchema);
