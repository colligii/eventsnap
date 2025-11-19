import NextAuth from "next-auth";
import Google from "next-auth/providers/google"
 
console.log(process.env.GOOGLE_CLIENT_ID);
console.log(process.env.GOOGLE_CLIENT_SECRET);

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [Google],
  })