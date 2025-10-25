// Footer.jsx
import React from "react";
import {
  AiFillGithub,
  AiOutlineLinkedin,
  AiFillInstagram,
  AiOutlineTwitter,
} from "react-icons/ai";
import { FiGlobe } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-purple-100 py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-sm text-gray-600">
          © 2025 RAG Chatbot. All rights reserved.
        </span>
        <div className="flex items-center gap-2 text-gray-600">
          {" "}
          <span className="text-sm">Made with</span>{" "}
          <span className="text-red-500 text-lg animate-pulse">♥</span>{" "}
          <span className="text-sm">by</span>{" "}
          <span className="font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
            {" "}
            Dhruv{" "}
          </span>{" "}
        </div>
        <div className="flex items-center gap-4">
          <a
           href="https://github.com/dhruvgupta-14"
            target="_blank"
            rel="noreferrer"
          >
            <AiFillGithub className="w-5 h-5 text-gray-600 hover:text-gray-800 transition" />
          </a>
          <a
            href="https://www.linkedin.com/in/dhruv-gupta-9285692a2/"
            target="_blank"
            rel="noreferrer"
          >
            <AiOutlineLinkedin className="w-5 h-5 text-blue-600 hover:text-blue-800 transition" />
          </a>
          <a
            href="https://www.instagram.com/dhruv.gupta14_/"
            target="_blank"
            rel="noreferrer"
          >
            <AiFillInstagram className="w-5 h-5 text-pink-500 hover:text-pink-700 transition" />
          </a>
          <a
            href="https://x.com/D11537Pahariya"
            target="_blank"
            rel="noreferrer"
          >
            <AiOutlineTwitter className="w-5 h-5 text-blue-400 hover:text-blue-600 transition" />
          </a>
          <a href="" target="_blank" rel="noreferrer">
            <FiGlobe className="w-5 h-5 text-green-500 hover:text-green-700 transition" />
          </a>
        </div>
      </div>
    </footer>
  );
}
