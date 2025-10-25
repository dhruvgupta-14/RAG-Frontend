// Header.jsx
import React from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { auth } from "../firebase";
import { AiFillStar, AiOutlineLogout } from "react-icons/ai";

export default function Header({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed");
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-10 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg">
            <AiFillStar className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            RAG Chatbot
          </h1>
        </div>

        {/* Profile / Logout */}
        {user ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-xl shadow-md transition cursor-pointer"
          >
            <AiOutlineLogout className="w-4 h-4" />
            Logout
          </button>
        ) : null}
      </div>
    </header>
  );
}
