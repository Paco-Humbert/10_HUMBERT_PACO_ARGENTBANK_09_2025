import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/images/argentBankLogo.webp';
import { logout } from '../redux/actions/auth.actions';
import '../sass/components/_Header.scss';

function Header() {
    /*
     Récupération des données Redux
     
     - isConnected : contient le token de l'utilisateur s'il est connecté
     - username : affiche dynamiquement le nom d'utilisateur depuis Redux
       (se met à jour immédiatement après modification du profil)
  */
  const isConnected = useSelector((state) => state.auth.token);
  const username = useSelector((state) => state.user.userData.username);
  /* 
     Initialisation des hooks Redux et React Router
     
     - dispatch : permet de déclencher une action Redux
     - navigate : redirige l'utilisateur après la déconnexion
  */
  const dispatch = useDispatch();
  const navigate = useNavigate();

    /* 
      Fonction de déconnexion
     
     - Déclenche l'action logout()
     - Vide le localStorage et le sessionStorage
     - Redirige vers la page d'accueil
  */
  const logoutHandler = () => {
    dispatch(logout());
    sessionStorage.clear();
    localStorage.clear();
    navigate('/');
  };

  return (
    <header>
      <nav>
        <Link to="/">
          <img src={Logo} alt="Bank Logo" />
        </Link>
        {isConnected ? (
          <div className="connected">
            <Link to="/profile">
              <i className="fa-solid fa-2x fa-circle-user" />
              <p>{username}</p>
            </Link>
            <Link to="/" onClick={logoutHandler}>
              <i className="fa-solid fa-arrow-right-from-bracket" />
              <p>Sign out</p>
            </Link>
          </div>
        ) : (
          <div>
            <Link to="/login">
              <i className="fa-solid fa-circle-user"></i>
              <p>Sign In</p>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
