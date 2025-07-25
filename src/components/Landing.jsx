import React, { useState, useEffect } from "react";
import "../style/style.css";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Card from "./Card";
import users from "../assets/user/user.png";
import user1 from "../assets/advisor/michael.jpg";
import user2 from "../assets/advisor/covey.jpg";
import user3 from "../assets/advisor/eric.jpg";
import video from "../assets/video/Untitled.mp4";
import ParticlesComponent from "../components/Particles";
import Faq from "../components/Faq";
import teams from "../assets/teams.jpg";
import { motion,useInView } from "framer-motion";

import { supabase } from "../lib/supabaseClient";
import Footer from "./Footer";

const MotionLink = motion(Link);
const mentorRef = useRef(null);
const isMentorInView = useInView(mentorRef, { once: true, margin: "-100px" });

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
    <div className="relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <ParticlesComponent id="particles" className="w-full h-full" />
      </div>

      <Navbar />
      <hr />
      <div className="flex flex-col items-center justify-center mt-25 md:mt-40">
        <div className="items-center flex flex-col mb-32 xl:mb-0 md:mb-10 max-md:mb-5 max-sm:mb-5">
          <motion.h1
            className="text-6xl font-bold mb-4 text-center font-Montserrat max-md:text-4xl max-lg:text-5xl"
            initial={{ opacity: 0, y: -50 }} // Awal posisi dan transparansi
            animate={{ opacity: 1, y: 0 }} // Animasi menuju normal
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Meet Aivise!
          </motion.h1>
          <h3 className="text-3xl font-bold mb-4 text-center font-Montserrat max-md:text-2xl max-lg:text-2xl max-md:px-5 max-sm:px-5">
            Your Intelligent Business Mentor
          </h3>
          <p className="text-md mb-6 text-center max-w-2xl font-Poppins max-md:px-5 max-sm:px-5">
            Aivise is an AI mentor built to help business owners by providing
            advice grounded in real books from expert authors. Instead of giving
            generic answers, Aivise learns directly from trusted business
            literature to offer practical, proven insights tailored to your
            needs.
          </p>
          
          
          <motion.div className="flex gap-4 mb-10">
            <MotionLink
              to={isLoggedIn ? "/chatbot" : "/login"}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-white hover:border-1 hover:text-black transition"
            >
              Get Started
            </MotionLink>

            <motion.a
              href="/docs" // or your actual documentation route
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 border border-black text-black rounded-lg hover:bg-black hover:text-white hover:border-white hover:border-1 transition"
            >
              See Documentation
            </motion.a>
          </motion.div>
        </div>
        <div className="px-[50px] md:px-[200px] xl:mt-15 rounded">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-auto rounded-[15px]"
          >
            <source src={video} type="video/mp4" />
          </video>
        </div>

        <motion.div
          ref={mentorRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isMentorInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}>
          <h1 className="text-6xl font-bold text-center mb-5 mt-25 max-md:text-4xl max-lg:text-5xl"
          >
            Meet your mentors!
          </h1>
          <p className="text-md mb-6 text-center max-w-2xl font-Poppins max-sm:px-5">
            Aivise is powered by the insights of experienced business mentors
            whose ideas are shared through widely respected books. Our AI learns
            from a carefully selected library of real-world business literature,
            covering topics such as leadership, strategy, innovation, and
            growth. This ensures that the guidance Aivise provides is rooted in
            proven principles from trusted experts across the business world.
          </p>
        </motion.div>
      </div>
      <div className="mx-auto p-8 flex flex-wrap justify-center gap-4 mb-10 max-sm:mb-5">
        {[user1, user2, user3].map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 + index * 0.3 }}
          >
            <Card
              image={img}
              name={
                index === 0
                  ? "Michael E. Gerber"
                  : index === 1
                  ? "Stephen R. Covey"
                  : "Eric Ries"
              }
              description="Known For ..."
            />
          </motion.div>
        ))}
      </div>

      <Faq />

      <h1 className="text-6xl font-bold m-10 text-center font-Montserrat max-md:text-4xl max-lg:text-5xl">
        Our Team
      </h1>
      <div className="relative group w-[600px] h-[500px] rounded-xl overflow-hidden mx-auto mb-30 max-md:w-[450px] max-sm:w-[350px] max-sm:h-[300px]">
        <div className="transition duration-300 group-hover:blur-sm">
          <img
            src={teams}
            alt=""
            className="grayscale w-full h-auto rounded-xl"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
          <p className="text-white text-5xl font-bold rounded-lg text-center pb-13">
            Thank You!
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
