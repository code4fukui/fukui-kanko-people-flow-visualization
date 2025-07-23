export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center fixed inset-0 bg-gray-500 bg-opacity-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      <p className="mt-4 text-2xl font-bold">データを読み込み中...</p>
    </div>
  );
}
