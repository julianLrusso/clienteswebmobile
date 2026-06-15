import supabase from "./supabase";

export async function createUserProfile() {

}

export async function updateUserProfile() {

}

/**
 * Trae los datos del perfil del usuario con el id proporcionado.
 * @param {string} id 
 * @returns {Promise<{id: string, name: string, email: string, bio:string|null, created_at: string}>}
 */
export async function getUserProfileById(id) {
    const {data, error} = await supabase.from('user_profiles').select().eq('id', id);

    if (error) throw new Error("Error al obtener el perfil. " + error.message);

    return data[0];
}