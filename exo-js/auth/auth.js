function generateToken(user) {
    if (typeof user !== 'object' || user === null) {
        throw new Error('objet non valide');
    }
    const jsonString = JSON.stringify(user);
    return btoa(jsonString); 
}

function verifyToken(token) {
    try {
        const decodedString = atob(token); 
        return JSON.parse(decodedString);
    } catch (error) {
        throw new Error('Token invalide');
    }
}

const user = { username: "jean", role: "user" };
const token = generateToken(user);
console.log("Token généré:", token);

const verifiedUser = verifyToken(token);
console.log("Utilisateur vérifié:", verifiedUser);


//code lancé dans la console chrome retournant : Token généré: eyJ1c2VybmFtZSI6ImplYW4iLCJyb2xlIjoidXNlciJ9
// VM44:23 Utilisateur vérifié: {username: 'jean', role: 'user'}