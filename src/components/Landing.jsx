import React, { useState, useEffect } from "react";
import "../style/style.css";

import { Link } from "react-router-dom";
import Logo from "../assets/logo/Logo-Dark.png";
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
      <nav className="w-full px-6 py-4 bg-white">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={Logo} alt="logo-png" className="w-[150px]" />
          </div>

          {/* Menu Links */}
          <div className="hidden md:flex gap-6 text-black font-medium">
            <a href="/chatbot" className="hover:text-gray-500">Chatbots</a>
            <a href="#" className="hover:text-gray-500">About Us</a>
          </div>

          {/* Login Button */}
          <div className="hidden md:block">
            <a
              href="/login"
              className="px-6 py-2 rounded-full text-white bg-gradient-to-r from-midGreen to-darkGreen hover:opacity-90 transition"
            >
              Login
            </a>
          </div>
        </div>
      </nav>
        <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 py-12 gap-10 bg-white">
          {/* Left Text Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl font-bold italic font-Montserrat mb-4">
              Neuronesia
            </h1>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In scelerisque lacus eu sapien venenatis congue. Maecenas eget metus lectus. Nullam interdum mauris libero, non vehicula est consectetur vel.
            </p>
            <Link
              to={isLoggedIn ? "/chatbot" : "/login"}
              className="inline-block px-8 py-3 rounded-full text-white bg-gradient-to-r from-midGreen to-darkGreen hover:opacity-90 transition"
            >
              Get Started
            </Link>
          </div>

          {/* Right Image */}
          <div className="md:w-1/2">
            {/* <img src={HeroImage} alt="hero-illustration" className="w-full max-w-md mx-auto" /> */}
          </div>
        </section>
    </div>
  );
};

export default Landing;
