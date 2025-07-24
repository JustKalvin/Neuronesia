import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Logo from "../assets/logo/Aivise-Logo.png";
import {
  getUsers,
  getUsersById,
  insertUser,
  updateUser,
  deleteUser,
} from "../query";
import { Link } from "react-router-dom";
import ParticlesComponent from "../components/Particles";
import { useNavigate } from "react-router-dom";

function Login() {
  const [user, setUser] = useState(null);
  const [theUsers, setTheUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getUsers();
      console.log(result);

      if (result.success && result.data) {
        setTheUsers(result.data);
      } else {
        console.error(result.message);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const insertCurrentUser = async () => {
      if (!user) return;

      const { id, email, user_metadata } = user;
      const full_name = user_metadata.full_name;
      const avatar_url = user_metadata.avatar_url;
      const created_at = new Date().toISOString();

      const result = await insertUser(
        id,
        full_name,
        email,
        avatar_url,
        created_at
      );

      if (!result.success) {
        console.error("Insert user failed:", result.message);
      } else {
        console.log("User inserted successfully");
      }
    };

    insertCurrentUser();
  }, [user]);

  useEffect(() => {
    // Ambil user saat komponen pertama kali dirender
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Dengarkan perubahan status auth
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          navigate("/");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/login`,
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    // <div style={{ textAlign: 'center', marginTop: '2rem' }}>
    //   <h1>Google Auth with Supabase</h1>
    //   {theUsers && (
    //     theUsers.map((item, idx) => {
    //       return (
    //         <div>
    //           {item.full_name}
    //         </div>
    //       )
    //     })
    //   )}
    //   {user ? (
    //     <>
    //       <img
    //         src={user.user_metadata.avatar_url}
    //         alt="Avatar"
    //         style={{ borderRadius: '50%', width: 100, height: 100 }}
    //       />
    //       <h2>{user.user_metadata.full_name}</h2>
    //       <p>Email: {user.email}</p>
    //       <p>User ID: {user.id}</p>
    //       <button onClick={handleLogout}>Logout</button>
    //     </>
    //   ) : (
    //     <button onClick={handleLogin} className='border-1 px-5 py-2 rounded-lg cursor-pointer hover:bg-black hover:text-white duration-200'>Login with Google Account</button>
    //   )}
    // </div>

    <div className="relative h-[100vh] flex flex-col justify-center items-center gap-10">
      {/* Background Particles */}
      <ParticlesComponent
        id="particles"
        className="absolute top-0 left-0 w-full h-full"
      />

      {/* Foreground Content */}
      <img src={Logo} alt="" className="w-[300px] z-10" />

      <div className="flex flex-col justify-center items-center gap-5 z-10">
        <button
          onClick={handleLogin}
          className="border px-5 py-2 rounded-lg cursor-pointer hover:bg-black hover:text-white duration-300"
        >
          Login with Google Account
        </button>
        <Link
          to="/"
          className="border px-5 py-2 rounded-lg hover:bg-black hover:text-white duration-200"
        >
          Back to Home Page
        </Link>
      </div>
    </div>
  );
}

export default Login;
