import React from 'react';
import { CheckCircle2, UserX, Loader2, UserCheck } from 'lucide-react';
import { cn } from '../../utils/helpers';
import Modal from '../../components/Modal';

const AttendanceModal = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  setSelectedDate, 
  selectedMemberId, 
  setSelectedMemberId, 
  attendanceStatus, 
  setAttendanceStatus, 
  onSubmit, 
  members, 
  isCheckingIn,
  modalAttendanceMap
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Attendance"
      className="max-w-md"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Select Date</label>
          <input
            type="date"
            required
            value={selectedDate}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Select Member</label>
          <select
            required
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700"
          >
            <option value="">Choose a member...</option>
            {members.map(m => {
              const status = modalAttendanceMap[m.id];
              return (
                <option 
                  key={m.id} 
                  value={m.id} 
                  disabled={!!status}
                  className={status ? "text-slate-400 italic" : ""}
                >
                  {m.fullName} {status ? `(${status.toUpperCase()})` : ""}
                </option>
              );
            })}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Status</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setAttendanceStatus('present')}
              className={cn(
                "flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all border-2",
                attendanceStatus === 'present' 
                  ? "bg-emerald-50 border-emerald-500 text-emerald-700" 
                  : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
              )}
            >
              <CheckCircle2 className="h-5 w-5" />
              Present
            </button>
            <button
              type="button"
              onClick={() => setAttendanceStatus('absent')}
              className={cn(
                "flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all border-2",
                attendanceStatus === 'absent' 
                  ? "bg-rose-50 border-rose-500 text-rose-700" 
                  : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
              )}
            >
              <UserX className="h-5 w-5" />
              Absent
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isCheckingIn || !selectedMemberId}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isCheckingIn ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserCheck className="h-5 w-5" />}
          Save Attendance
        </button>
      </form>
    </Modal>
  );
};

export default AttendanceModal;
