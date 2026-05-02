import React from 'react';
import { useGetPlansQuery } from '../../redux/apiSlice';
import { Settings, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/helpers';

const Plans = () => {
  const { data, isLoading, error } = useGetPlansQuery();
  const plans = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-128px)]">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-128px)]">
        <div className="bg-rose-50 p-6 rounded-2xl flex items-center gap-4 text-rose-700">
          <AlertCircle className="h-6 w-6" />
          <p className="font-bold">Failed to load plans</p>
        </div>
      </div>
    );
  }

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
