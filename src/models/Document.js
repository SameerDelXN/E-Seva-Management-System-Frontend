const DocumentSchema = new mongoose.Schema({
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true }, // PDF, JPG, PNG, etc.
    createdAt: { type: Date, default: Date.now }
  });
  