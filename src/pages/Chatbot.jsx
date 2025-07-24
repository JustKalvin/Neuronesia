import React, { useState } from "react";
import axios from "axios";
import Logo from "../assets/logo/Logo-Dark.png";
import chatData from "../data/chatData.json";

const Chatbot = () => {
  const [messages, setMessages] = useState(chatData);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // optional: indikator loading

  const handleSend = async () => {
    if (input.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      sender: "user",
      message: input,
    };

    // Tambahkan pesan user ke state
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      // ✅ POST ke API endpoint
      const response = await axios.post(
        "https://primary-production-9ee5.up.railway.app/webhook/bookrag",
        {
          message: input,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      // Ambil jawaban bot dari response API
      const botReply = {
        id: messages.length + 2,
        sender: "bot",
        message: response.data.output.response || "No response from server",
      };

      // Update messages
      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error("API Error:", error);
      const errorReply = {
        id: messages.length + 2,
        sender: "bot",
        message: "Error fetching response. Please try again.",
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#5B5B60] h-screen flex flex-col justify-between ">
      {/* Header */}
      <header className="h-[70px] bg-[#5B5B60] flex items-center px-5">
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

        {/* Optional: Loading Indicator */}
        {loading && (
          <p className="text-gray-500 text-center italic">Bot is typing...</p>
        )}
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
