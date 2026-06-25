import supabase from "./supabase";

/**
 * @param {{{id: string, name: string, email: string, bio:string|null, created_at: string|null}} data
 */
export async function createUserProfile(data) {
    const {error} = await supabase.from('user_profiles').insert(data);

    if (error) throw new Error("Error al crear el perfil. " + error.message);
}

/**
 * Cambia el perfil del usuario
 * @param {string} id 
 * @param {{{id: string, name: string, email: string, bio:string|null, created_at: string|null, photo_url?: string|null}} data 
 */
export async function updateUserProfile(id, data) {
    console.log(data);
    const { error } = await supabase.from('user_profiles').update(data).eq('id', id);

    if (error) throw new Error("Error al actualizar el perfil. " + error.message);
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