import React, { useState, useEffect } from "react";
import "../style/style.css";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const Landing = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Cek apakah ada user session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });

    // Dengarkan perubahan status auth (login/logout)
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="bg-lightGreen flex flex-col h-[100vh] justify-center items-center">
      <h1 className="font-Montserrat font-bold text-[25px]">ADVISOR</h1>
      <p className="w-[300px] text-center">Personalized Business Advisor</p>

      <Link
        to={isLoggedIn ? "/chatbot" : "/login"}
        className="bg-[#739A88] text-white px-4 py-2 rounded-md mt-4 inline-block"
      >
        Get Started
      </Link>
    </div>
  );
};

export default Landing;
