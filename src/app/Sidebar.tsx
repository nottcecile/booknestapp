'use client';

import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

type SidebarProps = {
  userEmail: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ userEmail, isOpen, onClose }: SidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <div
      className={`
        bg-pink-100 p-6 flex flex-col justify-between z-50
        transition-transform duration-300 ease-in-out
        w-64
        h-screen
        fixed top-0 left-0 transform
        ${isOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full'}
        sm:translate-x-0 sm:static sm:shadow-none
      `}
    >
      <div>
        {/* Top Logo + Mobile Close */}
        <div className="flex items-center justify-between mb-8 sm:hidden">
          <h2 className="text-2xl font-bold text-pink-700 font-serif">📚 BookNest</h2>
          <button
            aria-label="Close sidebar"
            onClick={onClose}
            className="text-pink-700 text-2xl font-bold focus:outline-none"
          >
            ×
          </button>
        </div>

        {/* Desktop title */}
        <h2 className="hidden sm:block text-2xl font-bold text-pink-700 mb-8 font-serif">📚 BookNest</h2>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-4">
          {[
            { label: 'Home', path: '/dashboard' },
            { label: 'Books', path: '/books' },
            { label: 'Categories', path: '/categories' },
            { label: 'Favorites', path: '/favorites' },
            { label: 'Profile', path: '/profile' },
          ].map(({ label, path }) => (
            <button
              key={label}
              className="text-pink-700 font-semibold hover:text-pink-900 text-left"
              onClick={() => {
                router.push(path);
                onClose();
              }}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* User Info + Logout */}
      <div className="mt-8">
        <p className="text-pink-800 mb-1 text-sm">Logged in as:</p>
        <p className="text-pink-900 font-semibold mb-3 text-sm break-words">{userEmail}</p>
        <button
          onClick={handleLogout}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md text-sm"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
