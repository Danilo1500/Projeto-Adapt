
import { useTheme } from "../../context/ThemeContext";

const LoadingWhite = ({ height = "100%", size = 56 }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div
      className={`flex items-center justify-center w-full ${
        isDark ? "bg-slate-900" : "bg-gradient-to-b from-gray-50 to-gray-100"
      }`}
      style={{ height }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative" style={{ width: size, height: size }}>
          <div
            className={`absolute inset-0 border-4 rounded-full ${
              isDark ? "border-slate-700" : "border-gray-200"
            }`}
          ></div>
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className={isDark ? "text-slate-300" : "text-gray-600"}>Carregando...</p>
      </div>
    </div>
  );
};

export default LoadingWhite;
