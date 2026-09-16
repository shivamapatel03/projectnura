import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <h2 className="text-3xl font-bold text-gray-900">Page Not Found</h2>
      <p className="mt-2 text-sm text-gray-500">The page you are looking for does not exist.</p>
      <Link href="/" className="button-20 mt-6">
        Return Home
      </Link>
    </div>
  );
}
