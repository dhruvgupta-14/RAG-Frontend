import React, { useState } from "react";
import { AiFillStar, AiOutlineLoading3Quarters } from "react-icons/ai";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "./components/Header";
import Footer from "./components/Footer";


export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [user] = useAuthState(auth); //It listens to Firebase Authentication state changes and gives you the current logged-in user.

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      const response = await signInWithPopup(auth, googleProvider);
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
      <Header user={user} />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <AiFillStar className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to access your PDF assistant
            </p>
          </div>

          <button
            onClick={loginWithGoogle}
            disabled={isLoading}
            className="w-full cursor-pointer bg-white text-gray-700 border-2 border-gray-200 rounded-xl flex items-center justify-center gap-3 py-4 px-6 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <>
                <AiOutlineLoading3Quarters className="w-5 h-5 animate-spin text-purple-500" />
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

      <Footer />
    </div>
  );
}

