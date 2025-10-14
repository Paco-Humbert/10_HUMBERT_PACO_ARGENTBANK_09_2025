import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector, useDispatch, } from "react-redux";
import { loginSuccess } from "./redux/actions/auth.actions.jsx";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import Profile from "./pages/Profil/Profil.jsx";
import Error from "./pages/Error/Error.jsx";
import "./sass/_Main.scss";


/*
   Restauration de la session utilisateur

   - Vérifie si un token est présent dans le localStorage ou le sessionStorage
   - Si un token existe, déclenche l’action Redux loginSuccess() pour rétablir la connexion
   - Permet de conserver la session après un rechargement ou une fermeture du navigateur
   - Le state local 'booted' empêche le rendu avant que cette vérification soit terminée
*/
function App() {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);
  const isConnected = !!token;            
  const [booted, setBooted] = useState(false);

  
  useEffect(() => {
    const t = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (t) dispatch(loginSuccess(t));
    setBooted(true);                      
  }, [dispatch]);

  if (!booted) return null;     

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/profile"
            element={isConnected ? <Profile /> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<Error />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App