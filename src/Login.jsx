import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      const response = await signInWithPopup(auth, googleProvider);
      toast.success(`Welcome back, ${response.user.displayName}!`)
      console.log(response);
      navigate("/");
      
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              RAG Chatbot
            </h1>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              PDF Assistant
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to access your PDF assistant
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={loginWithGoogle}
            disabled={isLoading}
            className="w-full cursor-pointer bg-white text-gray-700 border-2 border-gray-200 rounded-xl flex items-center justify-center gap-3 py-4 px-6 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                <span className="font-medium">Signing in...</span>
              </>
            ) : (
              <>
                <img
                  src="https://yt3.googleusercontent.com/2eI1TjX447QZFDe6R32K0V2mjbVMKT5mIfQR-wK5bAsxttS_7qzUDS1ojoSKeSP0NuWd6sl7qQ=s900-c-k-c0x00ffffff-no-rj"
                  alt="Google"
                  className="w-7 h-7"
                />
                <span className="font-medium group-hover:text-gray-800 transition-colors">
                  Continue with Google
                </span>
              </>
            )}
          </button>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <span className="text-purple-600 hover:underline cursor-pointer">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-purple-600 hover:underline cursor-pointer">
                Privacy Policy
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-purple-100 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-sm">
                © 2025 RAG Chatbot. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-sm">Made with</span>
              <span className="text-red-500 text-lg animate-pulse">♥</span>
              <span className="text-sm">by</span>
              <span className="font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                Dhruv
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
