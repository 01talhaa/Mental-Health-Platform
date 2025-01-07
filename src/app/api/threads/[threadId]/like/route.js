export async function POST(req, { params }) {
    try {
      await connectDB();
      const { threadId } = params;
      
      const thread = await Thread.findById(threadId);
      if (!thread) throw new Error('Thread not found');
  
      const userLikeIndex = thread.likes.indexOf(req.user.id);
      if (userLikeIndex === -1) {
        thread.likes.push(req.user.id);
      } else {
        thread.likes.splice(userLikeIndex, 1);
      }
  
      await thread.save();
      return NextResponse.json({ thread });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }