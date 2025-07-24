import React from "react";
import "../style/style.css";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="flex flex-col h-[100vh] justify-center items-center">
      <h1 className="font-bold text-[25px]">Neuronesia</h1>
      <p className="w-[300px] text-center">
        Personalized Business Advisor
      </p>
      <Link to="/home" className="bg-red-100 px-4 py-2 rounded-md mt-4">Get Started</Link>
    </div>
  );
};

export default Landing;
