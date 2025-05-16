'use client';

import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import Sidebar from '../Sidebar';

export default function ProfilePage() {
  const [user] = useAuthState(auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-pink-50">
      {/* Sidebar */}
      <Sidebar
        userEmail={user?.email || 'Guest'}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 p-8 relative">
        {/* Hamburger toggle for mobile */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="sm:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-pink-500 text-white"
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d={sidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M3 12h18M3 6h18M3 18h18'} />
          </svg>
        </button>

        <h1 className="text-3xl font-bold text-pink-700 mb-6">👤 Your Profile</h1>

        <div className="bg-white rounded-2xl shadow-md p-6 max-w-xl w-full">
          <div className="flex items-center gap-4 mb-4">
            <img
              src="/avatar-placeholder.png"
              alt="Avatar"
              className="w-16 h-16 rounded-full border border-pink-200"
            />
            <div>
              <p className="text-xl font-semibold text-pink-800">
                {user?.displayName || 'Anonymous User'}
              </p>
              <p className="text-sm text-pink-600 break-words">{user?.email}</p>
            </div>
          </div>

          <div className="text-gray-700 text-sm leading-relaxed">
            <p>Welcome to your personal space. In the future, you’ll be able to edit your profile, track reading progress, and more.</p>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
