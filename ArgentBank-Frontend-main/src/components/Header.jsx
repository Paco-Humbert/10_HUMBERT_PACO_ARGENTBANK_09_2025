import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/images/argentBankLogo.webp';
import { logout } from '../redux/actions/auth.actions';
import '../sass/components/_Header.scss';

function Header () {
    /*
       Récupération des données depuis Redux
       
       - isConnected : contient le token si l'utilisateur est connecté
       - firstname : affiche le prénom de l'utilisateur connecté dans le header
    */
    const isConnected = useSelector((state) => state.auth.token);
    const username = useSelector((state) => state.user.userData.username);

    /* Initialisation des hooks Redux et React Router */
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    /* 
       Fonction logoutHandler
       
       - Déclenche l'action Redux logout()
       - Vide le sessionStorage et le localStorage
       - Redirige l'utilisateur vers la page d'accueil
    */
    const logoutHandler = () => {
        dispatch(logout());
        sessionStorage.clear();
        localStorage.clear();
        navigate('/');
    }
    /* 
       Rendu du Header
       
       - Affiche toujours le logo avec un lien vers l'accueil
       - Si l'utilisateur est connecté → affiche prénom + bouton déconnexion
       - Si l'utilisateur n'est PAS connecté → affiche bouton "Sign In"
    */
    return (
        <header>
            <nav>
                <Link to="/">
                    <img src={Logo} alt="Bank Logo" />
                </Link> 
                {isConnected ? (
                    <div className='connected'>
                        <Link to='/profile'>
                            <i className='fa-solid fa-2x fa-circle-user' />
                            <p>{username}</p>
                        </Link>
                        <Link to='/' onClick={logoutHandler}>
                            <i className='fa-solid fa-arrow-right-from-bracket' />
                            <p> Sign out </p>
                        </Link>
                    </div>
                ) : (
                    <div>
                        <Link to='/login' >
                            <i className="fa-solid fa-circle-user"></i>
                            <p>Sign In</p>
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    ) 
}

export default Header