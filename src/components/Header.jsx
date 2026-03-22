import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { auth } from "../firebase";
import { AiFillStar, AiOutlineLogout } from "react-icons/ai";

// Fallback avatar using user's initials
const Avatar = ({ user }) => {
  if (user.photoURL) {
    return (
      <img
        src={user.photoURL}
        alt={user.displayName}
        referrerPolicy="no-referrer"
        className="w-8 h-8 rounded-full border-2 border-purple-200 object-cover"
      />
    );
  }
  // No photo → show initials
  const initials = user.displayName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <div className="w-8 h-8 rounded-full border-2 border-purple-200 bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
      <span className="text-white text-xs font-bold">{initials}</span>
    </div>
  );
};

export default function Header({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed");
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-10 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg">
            <AiFillStar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            RAG Chatbot
          </h1>
        </div>

        {/* User info + Logout */}
        {user && (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Avatar — photo or initials */}
            <Avatar user={user} />

            {/* Name — hidden on mobile */}
            <span className="text-sm font-medium text-gray-700 hidden md:block truncate max-w-[120px]">
              {user.displayName}
            </span>

            {/* Logout — icon only on mobile, text on desktop */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-purple-500 hover:bg-purple-600 text-white px-2 sm:px-3 py-2 rounded-xl shadow-md transition cursor-pointer text-sm"
            >
              <AiOutlineLogout className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}