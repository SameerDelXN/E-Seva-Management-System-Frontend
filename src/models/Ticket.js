const TicketSchema = new mongoose.Schema({
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceType: { type: String, required: true }, // e.g., "PAN Card", "Aadhar Correction"
    documentUrls: [{ type: String, required: true }], // Uploaded document links
    status: { 
      type: String, 
      enum: ['pending', 'assigned', 'in_progress', 'completed', 'delivered'], 
      default: 'pending' 
    },
    assignedStaffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Staff Manager
    createdAt: { type: Date, default: Date.now }
  });
  