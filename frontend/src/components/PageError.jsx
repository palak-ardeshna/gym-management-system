import React from 'react';
import { AlertCircle } from 'lucide-react';

const PageError = ({ message = 'Something went wrong' }) => (
  <div className="flex items-center justify-center h-[calc(100vh-128px)]">
    <div className="bg-rose-50 p-6 rounded-2xl flex items-center gap-4 text-rose-700">
      <AlertCircle className="h-6 w-6" />
      <p className="font-bold">{message}</p>
    </div>
  </div>
);

export default PageError;
