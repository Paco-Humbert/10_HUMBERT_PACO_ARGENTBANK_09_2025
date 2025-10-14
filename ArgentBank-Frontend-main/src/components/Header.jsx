import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/images/argentBankLogo.webp';
import { logout } from '../redux/actions/auth.actions';
import { userProfile } from '../redux/actions/user.actions.jsx'; 
import '../sass/components/_Header.scss';

function Header () {
    /*
       Récupération des données depuis Redux
       
       - isConnected : contient le token si l'utilisateur est connecté
       - username : affiche l'username de l'utilisateur connecté dans le header
    */
    const isConnected = useSelector((state) => state.auth.token);
    const usernameRedux = useSelector((state) => state.user.userData.username);

    /* State local pour gérer l’affichage du username (corrige le bug après F5) */
    const [username, setUsername] = useState(
        localStorage.getItem('username') ||
        sessionStorage.getItem('username') ||
        usernameRedux ||
        ''
    );

    /* Initialisation des hooks Redux et React Router */
    const dispatch = useDispatch();
    const navigate = useNavigate();

    /* 
       Récupération du username après F5 :
       
       - Si token existe mais username absent du storage, on récupère le profil une seule fois
       - On met à jour Redux et le storage pour éviter les pertes de données
    */
    useEffect(() => {
        if (!isConnected) {
            setUsername('');
            return;
        }

        const storedUsername =
            localStorage.getItem('username') || sessionStorage.getItem('username');

        if (storedUsername) {
            setUsername(storedUsername);
            return;
        }

        if (usernameRedux) {
            setUsername(usernameRedux);
            if (localStorage.getItem('token')) localStorage.setItem('username', usernameRedux);
            if (sessionStorage.getItem('token')) sessionStorage.setItem('username', usernameRedux);
            return;
        }

        // Si aucune donnée locale, on récupère le profil depuis l’API (v1)
        (async () => {
            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                if (!token) return;

                const res = await fetch('http://localhost:3001/api/v1/user/profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error('Profile fetch failed');
                const data = await res.json();

                const name = data?.body?.userName || data?.body?.username || '';
                setUsername(name);

                dispatch(userProfile({ username: name, ...data?.body }));

                if (localStorage.getItem('token')) localStorage.setItem('username', name);
                if (sessionStorage.getItem('token')) sessionStorage.setItem('username', name);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setUsername('');
            }
        })();
        
    }, [isConnected, usernameRedux, dispatch]);

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
    };

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
    ); 
}

export default Header;
