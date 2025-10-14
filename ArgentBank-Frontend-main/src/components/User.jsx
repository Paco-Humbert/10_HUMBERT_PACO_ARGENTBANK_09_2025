import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUsername } from '../redux/actions/user.actions.jsx';
import { isValidName } from "../utils/regex.jsx";
import '../sass/components/_UserProfile.scss';

function User () {
    /* 
       Lecture du state global Redux
       
       - token : nécessaire pour authentifier la requête PUT
       - userData : infos actuelles de l'utilisateur (prenom, nom, username)
    */
    const token = useSelector((state) => state.auth.token);
    const userData = useSelector((state) => state.user.userData);

    /* 
       State local du composant
       
       - display : gère l'affichage (mode lecture vs mode édition)
       - userName : nouvelle valeur saisie pour le username
       - errorMessage : message d'erreur de validation
    */
    const [display, setDisplay] = useState(true);
    const [userName, setUserName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    /* Pour envoyer des actions Redux (mise à jour du store) */
    const dispatch = useDispatch();

    /* 
       handleSubmitUsername (asynchrone)
       
       - Empêche le rechargement du formulaire
       - Valide le username côté front (regex)
       - Envoie un PUT authentifié vers /user/profile
       - Met à jour Redux avec la valeur renvoyée par l'API
       - Ferme le formulaire si succès
    */
    const handleSubmitUsername = async (event) => {
        event.preventDefault();

        /* Validation front du nouveau username */
        if (!isValidName(userName)) {
            setErrorMessage("Invalid username");
            return;
        } else {
            setErrorMessage("");
        }

        try {
            /* Appel API : mise à jour du username (auth via Bearer token) */
            const response = await fetch('http://localhost:3001/api/v1/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ userName }),
            });

            if (response.ok) {
                const data = await response.json();

                /* Récupération du username confirmé côté back */
                const username = data.body.userName;

                /* Mise à jour du store Redux (userReducer.username) */
                dispatch(updateUsername(username));

                /* Retour en mode lecture */
                setDisplay(!display);
            } else {
                console.log("Invalid Fields");
            }

        } catch (error) {
            console.error(error);
        }
    }
    
    /* 
       - Mode lecture : message de bienvenue + bouton "Edit Name"
       - Mode édition : formulaire pour changer le username
    */
    return (
        <div className="header">
            { display ? 
                <div>
                    <h2>Welcome back 
                        <br />
                        {userData.firstname} {userData.lastname} !
                    </h2>

                    {/* Passage en mode édition */}
                    <button className="edit-button" onClick={() => setDisplay(!display)}>
                        Edit Name
                    </button>
                </div>
                :
                <div>
                    <h2>Edit user info</h2>

                    {/* Formulaire d'édition du username */}
                    <form>
                        <div className="edit-input">
                            <label htmlFor="username">User name:</label>
                            <input
                                type="text"
                                id="username"
                                defaultValue={userData.username}
                                onChange={(event) => setUserName(event.target.value)}
                            />
                        </div>

                        {/* Champs informatifs, non modifiables  */}
                        <div className="edit-input">
                            <label htmlFor="firstname">First name:</label>
                            <input
                                type="text"
                                id="firstname" 
                                defaultValue={userData.firstname}
                                disabled={true}
                            />
                        </div>
                        <div className="edit-input">
                            <label htmlFor="lastname">Last name:</label>
                            <input
                                type="text"
                                id="lastname" 
                                defaultValue={userData.lastname}
                                disabled={true}
                            />
                        </div>

                        {/* Actions : sauvegarde / annulation */}
                        <div className="buttons">
                            <button className="edit-username-button" onClick={handleSubmitUsername}>
                                Save
                            </button>
                            <button className="edit-username-button" onClick={() => setDisplay(!display)}>
                                Cancel
                            </button>
                        </div>

                        {/* Message d'erreur si validation échoue */}
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </form>
                </div>
            }
        </div>
    )
}

export default User;
