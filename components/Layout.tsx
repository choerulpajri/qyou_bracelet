import { ReactNode } from "react";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6">{children}</main>
      <footer className="bg-gray-100 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Qyou Bracelet
      </footer>
    </div>
  );
}
