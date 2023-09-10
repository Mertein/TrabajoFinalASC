import ToasterProvider from '../Providers/ToasterProvider';
import './globals.css'
import LoginModal from "./components/modals/loginModal"
import RegisterModal from "./components/modals/registerModal"
import RolModal from "./components/modals/rolModal"
import React from "react";
import Providers from "@/Providers/AuthContext";
import getCurrentUser from "./actions/getCurrentUser";

export const metadata = {
  title: 'Academia AL',
  description: 'Academia AL',
}

export default async function RootLayout({children}: {
  children: React.ReactNode
}) {

  const currentUser = await getCurrentUser();
  return (
    <html lang="es">
    <body>
    <Providers>
      {/* <ClientOnly> */}
        <ToasterProvider />
        <LoginModal/>
        <RolModal user={currentUser}/>
        <RegisterModal />
      {/* </ClientOnly> */}
      {children}
    </Providers>
    </body>
    </html>
  )
}