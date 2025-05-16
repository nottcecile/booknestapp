'use client';

type NavbarProps = {
  toggleSidebar: () => void;
};

export default function Navbar({ toggleSidebar }: NavbarProps) {
  return (
    <header className="flex items-center justify-between bg-pink-200 px-6 py-4 shadow-md md:hidden">
      <button
        onClick={toggleSidebar}
        className="text-pink-700 focus:outline-none"
        aria-label="Toggle menu"
      >
        {/* Hamburger icon */}
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <h1 className="text-pink-700 font-bold text-xl font-serif">BookNest</h1>

      {/* empty div to center title */}
      <div style={{ width: 24 }} />
    </header>
  );
}
