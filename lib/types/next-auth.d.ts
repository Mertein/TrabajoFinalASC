import NextAuth from "next-auth";
import { User } from "./intefaces";
import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {

  interface JWT {
     roles: string[] | undefined;
  }
}

import { DefaultSession } from "next-auth";

// declare module "next-auth" {
//   interface Session {
//     user?: {
//       user_id: string;
//       user: [];
//     } & DefaultSession["user"];
//   }
// }

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User;
  }
}