import supabase from '@/services/supabase';

/**
 * Obtiene el perfil del usuario logueado
 * @returns {import("@supabase/supabase-js").User}
 */
export async function getProfile() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw new Error("Error al obtener el perfil. " + error.message);
    return user;
}