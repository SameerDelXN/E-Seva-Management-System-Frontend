const TaskSchema = new mongoose.Schema({
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Staff
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Staff Manager
    status: { 
      type: String, 
      enum: ['pending', 'in_progress', 'completed'], 
      default: 'pending' 
    },
    createdAt: { type: Date, default: Date.now }
  });
  