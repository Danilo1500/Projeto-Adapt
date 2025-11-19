

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-gray-600">Carregando...</p>
      </div>
    </div>
  );
};

export default Loading;
