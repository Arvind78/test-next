import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDb } from "@/lib/database";
import Otp from "@/models/Otp";

export const NEXT_AUTH_CONFIG = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT ?? "",
            clientSecret: process.env.GOOGLE_SECRET ?? ""
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                username: { label: 'email', type: 'text', placeholder: '' },
                password: { label: 'password', type: 'password', placeholder: '' },
            },
            async authorize(credentials: any) {
                console.log(credentials, "credetials")
                return {
                    id: "user1",
                    name: "asd",
                    userId: "asd",
                    email: "ramdomEmail"
                };
            },
        }),
        CredentialsProvider({
            id: 'email-otp',
            name: 'Email-OTP',
            credentials: {
                email: { label: 'Email', type: 'text' },
                otp: { label: 'OTP', type: 'text' },
            },
            async authorize(credentials) {
                await connectDb(); // Connect to DB
                console.log("db connected --------------------------------------------------> ")
                const { email, otp }: any = credentials;
                console.log(email, otp)

                // Check if OTP exists and is valid 
                const otpEntry = await Otp.findOne({ email, otp });
                if (!otpEntry || otpEntry.expiresAt < new Date()) {
                    throw new Error('Invalid or expired OTP');
                }

                // Optionally, delete the OTP after successful verification
                await Otp.deleteOne({ _id: otpEntry._id });

                // Return a user object with the required 'id' field
                return { id: email, email };
            }
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        jwt: async ({ user, token }: any) => {
            if (user) {
                token.uid = user.id;
            }
            return token;
        },
        session: ({ session, token, user }: any) => {
            console.log(user)
            if (session.user) {
                session.user.id = token.uid;
                session.user.email = token.email;
            }
            return session;
        },
        signIn: async ({ user, account, profile }: any) => {
            console.log(profile, "profile", user, "user")
            if (account.provider === "google") {
                 console.log(profile, "provider", account.provider,user)
                return true;
            }
            return true;
        },
        redirect: async ({ url, baseUrl }) => {
            console.log(url, baseUrl)
            return baseUrl ;
        }
    },

    pages: {
        signIn: '/signin',
    }
}


 
