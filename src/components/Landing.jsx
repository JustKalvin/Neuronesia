import React, { useState, useEffect } from "react";
import "../style/style.css";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Card from "./Card";

import { supabase } from "../lib/supabaseClient";

const Landing = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Cek apakah ada user session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });

    // Dengarkan perubahan status auth (login/logout)
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session?.user);
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      <Navbar />
      <hr />
      <div className="flex flex-col items-center justify-center mt-40">
          <h1 className="text-6xl font-bold mb-4 text-center font-Montserrat">Meet Aivise!</h1>
          <h3 className="text-3xl font-bold mb-4 text-center font-Montserrat">Your Intelligent Business Mentor</h3>
          <p className="text-md mb-6 text-center max-w-2xl font-Poppins">
             Aivise is an AI mentor built to help business owners by providing advice grounded in real books from expert authors. Instead of giving generic answers, Aivise learns directly from trusted business literature to offer practical, proven insights tailored to your needs.
          </p>
          <div className="flex gap-4 mb-10">
            <Link
              to={isLoggedIn ? "/chatbot" : "/login"}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-zinc-200 hover:text-black transition"
            >
              Get Started
            </Link>

            <a
              href="/docs" // or your actual documentation route
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 border border-black text-black rounded-lg hover:bg-blue-50 transition"
            >
              See Documentation
            </a>
          </div>

          <div className="mt-10">
            <h1 className="text-4xl font-bold text-center mb-5">Meet your mentors!</h1>
            <p className="text-md mb-6 text-center max-w-2xl font-Poppins">Aivise is powered by the insights of experienced business mentors whose ideas are shared through widely respected books. Our AI learns from a carefully selected library of real-world business literature, covering topics such as leadership, strategy, innovation, and growth. This ensures that the guidance Aivise provides is rooted in proven principles from trusted experts across the business world.
            </p>
          </div>
        </div>
        <div className="max-w-5xl mx-auto p-8 flex flex-wrap justify-center gap-4">
          <Card />
          <Card />
          <Card />
        </div>
    </div>
    
  );
};

export default Landing;
