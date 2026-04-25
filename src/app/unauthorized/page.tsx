import Link from "next/link";

export const metadata = {
  title: "Unauthorized - HireFlow",
  description: "You don't have permission to access this page",
};

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
        <p className="text-xl text-gray-600 mb-8">
          You don't have permission to access this page
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
