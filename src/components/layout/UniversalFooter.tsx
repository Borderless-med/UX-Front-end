import React from 'react';
import { Link } from 'react-router-dom';

const UniversalFooter: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img 
              src="/orachope.png" 
              alt="OraChope.org" 
              className="h-10 sm:h-12 w-auto" 
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/orachope-logo.svg'; }}
            />
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-slate-700 text-sm">
            <Link to="/" className="hover:text-blue-700">Home</Link>
            <Link to="/clinics" className="hover:text-blue-700">Find Clinics</Link>
            <Link to="/compare" className="hover:text-blue-700">Compare</Link>
            <Link to="/how-it-works" className="hover:text-blue-700">How It Works</Link>
            <Link to="/travel-guide" className="hover:text-blue-700 font-medium">Travel Guide</Link>
            <Link to="/privacy-policy" className="hover:text-blue-700">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-blue-700">Terms of Service</Link>
          </nav>
        </div>
  <div className="mt-6 text-xs text-slate-500">© {new Date().getFullYear()} Orachope. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default UniversalFooter;
