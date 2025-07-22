"use client";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

import React from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (status === "unauthenticated") {
    return <div>You need to be authenticated to view this page.</div>;
  }
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">User Information</h2>
        <p className="text-gray-700 mb-2">
          <strong>Name:</strong>
          {session?.user.name ||
            `${session?.user.firstName} ${session?.user.middleName} ${session?.user.lastName}`}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Email:</strong>
          {session?.user.email}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Role:</strong> {session?.user.role || "N/A"}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Phone:</strong> {session?.user.phone || "N/A"}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Active:</strong> {session?.user.isActive ? "Yes" : "No"}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Email Verified:</strong>{" "}
          {session?.user.isEmailVerified ? "Yes" : "No"}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Phone Verified:</strong>{" "}
          {session?.user.isPhoneVerified ? "Yes" : "No"}
        </p>
        {session?.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || "User Image"}
            className="w-24 h-24 rounded-full mt-4"
          />
        )}
        {/* sigout */}
        <div className="mt-4">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
