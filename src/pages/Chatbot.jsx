import React, { useState, useEffect, use } from "react";
import axios from "axios";
import Logo from "../assets/logo/Aivise-Logo.png";
import chatData from "../data/chatData.json";
import { supabase } from "../lib/supabaseClient";
import users from "../assets/user/user.png";
import michael from "../assets/advisor/michael.jpg";
import eric from "../assets/advisor/eric.jpg";
import covey from "../assets/advisor/covey.jpg";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import TutorialModal from "../components/TutorialModal";
import { updateUser, getUsersById } from "../query";

const Chatbot = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleStart = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
  };
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [analyticClicked, setAnalyticClicked] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [micClicked, setMicClicked] = useState(false);
  // ✅ State untuk namespace Pinecone
  const [mentorCode, setMentorCode] = useState("");
  const [showTutorial, setShowTutorial] = useState(true);
  const [step, setStep] = useState(0);
  const [skipTutor, setSkipTutor] = useState(true);
  const [tempUser, setTempUser] = useState(null);
  const [predictClicked, setPredictClicked] = useState(false);
  const [algoClicked, setAlgoClicked] = useState(false);
  const [linearRegressionClicked, setLinearRegressionClicked] = useState(false);
  const [logisticRegressionClicked, setLogisticRegressionClicked] = useState(false);
  const [clusteringClicked, setClusteringClicked] = useState(false)


  const tutorialSteps = [
    {
      title: "Welcome to AI Chatbot!",
      content:
        "This tutorial will guide you through how to use our AI chatbot powered by voice input, document analytics, and personalized mentorship.",
      highlight: null,
    },
    {
      title: "Choose Your Mentor",
      content:
        "Before chatting, select a mentor from the dropdown list. Your mentor determines how the AI responds based on their philosophy and writings.",
      highlight: "select",
    },
    {
      title: "Ask Anything",
      content:
        "Use the input field at the bottom to type your question. Press Enter or click 'Send'. The AI will respond with insights tailored to your chosen mentor.",
      highlight: "input",
    },
    {
      title: "Use Voice Input 🎙️",
      content:
        "Click the mic button to speak your question. Click ❌ Stop when you're done. The transcript will appear in the input field automatically.",
      highlight: "mic",
    },
    {
      title: "Upload CSV for Insight 📊",
      content:
        "Click the 'Analytics' button, then upload your CSV file. The AI will analyze your data and return visual insights with interpretation.",
      highlight: "analytics",
    },
    {
      title: "Upload CSV for Future Prediction 🔮",
      content:
        "Click the 'Predict' button, then upload your CSV file. The AI will analyze your data and generate future business predictions with clear explanations.",
      highlight: "predict",
    },
    {
      title: "Manage Your Profile",
      content:
        "Click your profile picture at the top right to logout. Your session and data are managed securely with Supabase.",
      highlight: "profile",
    },
    {
      title: "You're All Set!",
      content:
        "Now you're ready to explore mentorship, analyze data, and chat with AI in a personalized way. Enjoy the journey!",
      highlight: null,
    },
  ];

  useEffect(() => {
    const fetch = async () => {
      if (user) {
        const result = await getUsersById(user.id);
        console.log(result);
        setSkipTutor((skipTutor) => result.data.skip_tutor);
      }
    };
    fetch();
  }, [user]);

  useEffect(() => {
    const hasVisited = localStorage.getItem("visited");
    if (!hasVisited) {
      setShowTutorial(true);
      localStorage.setItem("visited", "true");
    }
  }, []);

  const insertUser = async (id, full_name, email, avatar_url, created_at) => {
    try {
      const { data, error } = await supabase.from("users").insert([
        {
          id,
          full_name,
          email,
          avatar_url,
          created_at,
        },
      ]);

      if (error) {
        return { success: false, message: error.message };
      }
      return { success: true, data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const [mentorLocked, setMentorLocked] = useState(false);

  const [activeMentorLabel, setActiveMentorLabel] = useState("");

  const handleSend = async () => {
    if (input.trim() === "") return;

    // 🔒 Lock mentor selection after first message
    if (!mentorLocked) {
      setMentorLocked(true);
    }

    const newMessage = {
      id: messages.length + 1,
      sender: "user",
      message: input,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://primary-production-9ee5.up.railway.app/webhook/bookrag",
        {
          message: input,
          namespace: mentorCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const botReply = {
        id: messages.length + 2,
        sender: "bot",
        message: response.data.output.response || "No response from server",
        displayName: selectedMentor || "AI Advisor", // ← Tambahkan ini
      };

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

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (micClicked) {
      setInput(transcript);
    }
  }, [transcript]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/login"; // Redirect ke halaman login
  };

  const [selectedMentor, setSelectedMentor] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  // Handler untuk dropdown
  const handleMentorChange = (e) => {
    const value = e.target.value;

    if (value === "orang1") {
      setMentorCode("EMYTH");
      setSelectedMentor("Michael E. Gerber");
    } else if (value === "orang2") {
      setMentorCode("7HABITS");
      setSelectedMentor("Stephen R. Covey");
    } else if (value === "orang3") {
      setMentorCode("LEAN");
      setSelectedMentor("Eric Ries");
    } else {
      setMentorCode("");
      setSelectedMentor("");
    }

    setActiveMentorLabel(""); // Reset agar nama mentor tidak tertinggal
  };

  const handleAnalytic = () => {
    setAnalyticClicked((analyticClicked) => !analyticClicked);
    setPredictClicked(false);
    setAlgoClicked(false);
    // Simpan label mentor aktif sebelum reset
    if (selectedMentor) {
      setActiveMentorLabel(selectedMentor);
    }

    // Reset mentor selection
    setMentorCode("");
    setSelectedMentor("");
    setMentorLocked(false);
  };

  const handlePredict = () => {
    setPredictClicked((predictClicked) => !predictClicked);
    setAnalyticClicked(false);
    setAlgoClicked(false);

    if (selectedMentor) {
      setActiveMentorLabel(selectedMentor);
    }

    setMentorCode("");
    setSelectedMentor("");
    setMentorLocked(false);
  };

  const handleAlgo = () => {
    setAlgoClicked((algoClicked) => !algoClicked);
    setAnalyticClicked(false);
    setPredictClicked(false);

    if (selectedMentor) {
      setActiveMentorLabel(selectedMentor);
    }

    setMentorCode("");
    setSelectedMentor("");
    setMentorLocked(false);
  };

  const handleLinearRegression = () => {
    setLinearRegressionClicked(linearRegressionClicked => !linearRegressionClicked);
    setLogisticRegressionClicked(logisticRegressionClicked => false);
    setClusteringClicked(clusteringClicked => false);
  }

  const handleLogisticRegression = () => {
    setLogisticRegressionClicked(logisticRegressionClicked => !logisticRegressionClicked);
    setLinearRegressionClicked(linearRegressionClicked => false);
    setClusteringClicked(clusteringClicked => false)
  }

  const handleClustering = () => {
    setClusteringClicked(clusteringClicked => !clusteringClicked);
    setLinearRegressionClicked(linearRegressionClicked => false);
    setLogisticRegressionClicked(logisticRegressionClicked => false);
  }
  const [uploading, setUploading] = useState(false);

  const handleUploadFile = async () => {
    if (!uploadedFile) {
      alert("Please select a file first.");
      return;
    }

    setUploading(true); // ✅ mulai loading
    const formData = new FormData();
    formData.append("file", uploadedFile);
    if (analyticClicked) {
      try {
        let tempUrls = "";
        if (analyticClicked)
          tempUrls =
            "https://primary-production-9ee5.up.railway.app/webhook/analytic";
        // if (predictClicked) tempUrls = "https://primary-production-9ee5.up.railway.app/webhook-test/insight";
        const response = await axios.post(tempUrls, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const responseData = response.data;

        const insight = responseData.insight;
        const imageUrl = responseData.url;

        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            sender: "bot",
            message: imageUrl,
            type: "image",
            displayName: "AI Advisor", // ← Tambahkan ini
          },
          {
            id: prev.length + 2,
            sender: "bot",
            message: insight,
            type: "text",
            displayName: "AI Advisor", // ← Tambahkan ini
          },
        ]);
      } catch (error) {
        console.error("Upload error:", error);

        const errorReply = {
          id: messages.length + 1,
          sender: "bot",
          message: "Upload failed or response unreadable. Please try again.",
        };

        setMessages((prev) => [...prev, errorReply]);
      } finally {
        setUploading(false); // ✅ selesai loading
      }
    }
    if (predictClicked) {
      try {
        let tempUrls =
          "https://primary-production-9ee5.up.railway.app/webhook/insight";
        const response = await axios.post(tempUrls, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("response : ", response);
        const responseData = response.data[0];

        // const insight = responseData.insight;
        const fileUrl = responseData.url;
        const downloadLink = `<a href="${fileUrl}" target="_blank">📄 Click here to download your future prediction report</a>`;

        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            sender: "bot",
            message: downloadLink,
            type: "html",
            displayName: "AI Advisor", // ← Tambahkan ini
          },
        ]);
      } catch (error) {
        console.error("Upload error:", error);

        const errorReply = {
          id: messages.length + 1,
          sender: "bot",
          message: "Analysis failed! Please try again with another data.",
        };

        setMessages((prev) => [...prev, errorReply]);
      } finally {
        setUploading(false); // ✅ selesai loading
      }
    }
  };

  const handleMicClicked = () => {
    setMicClicked((micClicked) => !micClicked);
  };

  return (
    <div className="bg-[#FFFFFF] h-screen flex flex-col justify-between font-Poppins">
      {user && !skipTutor && (
        <TutorialModal
          isOpen={showTutorial}
          onClose={() => setShowTutorial(false)}
          currentStep={step}
          onNext={() => setStep((prev) => prev + 1)}
          onPrev={() => setStep((prev) => prev - 1)}
          totalSteps={tutorialSteps.length}
          user={user}
        />
      )}
      {/* Header */}
      <header className="h-[80px] bg-[#FFFFFF] flex items-center px-[100px] max-sm:px-[40px] justify-between relative">
        <Link to="/">
          <img src={Logo} alt="logo-png" className="w-[120px]" />
        </Link>

        {/* Profile + Dropdown */}
        <div className="relative">
          <img
            data-tutorial="profile"
            src={user?.user_metadata?.avatar_url}
            alt="profile-png"
            className="w-[45px] h-[45px] rounded-full border cursor-pointer"
            onClick={() => setIsOpen((prev) => !prev)}
          />

          {isOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-black hover:text-white hover:rounded-lg cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      <hr className="" />
      {/* Main Chat Area */}
      <main
        data-tutorial="chat"
        className="flex-1 overflow-y-auto px-[200px] py-8 space-y-6 max-lg:px-[100px] max-sm:px-[40px]"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-center">
                {msg.sender === "user" ? (
                  <>
                    <img
                      src={user?.user_metadata?.avatar_url || users}
                      className="w-7 h-7 rounded-full"
                    />
                    <p>{user?.user_metadata?.full_name || "You"}</p>
                  </>
                ) : (
                  <>
                    <img
                      className="w-7 h-7 rounded-full object-cover"
                      src={
                        msg.displayName === "Michael E. Gerber"
                          ? michael
                          : msg.displayName === "Stephen R. Covey"
                            ? covey
                            : msg.displayName === "Eric Ries"
                              ? eric
                              : users
                      }
                      alt="bot-avatar"
                    />

                    <p>{msg.displayName || "AI Advisor"}</p>
                  </>
                )}
              </div>

              <div
                className={`rounded-lg px-5 py-3 max-w-md ${msg.sender === "user"
                  ? "bg-black text-left text-white"
                  : "bg-white text-left border-1"
                  }`}
              >
                {msg.type === "image" ? (
                  <img
                    src={msg.message}
                    alt="Chart"
                    style={{ maxWidth: "100%" }}
                  />
                ) : msg.type === "html" ? (
                  <div dangerouslySetInnerHTML={{ __html: msg.message }} />
                ) : (
                  <ReactMarkdown>{msg.message}</ReactMarkdown>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <p className="text-gray-500 text-center italic">AI is typing...</p>
        )}
      </main>
      <hr className="" />
      {/* Footer Input */}
      <footer className="px-[200px] py-8 max-lg:px-[100px] max-sm:px-[40px]">
        {/* Kondisional: jika analytic aktif, tampilkan upload file */}
        {analyticClicked || predictClicked || algoClicked ? (
          <div className="flex items-center gap-3">
            <label
              htmlFor="file-upload"
              className="bg-white text-black px-4 py-2 rounded-lg cursor-pointer hover:bg-white hover:text-black border"
            >
              Choose File
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setUploadedFile(file);
                }
              }}
            />
            {uploadedFile && (
              <span className="text-gray-600">{uploadedFile.name}</span>
            )}
            <button
              onClick={() => handleUploadFile()}
              type="button"
              disabled={uploading} // ✅ prevent double click
              className={`px-4 py-2 rounded-lg transition-colors border-1 cursor-pointer ${uploading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-black text-white hover:bg-white hover:text-black"
                }`}
            >
              {uploading ? "Analyzing Data..." : "Upload"}{" "}
              {/* ✅ indikator loading */}
            </button>
            {algoClicked && (
              <div>
                <button
                  onClick={handleLinearRegression}
                  className={`px-4 py-2 rounded-lg transition-colors border-1 cursor-pointer ${linearRegressionClicked ? "bg-black text-white" : "bg-white text-black"
                    }`}
                >
                  Linear Regression
                </button>
                <button
                  onClick={handleLogisticRegression}
                  className={`px-4 py-2 rounded-lg transition-colors border-1 cursor-pointer ${logisticRegressionClicked ? "bg-black text-white" : "bg-white text-black"
                    }`}
                >
                  Logistic Regression
                </button>
                <button
                  onClick={handleClustering}
                  className={`px-4 py-2 rounded-lg transition-colors border-1 cursor-pointer ${clusteringClicked ? "bg-black text-white" : "bg-white text-black"
                    }`}
                >
                  Clustering
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {/* 🎙️ Tombol Mic */}
            {micClicked ? (
              <button
                data-tutorial="mic"
                type="button"
                onClick={() => {
                  handleMicClicked();
                  handleStop();
                }}
                className="px-3 py-2 rounded-lg border transition-colors bg-red-500 text-white hover:bg-red-600"
              >
                ❌ Stop
              </button>
            ) : (
              <button
                data-tutorial="mic"
                type="button"
                onClick={() => {
                  handleMicClicked();
                  resetTranscript();
                  handleStart();
                }}
                className={`px-3 py-2 rounded-lg border transition-colors ${listening
                  ? "bg-green-500 text-white"
                  : "bg-white text-black hover:bg-gray-100"
                  }`}
              >
                🎙️
              </button>
            )}

            {/* Input text */}
            <input
              data-tutorial="input"
              type="text"
              placeholder="Ask AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="text-black flex-1 border border-black-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={handleSend}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-white hover:text-black transition-colors border-1 cursor-pointer"
            >
              Send
            </button>
          </div>
        )}

        {/* Mentor dropdown + Analytics toggle */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <select
            data-tutorial="select"
            className="border rounded-lg px-4 py-2 w-[200px] cursor-pointer"
            onChange={handleMentorChange}
            disabled={mentorLocked || analyticClicked || predictClicked} // ⛔ disabled jika analytic/predict aktif
            value={
              selectedMentor
                ? selectedMentor === "Michael E. Gerber"
                  ? "orang1"
                  : selectedMentor === "Stephen R. Covey"
                    ? "orang2"
                    : "orang3"
                : ""
            } // ensure controlled
          >
            <option value="">Choose Mentor</option>
            <option value="orang1">Michael E. Gerber</option>
            <option value="orang2">Stephen R. Covey</option>
            <option value="orang3">Eric Ries</option>
          </select>

          <button
            data-tutorial="analytics"
            onClick={handleAnalytic}
            className={`px-4 py-2 rounded-lg transition-colors border-1 cursor-pointer ${analyticClicked ? "bg-black text-white" : "bg-white text-black"
              }`}
          >
            Analytics
          </button>
          <button
            data-tutorial="predict"
            onClick={handlePredict}
            className={`px-4 py-2 rounded-lg transition-colors border-1 cursor-pointer ${predictClicked ? "bg-black text-white" : "bg-white text-black"
              }`}
          >
            Future
          </button>
          <button
            data-tutorial="algo"
            onClick={handleAlgo}
            className={`px-4 py-2 rounded-lg transition-colors border-1 cursor-pointer ${algoClicked ? "bg-black text-white" : "bg-white text-black"
              }`}
          >
            Algorithm
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Chatbot;
