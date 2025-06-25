import { useEffect, useState } from 'react'
import RAGChatbot from './RAGChatbot'
import toast, { Toaster } from 'react-hot-toast'
import Login from './Login'
import { BrowserRouter, Routes,Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase'
import { Loader } from 'lucide-react'
const App = () => {
const [isLogin, setIsLogin] = useState(false);
const [isLoading, setIsLoading] = useState(true);
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setIsLogin(!!user);
    setIsLoading(false);

    if (user) {
      toast.success(`Welcome back, ${user.displayName}!`);
    }
  });

  return () => unsubscribe();
}, []);
  if (isLoading) return <div className="w-screen h-screen flex items-center justify-center"><Loader className="animate-spin" size={40}></Loader></div>
  return (
    <div>
      <Toaster position='top-center'/>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={isLogin ? <RAGChatbot/> : <Navigate to="/login" />} />
          <Route path='/login' element={isLogin ? <Navigate to="/" /> : <Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App