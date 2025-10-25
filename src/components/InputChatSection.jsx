import React, { useState } from "react";
import { auth } from "../firebase";
import axios from "axios";
import toast from "react-hot-toast";
import { AiOutlineSend } from "react-icons/ai";

const InputChatSection = ({
  uploadedFile,
  isLoading,
  setIsLoading,
  setMessages
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const sendMessage = async () => {
    if (!inputMessage.trim() || !uploadedFile) return;
    try {
      const userMessage = {
        id: Date.now(),
        type: "user",
        content: inputMessage,
      };
      setMessages((prev) => [...prev, userMessage]);
      setInputMessage("");
      setIsLoading(true);

      const token = await auth.currentUser.getIdToken();
      const response = await axios.post(
        "http://localhost:3000/ask/ai",
        {
          query: inputMessage,
          namespace: uploadedFile.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const botResponse = {
        id: Date.now() + 1,
        type: "bot",
        content:
          response.data.answer ||
          "No answer found. Please try rephrasing your question.",
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
      setIsLoading(false);
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
              ? "Ask a question about your PDF..."
              : "Upload a PDF first to start chatting"
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
