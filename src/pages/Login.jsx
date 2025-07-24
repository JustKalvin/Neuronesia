import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getUsers, getUsersById, insertUser, updateUser, deleteUser } from "../query"

function Login() {
  const [user, setUser] = useState(null)
  const [theUsers, setTheUsers] = useState([])

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

      const result = await insertUser(id, full_name, email, avatar_url, created_at);

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
      setUser(user)
    })

    // Dengarkan perubahan status auth
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/login`
      }
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>Google Auth with Supabase</h1>
      {theUsers && (
        theUsers.map((item, idx) => {
          return (
            <div>
              {item.full_name}
            </div>
          )
        })
      )}
      {user ? (
        <>
          <img
            src={user.user_metadata.avatar_url}
            alt="Avatar"
            style={{ borderRadius: '50%', width: 100, height: 100 }}
          />
          <h2>{user.user_metadata.full_name}</h2>
          <p>Email: {user.email}</p>
          <p>User ID: {user.id}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login with Google</button>
      )}
    </div>
  )
}

export default Login
