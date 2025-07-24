import React, { useState } from "react";
import Logo from "../assets/logo/Logo-Dark.png";
import chatData from "../data/chatData.json";

const Chatbot = () => {
  const [messages, setMessages] = useState(chatData);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      sender: "user",
      message: input,
    };

    setMessages([...messages, newMessage]);
    setInput("");

    // Simulasi respon bot (dummy)
    setTimeout(() => {
      const botReply = {
        id: messages.length + 2,
        sender: "bot",
        message: "This is a dummy response from the bot.",
      };
      setMessages((prev) => [...prev, botReply]);
    }, 1000);
  };

  return (
    <div className="h-screen flex flex-col justify-between">
      {/* Header */}
      <header className="h-[70px] bg-red-100 flex items-center px-5">
        <img src={Logo} alt="logo-png" className="w-[150px]" />
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto px-[200px] py-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <p
              className={`rounded-lg px-5 py-3 max-w-md ${
                msg.sender === "user"
                  ? "bg-red-200 text-right"
                  : "bg-blue-200 text-left"
              }`}
            >
              {msg.message}
            </p>
          </div>
        ))}
      </main>

      {/* Footer Input */}
      <footer className="px-[200px] py-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="button"
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Chatbot;
