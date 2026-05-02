import React from 'react';
import { Loader2 } from 'lucide-react';

const PageLoader = () => (
  <div className="flex items-center justify-center h-[calc(100vh-128px)]">
    <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
  </div>
);

export default PageLoader;
