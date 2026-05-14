import supabase from "./supabase";

let userData = {
    id: null,
    email:null,
    name: null
}

const observers = [];


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

    userData = {
        ...userData,
        id: data.user.id,
        name: data.user.user_metadata.name,
        email: data.user.email
    }
    notifyAll();

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

    userData = {
        ...userData,
        id: data.user.id,
        name: data.user.user_metadata.name,
        email: data.user.email
    }
    
    notifyAll();

    return data.user;
}

/**
 * Cierra la sesión
 * @returns {void}
 */
export async function logout() {
    const {error} = await supabase.auth.signOut();

    userData = {
        ...userData,
        id: null,
        name: null,
        email: null
    }
    notifyAll();

    if(error) throw new Error(error.message);
}

/**
 * Cambia el nombre del usuario autenticado
 * @param {string} name 
 * @returns {void}
 */
export async function updateName(name) {
  const { error } = await supabase.auth.updateUser({
    data: { name }
  });

  if (error) throw new Error("Error al actualizar el nombre. " + error.message);

  userData = { ...userData, name };
  notifyAll();
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
 * @param {(userData: {id: null|string, name: null|string, email: null|string}) => void} observer 
 * @returns {void}
 */
export function subscribeToAuthStateChanges(observer) {
    observers.push(observer);
    notify(observer)
}

/**
 * Notifica al observers sobre los cambios
 * @param {(userData: {id: null|string, name: null|string, email: null|string}) => void} observer 
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