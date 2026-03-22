import { useState } from "react";
import { auth } from "../firebase";
import axios from "axios";
import toast from "react-hot-toast";
import { AiOutlineSend } from "react-icons/ai";

const sanitizeNamespace = (name) => name.replace(/[^a-zA-Z0-9_-]/g, "_");

const InputChatSection = ({
  uploadedFile,
  isLoading,
  setIsLoading,
  setMessages,
}) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [inputMessage, setInputMessage] = useState("");

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !uploadedFile) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.post(
        `${API_URL}/ask/ai`,
        {
          query: inputMessage,
          namespace: sanitizeNamespace(uploadedFile.name), 
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const botResponse = {
        id: Date.now() + 1,
        type: "ai",  
        content: response.data.answer || "No answer found. Please try rephrasing.",
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false); // ← moved to finally, always runs ✅
    }
  };

  return (
    <div className="p-4 border-t border-purple-100 bg-white/50">
      <div className="flex gap-3">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={
            uploadedFile
              ? "Ask a question about your document..."
              : "Upload a document first to start chatting"
          }
          disabled={!uploadedFile || isLoading}
          className="flex-1 resize-none border border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed bg-white/80"
          rows="1"
        />
        <button
          onClick={sendMessage}
          disabled={!inputMessage.trim() || !uploadedFile || isLoading}
          className="px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100"
        >
          <AiOutlineSend className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default InputChatSection;
