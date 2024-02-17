import NextAuth from "next-auth/next";
import { Identifier, PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from 'bcrypt'
import { Session, DefaultSession, NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import prisma from "../../../../lib/prismadb";
export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "email", type: "text", placeholder: "jsmith" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials) {
              
              if (!credentials?.email || !credentials?.password) {
                  throw new Error('Invalid credentials');
                }

                const user = await prisma.usser.findUnique({
                  where: {
                    email: credentials.email
                  },
                });

                if (!user || !user?.password) {
                  throw new Error('Invalid credentials');
                }

                const isCorrectPassword = await bcrypt.compare(
                  credentials.password,
                  user.password
                );

                if (!isCorrectPassword) {
                  throw new Error('Invalid credentials');
                }

                const userWithFiles = await prisma.usser.findUnique({
                  where: {
                    user_id: user?.user_id
                  },
                  include: {
                    files: {
                      where: {
                        user_id: user?.user_id,
                        identifier: 'userPicture'
                      }
                    },
                  },
                });
              
                return userWithFiles as any;
              },
            }),
    ],
  callbacks: {
    async jwt({ token, user}: any) {
    
        if(user) {
          const userRoles = await prisma.usser.findUnique({
            where: {
              user_id: user?.user_id
            },
            select: {
              user_rol: {
                select: {
                  rol: {
                    select: {
                      rol_name: true
                    }
                  }
                }
              },
            },
          });
  
          const roleNames = userRoles?.user_rol.map(userRol => userRol.rol.rol_name);
          token.roles = roleNames;
          token.id = user.user_id;
          token.user = user;
        }
        return token;       
    },

    async session({ session, token, user }: {
      session: Session;
      token: JWT;
      user: any;
    }): Promise<Session | DefaultSession> {
      if (session.user) {
        session.user.id = token.id;
        session.user = token.user;
      }
      return session;
    }
  },
    secret: process.env.SECRET_KEY,
    session: {
        strategy: "jwt",
    },
    debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST}