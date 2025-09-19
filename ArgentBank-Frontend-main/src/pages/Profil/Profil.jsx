import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userProfile } from '../../redux/actions/user.actions.jsx';
import User from '../../components/User.jsx';
import Account from '../../components/Account.jsx';
import AccountCardData from '../../data/AccountCardData.json';

/* 
   - Récupère les données de l'utilisateur connecté via l'API
   - Les enregistre dans Redux
   - Affiche les infos de l'utilisateur et ses comptes
*/
function UserProfile () {
    /* Sélection du token d'authentification dans Redux (présent ou non) */
    const token = useSelector((state) => state.auth.token);
    /* Initialisation du dispatch Redux pour mettre à jour le state global */
    const dispatch = useDispatch();

    /* 
       useEffect : lancé à chaque fois que le token change
       
       - Si un token est présent → l'utilisateur est connecté
       - On va chercher ses infos dans l'API
       - Puis on les enregistre dans Redux pour qu'elles soient dispo partout
    */
    useEffect(() => {
        if (token) {
            /* Définition d'une fonction asynchrone pour récupérer les données utilisateur */
            const userData = async () => {
                try {
                    /* Appel API en POST vers /user/profile avec le token */
                    const response = await fetch('http://localhost:3001/api/v1/user/profile', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`, // Authentification avec le token
                        },
                    });

                    if (response.ok) {
                        /* Conversion de la réponse en JSON */
                        const data = await response.json();
                        
                        /* Construction d'un objet userData avec les infos de l'API */
                        const userData = {
                            createdAt: data.body.createdAt,
                            updatedAt: data.body.updatedAt,
                            id: data.body.id,
                            email: data.body.email,
                            firstname: data.body.firstName,
                            lastname: data.body.lastName,
                            username: data.body.userName
                        }

                        /* Mise à jour du state global Redux avec les données utilisateur */
                        dispatch(userProfile(userData));

                    } else {
                        console.log("error while retrieving profile");
                    }
                } catch (error) {
                    console.error(error);
                }
            };
            /* Exécution de la fonction asynchrone */
            userData();
        }
    }, [dispatch, token]);

    /* 
       - <User /> : affiche les informations de l'utilisateur
       - Map sur AccountCardData pour afficher chaque compte
    */
    return (
        <div className='profile-page'>
            <main className='bg-dark'>
                {/* Composant User : infos + édition du username */}
                <User />
                {/* Boucle sur les comptes stockés dans le fichier JSON */}
                {AccountCardData.map((data) => (
                    <Account 
                        key={data.id}
                        title={data.title}
                        amount={data.amount}
                        description={data.description}
                    />
                ))}
            </main>
        </div>
    )
}

export default UserProfile;
