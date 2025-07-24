import React from "react";
import "../style/style.css";
import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is Aivise?",
      answer:
        "Aivise is an AI-powered business advisor designed to help entrepreneurs, startups, and professionals make better strategic decisions by providing insights based on proven frameworks.",
    },
    {
      question: "How does Aivise work?",
      answer:
        "Aivise uses advanced AI models integrated with curated business strategies. You can ask questions or seek advice, and the system will respond with actionable recommendations based on best practices.",
    },
    {
      question: "Is Aivise free to use?",
      answer:
        "Yes! Aivise offers a free version with basic features. For premium features like personalized mentoring and advanced analytics, you can upgrade to a Pro plan.",
    },
    {
      question: "Can I choose a specific mentor?",
      answer:
        "Absolutely. Aivise allows you to select advice based on the principles of famous business mentors like Michael E. Gerber, Stephen R. Covey, and Eric Ries.",
    },
    {
      question: "How secure is my data?",
      answer:
        "Your privacy and data security are our top priority. Aivise uses encrypted storage and secure authentication protocols to keep your information safe.",
    },
  ];

  return (
    <div className="px-10 sm:px-20 md:px-40 lg:px-60 xl:px-100 py-16 pb-20">
      <h1 className="text-6xl font-bold mb-10 text-center font-Montserrat">
        FAQ
      </h1>

      <div className="space-y-4 bg-white">
        {faqs.map((item, index) => (
          <div
            key={index}
            className="border rounded-xl p-5 shadow-sm cursor-pointer"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-md font-semibold">{item.question}</h2>
              <ChevronDownIcon
                className={`w-6 h-6 transform transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Smooth Expand/Collapse */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openIndex === index ? "max-h-40 mt-3" : "max-h-0"
              }`}
            >
              <p className="text-gray-600">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
