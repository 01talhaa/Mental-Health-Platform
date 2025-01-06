export async function GET(req) {
    try {
      await connectDB();
      const threads = await Thread.find()
        .populate('author', 'name')
        .sort({ createdAt: -1 });
      return NextResponse.json({ threads });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  
  export async function POST(req) {
    try {
      await connectDB();
      const { title, content, category, isAnonymous } = await req.json();
      const thread = await Thread.create({
        title,
        content,
        category,
        isAnonymous,
        author: req.user.id
      });
      return NextResponse.json({ thread }, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }