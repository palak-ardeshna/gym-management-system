import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import Modal from './Modal';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || 'Are you sure?'}
      className="max-w-md p-0 overflow-hidden"
    >
      <div className="p-6 text-center -mt-4">
        <div className="mx-auto h-14 w-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-4 border border-rose-100">
          <AlertTriangle className="h-7 w-7 text-rose-600" />
        </div>
        
        <p className="text-sm text-slate-500 font-medium leading-relaxed">
          {message || 'This action cannot be undone. Are you sure you want to proceed?'}
        </p>
      </div>

      <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-white hover:shadow-sm transition-all text-sm border border-transparent hover:border-slate-200"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={isLoading}
          onClick={onConfirm}
          className="flex-1 flex items-center justify-center gap-2 bg-rose-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 disabled:opacity-70 text-sm"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Delete Now'
          )}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
