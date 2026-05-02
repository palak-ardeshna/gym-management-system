import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  CalendarCheck, 
  Dumbbell,
  LogOut,
  CreditCard,
  Settings
} from 'lucide-react';
import { cn } from '../utils/helpers';

const SidebarItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      isActive 
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
        : "text-slate-600 hover:bg-slate-100"
    )}
  >
    <Icon className="h-5 w-5" />
    <span className="font-medium">{label}</span>
  </NavLink>
);

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Dumbbell className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tight">Argon</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <SidebarItem to="/members" icon={Users} label="Members" />
        <SidebarItem to="/plans" icon={Settings} label="Plans" />
        <SidebarItem to="/subscriptions" icon={CreditCard} label="Subscriptions" />
        <SidebarItem to="/attendance" icon={CalendarCheck} label="Attendance" />
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200 font-medium group"
        >
          <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
