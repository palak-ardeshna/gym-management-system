import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, Loader2, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import Modal from '../../components/Modal';

const memberSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
  age: z.string().optional().transform(v => v === "" ? undefined : Number(v)),
  gender: z.string().optional(),
  address: z.string().optional(),
});

const MemberModal = ({ isOpen, onClose, member, onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(memberSchema),
  });

  useEffect(() => {
    if (member) {
      reset({
        fullName: member.fullName,
        email: member.email,
        phone: member.phone,
        age: member.age || '',
        gender: member.gender || '',
        address: member.address || '',
      });
    } else {
      reset({
        fullName: '',
        email: '',
        phone: '',
        age: '',
        gender: '',
        address: '',
      });
    }
  }, [member, reset, isOpen]);

  const genderValue = watch('gender');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={member ? 'Edit Member' : 'Add New Member'}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                {...register('fullName')}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-500 outline-none transition-all text-sm ${
                  errors.fullName ? 'border-red-300 bg-red-50' : 'border-slate-200'
                }`}
                placeholder="John Doe"
              />
            </div>
            {errors.fullName && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                {...register('email')}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-500 outline-none transition-all text-sm ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200'
                }`}
                placeholder="john@example.com"
              />
            </div>
            {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                {...register('phone')}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-500 outline-none transition-all text-sm ${
                  errors.phone ? 'border-red-300 bg-red-50' : 'border-slate-200'
                }`}
                placeholder="9876543210"
              />
            </div>
            {errors.phone && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.phone.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Age</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="number"
                {...register('age')}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-500 outline-none transition-all text-sm"
                placeholder="25"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Gender</label>
            <div className="grid grid-cols-3 gap-2">
              {['male', 'female', 'other'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setValue('gender', g)}
                  className={`py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                    genderValue === g 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                      : 'border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {g}
                </button>
              ))}
              <input type="hidden" {...register('gender')} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <textarea
                {...register('address')}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-500 outline-none transition-all text-sm min-h-[42px]"
                placeholder="Enter full address"
                rows="1"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-70 text-sm"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {member ? 'Update Member' : 'Save Member'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MemberModal;
