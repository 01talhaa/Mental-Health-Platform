// lib/getSession.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { headers } from "next/headers";

// Use this function in Server Components only
export async function getSession() {
  try {
    // Ensure it's called in a request context
    const session = await getServerSession(authOptions);
    return session;
  } catch (error) {
    console.error('Error fetching session:', error);
    return null;
  }
}

// For client components, use the useSession hook from next-auth/react:
// import { useSession } from "next-auth/react";
// const { data: session } = useSession();