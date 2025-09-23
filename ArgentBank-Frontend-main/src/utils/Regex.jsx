export const isValidName = (name) => {
    const regex = /^\p{L}\p{M}*(?:[ '-]\p{L}\p{M}*)*$/u;
    return regex.test(name);
};

export const isValidEmail = (email) => {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
};

export const isValidPassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{3,}$/; 
    return regex.test(password);
};