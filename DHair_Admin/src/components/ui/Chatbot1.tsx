import React  from "react";
import { toast } from "react-toastify";
const Chatbot1 = () => {

  const handleClick = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Chức năng đang phát triển!");
  }
    return (
        <div id="chatbot">
        <a href="none" onClick={handleClick} target="_blank"><svg stroke="currentColor" fill="none" stroke-width="2"
          viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z">
          </path>
          <path d="M9.5 9h.01"></path>
          <path d="M14.5 9h.01"></path>
          <path d="M9.5 13a3.5 3.5 0 0 0 5 0"></path>
        </svg></a>
      </div>
    );
};

export default Chatbot1;