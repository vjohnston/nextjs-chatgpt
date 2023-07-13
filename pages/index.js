import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useMutation } from "react-query";

const sendChat = async (message) => {
  const { data } = await axios.post("/api/chat", { prompt: message });
  return data.response;
};

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const mutation = useMutation(sendChat);

  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages((prev) => [
      ...prev,
      { message: message, response: "Loading...", botResponse: false },
    ]);
    setMessage("");
    const response = await mutation.mutateAsync(message);
    setMessages((prev) => [
      ...prev.slice(0, prev.length - 1),
      { message: message, response: response, botResponse: true },
    ]);
  };

  return (
    <div className="container h-screen flex flex-col bg-white text-gray-900 px-20 mx-auto">
      <h1 className="text-6xl font-bold pt-10">ChatGPT Wrapper</h1>
      <div className="flex flex-col flex-1 w-full mt-6 overflow-auto pb-10">
        {messages.map((message, index) => (
          <div key={index} className="w-full my-2">
            <div className="p-2 bg-gray-200 rounded-lg text-black">
              {message.message}
            </div>
            <div className="p-2 bg-gray-300 rounded-lg text-black mt-1 whitespace-pre-wrap">
              {message.response}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full py-5 flex items-center justify-center"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-3/4 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
        />
        <button
          type="submit"
          className="w-1/4 ml-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
        >
          Send
        </button>
      </form>
    </div>
  );
}
