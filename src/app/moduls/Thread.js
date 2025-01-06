const ThreadSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    category: String,
    isAnonymous: Boolean,
    isLocked: Boolean,
    isPinned: Boolean,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 },
    replies: [{
      content: String,
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      isAnonymous: Boolean,
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      isHelpful: Boolean,
      createdAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
  });
  
  export default mongoose.models.Thread || mongoose.model('Thread', ThreadSchema);
  