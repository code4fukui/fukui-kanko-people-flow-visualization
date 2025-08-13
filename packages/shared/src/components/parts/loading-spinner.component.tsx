import React from "react";

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6eba2c]"></div>
      <p className="mt-4 text-lg">データを読み込み中...</p>
    </div>
  );
};
