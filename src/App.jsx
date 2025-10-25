// App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Login from "./Login";
import RAGChatbot from "./RAGChatbot";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; 

const App = () => {
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      toast.success(`Welcome back, ${user.displayName}!`);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <AiOutlineLoading3Quarters className="animate-spin" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex items-center justify-center text-red-500">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={user ? <RAGChatbot /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
