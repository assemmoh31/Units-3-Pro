import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AdUnit from './AdUnit';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Navbar />
      
      {/* Header Ad Slot - Placeholder ID */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <AdUnit slot="1234567890" className="min-h-[90px]" />
      </div>

      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;