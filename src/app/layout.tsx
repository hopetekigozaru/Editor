import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopMenuBtn from "@/components/TopMenuBtn";
import React, { ReactNode } from "react";
import ThemeRegistry from "./ThemeRegistry";
import PageTitle from "@/components/PageTitle";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Editor",
  description: "This is Editor",
};



type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <ThemeRegistry options={{ key: 'mui' }}>
          <main className="h-screen min-w-[100vw]  text-white overflow-hidden">
            <header className="fixed w-screen top-0 left-0 h-[10vh] bg-primary">
              <div className="h-full flex justify-between items-center w-full">
                <div className="w-1/2 flex items-center">
                  <p className="text-3xl font-bold pl-10 ">
                    Editor
                  </p>
                  <PageTitle />
                </div>
                <div className='w-1/2 h-[5%] flex justify-end items-center'>
                  <TopMenuBtn />
                </div>
              </div>
            </header>
            <div className="w-screen h-[10vh]"></div>
            {children}
          </main>
        </ThemeRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
