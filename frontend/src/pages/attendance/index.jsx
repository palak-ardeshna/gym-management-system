import React, { useState, useMemo, useEffect } from 'react';
import { useGetMembersQuery, useCheckInMutation, useMarkAbsentMutation, useGetAttendanceReportQuery } from '../../redux/apiSlice';
import AttendanceList from './AttendanceList';
import AttendanceModal from './AttendanceModal';
import { cn } from '../../utils/helpers';

import { Search, UserCheck, User, Calendar, CheckCircle2, Loader2, AlertCircle, ChevronLeft, ChevronRight, UserX, Plus, X } from 'lucide-react';

const Attendance = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('present');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  
  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const { data: membersData, isLoading: membersLoading } = useGetMembersQuery({ 
    page, 
    search: debouncedSearch, 
    limit: 10 
  });

  // Fetch report for the currently selected month and year
  const { data: reportData, isFetching: reportLoading } = useGetAttendanceReportQuery(
    { month, year },
    { 
      // Ensure we get fresh data when month/year changes
      refetchOnMountOrArgChange: true 
    }
  );

  const [checkIn, { isLoading: isCheckingIn }] = useCheckInMutation();
  const [markAbsent, { isLoading: isMarkingAbsent }] = useMarkAbsentMutation();
  const [message, setMessage] = useState({ type: '', text: '' });

  const members = membersData?.data?.items || [];
  const pagination = membersData?.data || {};
  
  const attendances = useMemo(() => reportData?.data || [], [reportData]);

  // Generate days in selected month
  const daysInMonth = useMemo(() => {
    const days = new Date(year, month, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  }, [month, year]);

  // Map attendance for quick lookup: { memberId_date: status }
  const attendanceMap = useMemo(() => {
    const map = {};
    attendances.forEach(a => {
      // a.checkInDate is YYYY-MM-DD
      if (!a.checkInDate) return;
      
      const dateParts = a.checkInDate.split('-');
      if (dateParts.length >= 3) {
        const day = parseInt(dateParts[2], 10);
        // Ensure both ID and day are used as strings for the key
        map[`${a.memberId}_${day}`] = a.status;
      }
    });
    return map;
  }, [attendances]);

  const handleCheckIn = async (memberId, status = 'present', date = null) => {
    try {
      // If no date is provided (direct click from list), use today's date
      const attendanceDate = date || new Date().toISOString().slice(0, 10);
      const response = await checkIn({ memberId, status, date: attendanceDate }).unwrap();
      
      // Use the success message from the API response
      setMessage({ type: 'success', text: response.message || `Marked as ${status}!` });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.data?.message || 'Check-in failed' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMemberId) return;
    
    await handleCheckIn(selectedMemberId, attendanceStatus, selectedDate);
    setIsModalOpen(false);
    setSelectedMemberId('');
    setAttendanceStatus('present');
    setSelectedDate(new Date().toISOString().slice(0, 10));
  };

  // Get current attendance map for the selected date in modal
  const modalAttendanceMap = useMemo(() => {
    const map = {};
    attendances.forEach(a => {
      if (a.checkInDate === selectedDate) {
        map[a.memberId] = a.status;
      }
    });
    return map;
  }, [attendances, selectedDate]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Attendance Tracker</h1>
          <p className="text-slate-500 mt-1 font-medium">Monitor and manage daily member attendance.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus className="h-5 w-5" />
          Add Attendance
        </button>
      </div>

      {message.text && (
        <div className={cn(
          "mb-6 p-4 rounded-2xl border animate-in slide-in-from-top-4 duration-300 flex items-center gap-3 font-bold text-sm shadow-sm",
          message.type === 'success' ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"
        )}>
          {message.text}
        </div>
      )}

      <AttendanceList 
        search={search}
        setSearch={setSearch}
        setPage={setPage}
        setIsModalOpen={setIsModalOpen}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        members={members}
        membersLoading={membersLoading}
        pagination={pagination}
        page={page}
        daysInMonth={daysInMonth}
        attendanceMap={attendanceMap}
        handleCheckIn={handleCheckIn}
        isCheckingIn={isCheckingIn}
        isMarkingAbsent={isMarkingAbsent}
      />

      <AttendanceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedMemberId={selectedMemberId}
        setSelectedMemberId={setSelectedMemberId}
        attendanceStatus={attendanceStatus}
        setAttendanceStatus={setAttendanceStatus}
        onSubmit={handleModalSubmit}
        members={members}
        isCheckingIn={isCheckingIn}
        modalAttendanceMap={modalAttendanceMap}
      />
    </div>
  );
};

export default Attendance;
