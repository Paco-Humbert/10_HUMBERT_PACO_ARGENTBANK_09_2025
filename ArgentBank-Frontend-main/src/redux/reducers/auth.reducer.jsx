import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from "../actions/type.actions";

/* 
   État initial de l'authentification
   
   - status : état de la requête ("VOID", "SUCCEEDED", "FAILED")
   - isConnected : indique si l'utilisateur est connecté (true/false)
   - token : stocke le token d'authentification si l'utilisateur est connecté
   - error : stocke un éventuel message d'erreur si la connexion échoue
*/
const initialState = {
    status: "VOID",
    isConnected: false,
    token: null,
    error: null,
}
/*
   Reducer d'authentification
   
   - Reçoit l'état actuel et une action
   - Retourne un nouvel état en fonction du type d'action
*/
export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        /* 
           Cas : Connexion réussie
           
           - Met à jour le status à "SUCCEEDED"
           - Active isConnected
           - Enregistre le token dans le state
           - Réinitialise les erreurs
        */
        case LOGIN_SUCCESS:
            return {
                ...state,
                status: "SUCCEEDED",
                isConnected: true,
                token: action.payload,
                error: null
            }
        /*
           Cas : Connexion échouée
          
           - Met à jour le status à "FAILED"
           - Désactive isConnected
           - Stocke le message d'erreur renvoyé
        */
        case LOGIN_FAIL: {
            return {
                ...state,
                status: "FAILED",
                isConnected: false,
                error: action.payload
            }
        }  
        /* 
           Cas : Déconnexion
          
           - Réinitialise tout l'état d'authentification
           - Supprime le token et les infos de connexion
        */
        case LOGOUT: {
            return initialState;
        }  
        /*
           Cas par défaut
           
           - Si aucune action ne correspond,retourne l'état actuel sans le modifier
        */
        default:
            return state;
    }
}

export default authReducer;