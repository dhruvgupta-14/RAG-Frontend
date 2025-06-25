import { useState, useRef, useEffect } from "react";
import {
  Upload,
  Send,
  FileText,
  Bot,
  User,
  Trash2,
  Download,
  MessageCircle,
  Sparkles,
  Loader,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { auth } from "./firebase";

const RAGChatbot = () => {
  
  const [uploadedFile, setUploadedFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async (file) => {
    if (
      file &&
      file.type === "application/pdf" &&
      file.size <= 40 * 1024 * 1024
    ) {
      setUploadLoading(true);
      setIsDragOver(false);
      try {
        {  
          const token = await auth.currentUser.getIdToken(); 
          const formData = new FormData();
          formData.append("file", file);
          const response = await axios.post(
            "http://localhost:3000/file/upload",formData,{
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          toast.success(response.data.message || "File uploaded successfully!");
          setMessages([
            {
              id: Date.now(),
              type: "system",
              content: `PDF "${file.name}" uploaded successfully! You can now ask questions about its content.`,
            },
          ]);
          setUploadedFile(file);
          setUploadLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Failed to upload file. Please try again.");
        setUploadedFile(null);
        setUploadLoading(false);
        return;
      }
    }else{
      toast.error(
        "Invalid file. Please upload a PDF file smaller than 40MB."
      );
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setMessages([]);
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
      const response = await axios.post("http://localhost:3000/ask/ai", {
        query: inputMessage,
        namespace: uploadedFile.name,
      },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      return;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
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

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 items-center gap-6">
          {/* File Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-600" />
                Upload PDF
              </h2>
              {
                uploadLoading ? <div className="w-full h-full flex items-center justify-center"><Loader className="animate-spin" size={40}/></div>  : !uploadedFile ? (
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                    ${
                      isDragOver
                        ? "border-purple-400 bg-purple-50"
                        : "border-purple-200 hover:border-purple-300 hover:bg-purple-25"
                    }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileText className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drop your PDF here or click to browse
                  </p>
                  <p className="text-sm text-gray-400">Max size: 40MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                  />
                </div>
              ) : (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileText className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800 truncate max-w-[200px]">
                          {uploadedFile.name}
                        </p>
                        <p className="text-sm text-green-600">
                          {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeFile}
                      className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              )
              }
              

              {uploadedFile && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Quick Start
                  </h3>
                  <p className="text-sm text-blue-600 mb-3">
                    Your PDF is ready! Try asking questions like:
                  </p>
                  <ul className="text-xs text-blue-500 space-y-1">
                    <li>• "Summarize the main points"</li>
                    <li>• "What is this document about?"</li>
                    <li>• "Find information about..."</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-purple-100 shadow-lg h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-purple-100 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <Bot className="w-5 h-5 text-purple-600" />
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
                      <Upload className="w-8 h-8 text-purple-600" />
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
                    className={`flex gap-3 items-start  ${
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
                          <FileText className="w-4 h-4 text-yellow-600" />
                        ) : (
                          <div>
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          
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
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
                      <Bot className="w-4 h-4 text-white" />
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
              <div className="p-4 border-t border-purple-100 bg-white/50">
                <div className="flex gap-3">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
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
                    disabled={
                      !inputMessage.trim() || !uploadedFile || isLoading
                    }
                    className="px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RAGChatbot;
