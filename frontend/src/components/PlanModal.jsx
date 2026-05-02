import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, Loader2, Calendar, CreditCard } from 'lucide-react';
import { useAssignPlanMutation, useGetPlansQuery } from '../redux/apiSlice';
import Modal from './Modal';

const planSchema = z.object({
  memberId: z.number(),
  planId: z.number().min(1, 'Please select a plan'),
  planName: z.string().min(1, 'Plan name is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
}).refine(data => new Date(data.endDate) >= new Date(data.startDate), {
  message: "End date must be after start date",
  path: ["endDate"],
});

const PlanModal = ({ isOpen, onClose, memberId, memberName }) => {
  const [assignPlan, { isLoading }] = useAssignPlanMutation();
  const { data: plansData } = useGetPlansQuery();
  const plans = plansData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(planSchema),
    defaultValues: {
      memberId: memberId,
      planId: 0,
      planName: '',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '',
    }
  });

  const selectedPlanId = watch('planId');
  const startDate = watch('startDate');

  // Auto-calculate end date when plan or start date changes
  useEffect(() => {
    if (selectedPlanId && startDate) {
      const plan = plans.find(p => p.id === parseInt(selectedPlanId));
      if (plan) {
        const start = new Date(startDate);
        const end = new Date(start.setMonth(start.getMonth() + plan.durationInMonths));
        setValue('endDate', end.toISOString().slice(0, 10));
        setValue('planName', plan.name);
      }
    }
  }, [selectedPlanId, startDate, plans, setValue]);

  useEffect(() => {
    if (isOpen) {
      reset({
        memberId: memberId,
        planName: '',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: '',
      });
    }
  }, [isOpen, memberId, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      await assignPlan(data).unwrap();
      onClose();
    } catch (err) {
      console.error('Failed to assign plan:', err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Plan"
      className="max-w-md"
    >
      <div className="mb-6 -mt-2">
        <p className="text-xs text-slate-500 font-medium">Assigning to: <span className="text-indigo-600 font-bold">{memberName}</span></p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Plan Name</label>
          <select
            {...register('planId', { valueAsNumber: true })}
            className={`w-full px-4 py-2.5 rounded-xl border focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-500 outline-none transition-all text-sm bg-white font-medium ${
              errors.planId ? 'border-red-300 bg-red-50' : 'border-slate-200'
            }`}
          >
            <option value="0">Select a plan</option>
            {plans.map(plan => (
              <option key={plan.id} value={plan.id}>{plan.name} - ₹{plan.price}</option>
            ))}
          </select>
          {errors.planId && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.planId.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="date"
                {...register('startDate')}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="date"
                readOnly
                {...register('endDate')}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 outline-none text-sm font-bold"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-70 mt-4"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Save className="h-5 w-5" />
              Confirm Assignment
            </>
          )}
        </button>
      </form>
    </Modal>
  );
};

export default PlanModal;
