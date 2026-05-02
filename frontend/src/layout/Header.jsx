import React from 'react';
import { useSelector } from 'react-redux';
import { User } from 'lucide-react';

const Header = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 ml-64">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Gym Management System
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900 leading-none">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize mt-1">{user?.role}</p>
          </div>
          <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
