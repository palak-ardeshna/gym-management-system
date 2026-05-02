import React from 'react';
import { useGetPlansQuery } from '../../redux/api/planApi';
import { Settings, CheckCircle2 } from 'lucide-react';
import PageError from '../../components/PageError';
import { cn } from '../../utils/helpers';

const Skeleton = ({ className }) => (
  <div className={cn('animate-pulse rounded-md bg-slate-200', className)} />
);

const PlanCardSkeleton = () => (
  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
    <Skeleton className="h-7 w-32 mb-3" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-3/4 mb-6" />
    <div className="flex items-baseline gap-2 mb-8">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-4 w-20" />
    </div>
    <ul className="space-y-4 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-3 flex-1" />
        </li>
      ))}
    </ul>
    <Skeleton className="h-12 w-full rounded-2xl" />
  </div>
);

const PlansSkeleton = () => (
  <div className="space-y-8">
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <PlanCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

const Plans = () => {
  const { data, isLoading, error } = useGetPlansQuery();
  const plans = data?.data || [];

  if (isLoading) return <PlansSkeleton />;
  if (error) return <PageError message="Failed to load plans" />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Gym Plans</h1>
        <p className="text-slate-500 mt-1 font-medium">Choose and manage your membership tiers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Settings className="h-24 w-24 text-indigo-600 rotate-12" />
            </div>

            <div className="relative">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
              <p className="text-slate-500 text-sm font-medium mb-6 min-h-[40px]">
                {plan.description}
              </p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-extrabold text-slate-900">₹{plan.price}</span>
                <span className="text-slate-400 font-bold">/ {plan.durationInMonths} Month{plan.durationInMonths > 1 ? 's' : ''}</span>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'Full gym access',
                  'Locker facility',
                  'Personal training option',
                  `${plan.durationInMonths} months validity`
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 group-hover:scale-[1.02] active:scale-[0.98]">
                Select Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
