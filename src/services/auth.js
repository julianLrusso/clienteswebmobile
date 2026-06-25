import { createUserProfile, getUserProfileById, updateUserProfile } from "./profile";
import { getFileUrl, uploadFile } from "./storage";
import supabase from "./supabase";

let userData = {
    id: null,
    email:null,
    name: null,
    bio: null,
    photo_url: null,
    profileFullyLoaded: false,
}

const observers = [];

if(localStorage.getItem('user')){
    userData = JSON.parse(localStorage.getItem('user'));
}

supabase.auth.onAuthStateChange(async (event, session) => {
    if(session){

        // const {data, error} = await supabase.auth.getUser();

        // if (data.user === null || error) {
        //     updateUserData({
        //         id: null,
        //         email:null,
        //         name: null,
        //         bio: null,
        //         profileFullyLoaded: false,
        //     })
        //     return ;
        // }

        updateUserData({
            id: session.user.id,
            email: session.user.email,
        })

        if (userData.profileFullyLoaded) return;

        // Estoy teniendo problemas con el creado del perfil por poner el nombre en el register
        // Debería crear el trigger
        // Si me sobra tiempo lo intento pero no creo porque estoy escribiendo esto a las 00:35 del mismo Jueves que se entrega
        // El nombre va a tardar en aparecer
        // Profe teneme paciencia
        await getUserProfileById(userData.id)
            .then(profile => {
                if (!profile) return;
                updateUserData({
                name: profile.name,
                bio: profile.bio,
                photo_url: profile.photo_url,
                profileFullyLoaded: true,
                })
            }
        )
    } else {
         updateUserData({
            id: null,
            email:null,
            name: null,
            bio: null,
            photo_url: null,
            profileFullyLoaded: false,
        })
    }
});

/**
 * Obtiene el usuario logueado
 * @returns {import("@supabase/supabase-js").User}
 */
export async function getCurrentUser() {
    const {data, error} = await supabase.auth.getUser();

    if (error) throw new Error("Error al obtener el usuario. " + error.message);
    if (data.user === null) return;

    return data.user;
}

/**
 * Registra al usuario en la base de datos
 * @param {{email: string, name: string, password: string}} credentials
 * @returns {import("@supabase/supabase-js").User} 
 */
export async function register({email, name, password}){

    const {data, error} = await supabase.auth.signUp({
        email, 
        password, 
        options: { 
            data: {
                name: name
            }
        }
    });

    if(error) throw new Error(error.message);

    await createUserProfile({id: data.user.id, email: email, name: name})

    return data.user;
}

/**
 * Inicia sesión
 * @param {{email: string, password: string}} credentials
 * @returns {import("@supabase/supabase-js").User} 
 */
export async function login({email, password}) {
    const {data, error} = await supabase.auth.signInWithPassword({email, password});

    if(error) throw new Error(error.message);


    return data.user;
}

/**
 * Cierra la sesión
 * @returns {void}
 */
export async function logout() {
    const {error} = await supabase.auth.signOut();

    if(error) throw new Error(error.message);
}

/**
 * Actualiza la información del perfil del usuario.
 * @param {{bio?: null|string, name?: null|string}} data 
 * @returns {void}
 */
export async function updateCurrentUserProfile(data) {

    // Tuve que hacer esto porque separé todo en componentes distintos entonces uno sí o sí me va a llegar vacío.
    // Tal vez no fue buena idea separar todo en muchos componentes.
    // Así se aprende.
     const filtered = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value != null && value !== "")
    );

    await updateUserProfile(userData.id, filtered);

    updateUserData(filtered);
}

/**
 * 
 * @param {File} file 
 */
export async function updateCurrentUserPhoto(file) {
    const photoName = `${userData.id}/avatar.jpg`
    await uploadFile(file, photoName);

    const photo_url = getFileUrl(photoName);

    if(userData.photo_url !== null) {
        deleteFile(`${userData.id}/${userData.photo_url.split('/').pop()}`);
    }
    
    updateUserProfile(userData.id, {photo_url});
    updateUserData({photo_url});
}

/**
 * Cambiala la contraseña del usuario autenticado
 * @param {string} password 
 * @returns {void}
 */
export async function updatePassword(password) {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new Error("Error al actualizar la contraseña. " + error.message);
}

/**
 * Suscribe a los observers al estado de autenticación
 * @param {(userData: {id: null|string, name: null|string, email: null|string, bio: null|string}) => void} observer 
 * @returns {void}
 */
export function subscribeToAuthStateChanges(observer) {
    observers.push(observer);
    notify(observer)
}

/**
 * Notifica al observers sobre los cambios
 * @param {(userData: {id: null|string, name: null|string, email: null|string, bio: null|string}) => void} observer 
 * @returns {void}
 */
function notify(observer) {
    observer({...userData});
}

/**
 * Notifica a todos los observers de los cambios
 * @returns {void}
 */
function notifyAll(){
    observers.forEach(observer => notify(observer));
}

/**
 * Actualiza el userData y avisa a los observers. También guarda los datos en localstorage 
 * @param {{id: null|string, email: null|string, name: null|string }} newUserData 
 * @returns {void}
 */
function updateUserData(newUserData) {
    userData = {
        ...userData,
        ...newUserData
    }

    notifyAll();

    userData.id !== null ? localStorage.setItem('user', JSON.stringify(userData)) : localStorage.removeItem('user');
}