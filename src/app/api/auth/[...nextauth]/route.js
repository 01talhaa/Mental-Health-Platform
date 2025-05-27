import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import User from '@/app/moduls/User';
import connectDB from '@/app/lib/mongodb';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        anonymousCode: { label: "Anonymous Code", type: "text" }
      },
      async authorize(credentials) {
        try {
          await connectDB();

          // Handle anonymous login
          if (credentials.anonymousCode) {
            const user = await User.findOne({ 
              anonymousCode: credentials.anonymousCode,
              userType: 'anonymous'
            });
            
            if (!user) {
              throw new Error('Invalid session code');
            }
            
            return {
              id: user._id.toString(),
              anonymousCode: user.anonymousCode,
              userType: 'anonymous'
            };
          }

          // Handle regular login
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please enter both email and password');
          }

          const user = await User.findOne({ email: credentials.email });
          
          if (!user) {
            throw new Error('No user found with this email');
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          
          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.avatarUrl,
            userType: user.userType
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      }
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectDB();

        if (account.provider === 'google' || account.provider === 'facebook') {
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              avatarUrl: user.image,
              userType: 'regular',
              provider: account.provider
            });
          }
        }
        return true;
      } catch (error) {
        console.error('SignIn callback error:', error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.userType = user.userType;
        if (account) {
          token.provider = account.provider;
          token.accessToken = account.access_token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
        session.user.userType = token.userType;
        session.accessToken = token.accessToken;
        session.provider = token.provider;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };