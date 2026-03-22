import { useEffect, useRef, useState } from "react";
import {
  AiOutlineDelete,
  AiOutlineFileText,
  AiOutlineLoading3Quarters,
  AiOutlineMessage,
  AiOutlineUpload,
} from "react-icons/ai";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import axios from "axios";

const sanitizeNamespace = (name) => name.replace(/[^a-zA-Z0-9_-]/g, "_");


const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const MAX_SIZE = 40 * 1024 * 1024; // 40MB

const FileUploadSection = ({ uploadedFile, setUploadedFile, setMessages }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [uploadLoading, setUploadLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Restore file from localStorage on mount
  useEffect(() => {
    const savedFile = localStorage.getItem("uploadedFile");
    if (savedFile) {
      setUploadedFile(JSON.parse(savedFile));
    }
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

const removeFile = async () => {
  try {
    const token = await auth.currentUser.getIdToken();
    await axios.delete(`${API_URL}/file/delete/${sanitizeNamespace(uploadedFile.name)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("File deleted successfully");
  } catch (e) {
    console.error(e);
    toast.success("File removed");  
  } finally {
    setUploadedFile(null);
    setMessages([]);
    localStorage.removeItem("uploadedFile");
  }
};

  const handleFileUpload = async (file) => {
    if (!file || !ALLOWED_TYPES.includes(file.type) || file.size > MAX_SIZE) {
      toast.error("Invalid file. Upload a PDF, DOCX, or TXT under 40MB.");
      return;
    }

    setUploadLoading(true);
    setIsDragOver(false);

    try {
      const token = await auth.currentUser.getIdToken();
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(`${API_URL}/file/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.message || "File uploaded successfully!");
      setUploadedFile(file);
      localStorage.setItem("uploadedFile", JSON.stringify({
        name: file.name,
        size: file.size,
        type: file.type,
      }));
      setMessages([{
        id: Date.now(),
        type: "system",
        content: `"${file.name}" uploaded! You can now ask questions about its content.`,
      }]);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file. Please try again.");
      setUploadedFile(null);
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <AiOutlineUpload className="w-5 h-5 text-purple-600" />
          Upload Document
        </h2>

        {uploadLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <AiOutlineLoading3Quarters className="animate-spin" size={40} />
          </div>
        ) : uploadedFile ? (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <AiOutlineFileText className="w-4 h-4 text-green-600" />
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
                <AiOutlineDelete className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              isDragOver
                ? "border-purple-400 bg-purple-50"
                : "border-purple-200 hover:border-purple-300 hover:bg-purple-25"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <AiOutlineFileText className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Drop your file here or click to browse</p>
            <p className="text-sm text-gray-400">PDF, DOCX, TXT • Max 40MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files[0])}
            />
          </div>
        )}

        {uploadedFile && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <AiOutlineMessage className="w-4 h-4" />
              Quick Start
            </h3>
            <p className="text-sm text-blue-600 mb-3">Try asking:</p>
            <ul className="text-xs text-blue-500 space-y-1">
              <li>• "Summarize the main points"</li>
              <li>• "What is this document about?"</li>
              <li>• "Find information about..."</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadSection;