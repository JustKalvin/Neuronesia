import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import users from "../assets/user/user.png";
import "../style/style.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Define isLoggedIn state to control visibility of login button vs. avatar
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Initialize as false (not logged in)
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );
    return () => authListener.subscription.unsubscribe();
  }, []);

  return (
    <nav className="flex justify-between items-center px-6 md:px-12 py-4 bg-white">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2">
        <Logo />
      </Link>

      {/* Right side - Login button or User avatar/dropdown */}
      <div className="relative" ref={dropdownRef}>
        {!user ? (
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-full bg-black text-white hover:bg-white hover:text-black transition"
          >
            Login
          </button>
        ) : (
          <>
            <img
              src={users}
              alt="User"
              onClick={toggleDropdown}
              className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer"
            />
            {isOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50">
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-black hover:text-white hover:rounded-lg cursor-pointer"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setIsOpen(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
