
import React from 'react';
import Navbar from '@/components/Navbar';
import { Skeleton } from "@/components/ui/skeleton";

const PlantsPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="page-container">
        <div className="text-center mb-10">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        
        <div className="flex flex-wrap gap-3 mb-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-32" />
          ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <Skeleton className="h-52 w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <div className="flex flex-wrap gap-2 mb-4">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlantsPageSkeleton;
