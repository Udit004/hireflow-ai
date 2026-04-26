"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { ProtectedRoute } from "@/features/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
        {/* Navigation */}
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">HireFlow</h1>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
            >
              Logout
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome, {user?.displayName}!</h2>
            <p className="text-gray-600">You are logged in as: <span className="font-semibold">{user?.email}</span></p>
          </div>

          {/* User Information Card */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-lg font-semibold text-gray-900">{user?.displayName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Type</p>
                <p className="text-lg font-semibold text-blue-600 capitalize">{user?.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user?.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Role-Based Actions */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user?.role === "recruiter" && (
                <Link
                  href="/create-test"
                  className="block p-6 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
                >
                  <h4 className="font-semibold text-blue-900 mb-2">Create Test</h4>
                  <p className="text-sm text-blue-700">
                    Generate interview tests from job descriptions
                  </p>
                </Link>
              )}
              <div className="block p-6 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Take Test</h4>
                <p className="text-sm text-green-700">
                  Open a shared candidate URL in the format /test/slug to take a test.
                </p>
              </div>

            </div>
          </div>

          {/* Permissions Info */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-2">Your Permissions</h4>
            <ul className="list-disc list-inside text-blue-800 text-sm space-y-1">
              {user?.role === "candidate" && (
                <>
                  <li>Take tests and view results</li>
                  <li>View your test history</li>
                </>
              )}
              {user?.role === "recruiter" && (
                <>
                  <li>Create tests from job descriptions</li>
                  <li>Manage your created tests</li>
                  <li>View candidate responses</li>
                  <li>Take tests</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
