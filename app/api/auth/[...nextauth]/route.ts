import NextAuth, {
  Account,
  NextAuthOptions,
  User as AuthUser,
} from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../v1/(auth)/users/models/user";
import connect from "@/database/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials: any) {
        await connect();

        try {
          const user = await User.findOne({ email: credentials.email });

          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (isPasswordCorrect) {
              return user;
            }
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({
      user,
      account,
    }: {
      user: AuthUser;
      account: Account | null;
      profile?: any;
      email?: any;
      credentials?: Record<string, unknown>;
    }) {
      if (account?.provider == "credentials") {
        return true;
      }

      // Handle OAuth providers (GitHub, Google, Facebook)
      if (
        account &&
        ["github", "google", "facebook"].includes(account?.provider)
      ) {
        await connect();
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            // Generate a username from email if not provided
            let baseUsername: string;
            if (user.name) {
              baseUsername = user.name.replace(/\s/g, "").toLowerCase();
            } else {
              baseUsername = user.email ? user.email.split("@")[0] : "user";
            }
            const username = baseUsername + Math.floor(Math.random() * 1000);

            const newUser = new User({
              email: user.email,
              username: username,
            });

            await newUser.save();
            return true;
          }
          return true;
        } catch (err) {
          console.log(`Error saving user from ${account.provider}`, err);
          return false;
        }
      }

      return false;
    },

    async session({ session, token }) {
      // You can add custom session handling here if needed
      return session;
    },

    async jwt({ token, user }) {
      // You can add custom JWT handling here if needed
      return token;
    },
  },
  pages: {
    signIn: "/login",
    //signOut: "/",
    //error: "/login", // Error code passed in query string as ?error=
    //verifyRequest: "/login", // (used for check email message)
    //newUser: "/register", // New users will be directed here on first sign in
  },
  session: {
    strategy: "jwt",
  },
  //secret: process.env.NEXTAUTH_SECRET,
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
