'use client';

import { useState } from 'react';
import Sidebar from '@/app/Sidebar';
import Navbar from '@/app/Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // You can get user info here or pass userEmail as prop if needed
  const userEmail = "user@example.com"; // Replace or fetch dynamically

  return (
    <div className="flex h-screen overflow-hidden bg-purple-50">
      {/* Sidebar */}
      <Sidebar 
        userEmail={userEmail} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-grow overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
