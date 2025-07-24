// import { useEffect, useState } from 'react'
// import { supabase } from './supabaseClient'

// function Login() {
//   const [user, setUser] = useState(null)

//   useEffect(() => {
//     // Ambil user saat komponen pertama kali dirender
//     supabase.auth.getUser().then(({ data: { user } }) => {
//       setUser(user)
//     })

//     // Dengarkan perubahan status auth
//     const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user || null)
//     })

//     return () => {
//       listener.subscription.unsubscribe()
//     }
//   }, [])

//   const handleLogin = async () => {
//     await supabase.auth.signInWithOAuth({
//       provider: 'google',
//     })
//   }

//   const handleLogout = async () => {
//     await supabase.auth.signOut()
//   }

//   return (
//     <div style={{ textAlign: 'center', marginTop: '2rem' }}>
//       <h1>Google Auth with Supabase</h1>

//       {user ? (
//         <>
//           <img
//             src={user.user_metadata.avatar_url}
//             alt="Avatar"
//             style={{ borderRadius: '50%', width: 100, height: 100 }}
//           />
//           <h2>{user.user_metadata.full_name}</h2>
//           <p>Email: {user.email}</p>
//           <p>User ID: {user.id}</p>
//           <button onClick={handleLogout}>Logout</button>
//         </>
//       ) : (
//         <button onClick={handleLogin}>Login with Google</button>
//       )}
//     </div>
//   )
// }

// export default Login
