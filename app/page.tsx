import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Welcome to ServiHub 🚀</h1>
          <p className="text-lg text-gray-700 mt-4">
            Hi, I’m Jian Tao — a Computer Science student at NUS, passionate about building systems that are clean, reliable, and user-friendly.
          </p>
          <p className="text-md text-gray-600 mt-2">
            ServiHub is a secure and simple platform for users to submit reports, and for admins to manage and resolve them efficiently.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/create-user">
            <Button className="w-full sm:w-auto text-lg px-6 py-3">I'm a User</Button>
          </Link>
          <Link href="/admin-login">
            <Button variant="outline" className="w-full sm:w-auto text-lg px-6 py-3">
              Admin Login
            </Button>
          </Link>
        </div>

        <div className="text-sm text-gray-500 mt-4">
          <p>
            <strong>Note for Admins:</strong> Please use the secret key <code className="font-mono bg-gray-200 px-1 py-0.5 rounded">adminsecret123</code> to sign in.
          </p>
        </div>
      </div>
    </main>
  );
}
