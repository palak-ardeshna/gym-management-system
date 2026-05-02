import React from 'react';
import { useGetDashboardStatsQuery } from '../../redux/api/dashboardApi';
import { useGetMembersQuery } from '../../redux/api/memberApi';
import { Users, UserCheck, UserX, Activity, ArrowUpRight, User as UserIcon } from 'lucide-react';
import { cn, formatDate } from '../../utils/helpers';

const Skeleton = ({ className }) => (
  <div className={cn('animate-pulse rounded-md bg-slate-200', className)} />
);

const StatCardSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
      </div>
      <Skeleton className="h-12 w-12 rounded-xl" />
    </div>
    <Skeleton className="mt-4 h-3 w-32" />
  </div>
);

const ListRowSkeleton = () => (
  <div className="flex items-center gap-4">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-3 w-1/3" />
    </div>
    <div className="space-y-2 text-right">
      <Skeleton className="h-3 w-16 ml-auto" />
      <Skeleton className="h-2 w-12 ml-auto" />
    </div>
  </div>
);

const PanelSkeleton = () => (
  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
    <div className="flex items-center justify-between mb-6">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-5 w-5 rounded" />
    </div>
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <ListRowSkeleton key={i} />
      ))}
    </div>
  </div>
);

const DashboardSkeleton = () => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <PanelSkeleton />
      <PanelSkeleton />
    </div>
  </>
);

const StatCard = ({ title, value, icon: Icon, color, description }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900">{value || 0}</h3>
      </div>
      <div className={cn("p-3 rounded-xl", color)}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
    <div className="mt-4">
      <p className="text-xs text-slate-400 font-medium">{description}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { data: statsData, isLoading: isStatsLoading } = useGetDashboardStatsQuery();
  const { data: membersData, isLoading: isMembersLoading } = useGetMembersQuery({ limit: 5 });
  
  const stats = statsData?.data;
  const members = membersData?.data?.items || [];
  const isLoading = isStatsLoading || isMembersLoading;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1 font-medium">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      {isLoading ? <DashboardSkeleton /> : <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Members" 
          value={stats?.totalMembers} 
          icon={Users} 
          color="bg-blue-600"
          description="Active gym enthusiasts"
        />
        <StatCard 
          title="Active Members" 
          value={stats?.activeMembers} 
          icon={UserCheck} 
          color="bg-emerald-600"
          description="Currently valid plans"
        />
        <StatCard 
          title="Expired Members" 
          value={stats?.expiredMembers} 
          icon={UserX} 
          color="bg-rose-600"
          description="Need plan renewal"
        />
      </div>

      {/* Activity Section Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
            <Activity className="h-5 w-5 text-slate-400" />
          </div>
          <div className="space-y-6">
            {stats?.recentActivities?.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No recent activity found.</p>
            ) : (
              stats?.recentActivities?.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center font-bold",
                    activity.status === 'present' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  )}>
                    {activity.memberName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">
                      {activity.memberName} marked as <span className={cn(
                        activity.status === 'present' ? "text-emerald-600" : "text-rose-600"
                      )}>{activity.status}</span>
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {formatDate(activity.date)}
                    </p>
                  </div>
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    activity.status === 'present' ? "bg-emerald-500" : "bg-rose-500"
                  )}></div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Latest Members</h2>
            <Users className="h-5 w-5 text-slate-400" />
          </div>
          <div className="space-y-6">
            {members.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No members found.</p>
            ) : (
              members.map((member) => (
                <div key={member.id} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">{member.fullName}</p>
                    <p className="text-xs text-slate-500 font-medium">{member.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900">{member.planName || 'No Plan'}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{formatDate(member.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      </>}
    </div>
  );
};

export default Dashboard;
