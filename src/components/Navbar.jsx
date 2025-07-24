import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import '../style/style.css'; // keep this if you're using custom CSS

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

  return (
    <nav className="flex justify-between items-center px-6 md:px-12 py-4 bg-white">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2">
        <Logo />
      </Link>

      {/* Right side - Login button or User avatar/dropdown */}
      <div className="relative" ref={dropdownRef}>
        {!isLoggedIn ? (
          <button
            onClick={() => setIsLoggedIn(true)} // Simulate login
            className="px-4 py-2 rounded-full bg-black text-white hover:bg-white hover:text-black transition"
          >
            Login
          </button>
        ) : (
          <>
            <img
              src="https://i.pravatar.cc/40?img=12" // Placeholder avatar image
              alt="User"
              onClick={toggleDropdown}
              className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer"
            />
            {isOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 text-sm">Profile</Link>
                <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100 text-sm">Settings</Link>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => {
                    setIsOpen(false); // Close dropdown on logout
                    setIsLoggedIn(false); // Simulate logout
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