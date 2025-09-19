import { GET_USERPROFILE, EDIT_USERNAME, LOGOUT } from "../actions/type.actions"
/* 
   État initial de l'utilisateur
   
   - status : état de la requête ("VOID", "SUCCEEDED", "MODIFIED")
   - userData : objet qui contient toutes les données de l'utilisateur
     (id, email, firstname, lastname, username, etc.)
*/
const initialState = {
    status: 'VOID',
    userData: {}
}
/* 
   Reducer utilisateur
  
   - Gère les données de l'utilisateur dans Redux
   - Réagit aux actions GET_USERPROFILE, EDIT_USERNAME et LOGOUT
*/
export const userReducer = (state = initialState, action ) => {
    switch (action.type) {
         /*
           Cas : Récupération du profil
          
           - Met à jour l'état avec les données de l'utilisateur
           - Passe le status à "SUCCEEDED" pour indiquer le succès
        */
        case GET_USERPROFILE:
            return {
                ...state,
                status: 'SUCCEEDED',
                userData: action.payload // les données de l'utilisateur récupérées via l'API
            }
        /*
           Cas : Modification du username
           
           - Met à jour uniquement le champ username
           - Garde les autres données utilisateur inchangées
           - Passe le status à "MODIFIED"
        */
        case EDIT_USERNAME: 
            return {
                ...state,
                status: "MODIFIED",
                userData: {
                    ...state.userData,  // conserve les autres infos (email, prénom...)
                    username: action.payload // remplace uniquement le username
                } 
            } 
        /* 
           Cas : Déconnexion
          
           - Réinitialise l'état utilisateur
           - Supprime toutes les données stockées
        */
        case LOGOUT: {
            return initialState;  
        }   
        /*
           Cas par défaut
           
           - Si aucune action ne correspond,
             retourne l'état actuel sans modification
        */
        default:
            return state;    
    }
}

export default userReducer;