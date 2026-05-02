import React from 'react';

const Footer = () => {
  return (
    <footer className="py-6 px-8 border-t border-slate-200 bg-white">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500 font-medium">
          © {new Date().getFullYear()} Argon Gym. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a href="#" className="text-xs text-slate-400 hover:text-indigo-600 font-medium transition-colors">Privacy Policy</a>
          <a href="#" className="text-xs text-slate-400 hover:text-indigo-600 font-medium transition-colors">Terms of Service</a>
          <a href="#" className="text-xs text-slate-400 hover:text-indigo-600 font-medium transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
