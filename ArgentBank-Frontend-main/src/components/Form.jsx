import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginFailed, loginSuccess } from '../redux/actions/auth.actions.jsx';
import { isValidEmail, isValidPassword } from '../utils/regex.jsx';
import '../sass/components/_Form.scss';

function Form () {
    /* 
       Déclaration des states locaux
       
       - email : stocke l'email entré par l'utilisateur
       - password : stocke le mot de passe
       - rememberMe : stocke si l'utilisateur a coché "se souvenir de moi"
       - errorMessage : affiche un message si les données sont invalides
    */
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    /* Hook React Router pour rediriger l'utilisateur après connexion */
    const navigate = useNavigate();
    /* Hook Redux pour envoyer des actions et mettre à jour le state global */
    const dispatch = useDispatch();

    /* 
       Fonction asynchrone qui gère la soumission
      
       - Empêche le rechargement de la page (event.preventDefault)
       - Vérifie la validité de l'email et du mot de passe
       - Envoie la requête à l'API de login
       - Stocke le token et redirige vers /profile si succès
    */
    const handleSubmit = async (event) => {
        event.preventDefault();
        /* Vérification de l'email */
        if (!isValidEmail(email)) {
            setErrorMessage("Invalid email adress");
            return;
        }
        /* Vérification du mot de passe */
        if (!isValidPassword(password)) {
            setErrorMessage("Invalid password");
            return;
        }
        try {
             /* Envoi de la requête POST au back-end pour s'authentifier */
            const response = await fetch("http://localhost:3001/api/v1/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                /* On envoie l'email et le mot de passe dans le body */
                body: JSON.stringify({email, password}),
            });
            if (response.ok) {
                const data = await response.json();
                /* Récupération du token renvoyé par l'API */
                const token = data.body.token;
                /* Envoi de l'action Redux loginSuccess pour mettre à jour le store */
                dispatch(loginSuccess(token));
                /* Stockage du token en session (effacé si l'onglet se ferme) */
                sessionStorage.setItem("token", token);
                /* Si l'utilisateur a coché "se souvenir de moi", stockage dans le localStorage */
                if (rememberMe) {
                    localStorage.setItem("token", token);
                }

                /* Redirection vers la page de profil après connexion réussie */
                navigate('/profile');
            } else {
                const error = "Incorrect email/password"
                dispatch(loginFailed(error));
            }
        } catch (error) {
            console.error(error);
        }
    }
    /* 
       Rendu du formulaire de connexion
      
       - Champs contrôlés pour l'email et le mot de passe
       - Checkbox pour "Remember me"
       - Bouton de soumission qui déclenche handleSubmit
       - Affiche un message d'erreur si errorMessage est défini
    */
    return (
        <section className='sign-in-content'>
            <i className="fa-solid fa-circle-user"></i>
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <div className='input-wrapper'>
                    <label htmlFor='username'>Username</label>
                    <input 
                        id='username' 
                        type='email'
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div className='input-wrapper'>
                    <label htmlFor='password'>Password</label>
                    <input 
                        id='password' 
                        type='password'
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                <div className='input-remember'>
                    <input 
                        id='remember-me' 
                        type='checkbox' 
                        checked={rememberMe}
                        onChange={(event) => setRememberMe(event.target.checked)}
                    />
                    <label htmlFor='remember-me'>Remember me</label>
                </div>
                <button className="sign-in-button">
                    Sign In
                </button>
                {errorMessage && <p className='error-message'>{errorMessage}</p>}
            </form>
        </section>
    )
}

export default Form