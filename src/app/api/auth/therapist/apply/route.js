export async function POST(req) {
    try {
      await connectDB();
      const {
        name, email, phone, nidPassport,
        certificates, experience, price
      } = await req.json();
  
      const therapist = await User.create({
        name,
        email,
        phone,
        nidPassport,
        certificates,
        experience,
        price,
        userType: 'therapist'
      });
  
      return NextResponse.json({ therapist }, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  