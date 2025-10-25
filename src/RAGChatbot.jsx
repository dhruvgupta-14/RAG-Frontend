import { useState, useRef, useEffect } from "react";
import {
  AiOutlineUpload,
  AiOutlineFileText,
  AiOutlineRobot,
  AiOutlineUser,
} from "react-icons/ai";
import { auth } from "./firebase";
import Header from "./components/Header";
import { useAuthState } from "react-firebase-hooks/auth";
import Footer from "./components/Footer";
import FileUploadSection from "./components/FileUploadSection";
import InputChatSection from "./components/InputChatSection";

const RAGChatbot = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [user] = useAuthState(auth);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (uploadedFile) scrollToBottom();
  }, [messages, uploadedFile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <Header user={user} />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 items-center gap-6">
          {/* File Upload Section */}
          <FileUploadSection
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            setMessages={setMessages}
          />
          {/* Chat Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-purple-100 shadow-lg h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-purple-100 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <AiOutlineRobot className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      AI Assistant
                    </h3>
                    <p className="text-sm text-gray-500">
                      {uploadedFile
                        ? "Ready to answer questions"
                        : "Upload a PDF to start chatting"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && !uploadedFile && (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="p-4 bg-purple-100 rounded-full mb-4">
                      <AiOutlineUpload className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Welcome to RAG Chatbot
                    </h3>
                    <p className="text-gray-500 max-w-md">
                      Upload a PDF document to start asking questions and get
                      intelligent answers based on your content.
                    </p>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 items-start ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.type !== "user" && (
                      <div
                        className={`flex gap-1 p-2 rounded-xl ${
                          message.type === "system"
                            ? "bg-yellow-100"
                            : "bg-gradient-to-r from-purple-500 to-blue-500"
                        }`}
                      >
                        {message.type === "system" ? (
                          <AiOutlineFileText className="w-4 h-4 text-yellow-600" />
                        ) : (
                          <AiOutlineRobot className="w-4 h-4 text-white" />
                        )}
                      </div>
                    )}

                    <div
                      className={`max-w-md p-3 rounded-2xl ${
                        message.type === "user"
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                          : message.type === "system"
                          ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                          : "bg-gray-50 text-gray-800 border border-gray-200"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>

                    {message.type === "user" && (
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
                        <AiOutlineUser className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
                      <AiOutlineRobot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <InputChatSection
                uploadedFile={uploadedFile}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setMessages={setMessages}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RAGChatbot;
