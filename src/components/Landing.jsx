import React, { useState, useEffect } from "react";
import "../style/style.css";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

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
          <h1 className="text-6xl font-bold mb-4 text-center">Meet Aivise!</h1>
          <h3 className="text-3xl font-bold mb-4 text-center">Your Intelligent Business Mentor</h3>
          <p className="text-md mb-6 text-center max-w-2xl">
             Aivise is an AI mentor built to help business owners by providing advice grounded in real books from expert authors. Instead of giving generic answers, Aivise learns directly from trusted business literature to offer practical, proven insights tailored to your needs.
          </p>
          <div className="flex gap-4 mb-10">
            <Link
              to={isLoggedIn ? "/dashboard" : "/login"}
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
            <h1 className="text-4xl font-bold">Meet your mentors!</h1>
          </div>
      </div>
    </div>
    
  );
};

export default Landing;
