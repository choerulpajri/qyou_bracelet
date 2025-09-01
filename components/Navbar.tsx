import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <span className="text-xl font-bold text-blue-600 cursor-pointer">
            Qyou Bracelet
          </span>
        </Link>
        <div className="space-x-4">
          <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
            Dashboard
          </Link>
          <Link href="/login" className="text-gray-700 hover:text-blue-600">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
