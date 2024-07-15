import { Inter } from "next/font/google"
import InitUser from "./_components/InitUser";
import TopBar from "./_components/TopBar";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chatin",
  description: "Created by Hitesh Mishra",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <InitUser />
        <TopBar />
        {children}
      </body>
    </html>
  );
}


