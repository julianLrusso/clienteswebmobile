import supabase from '@/services/supabase';

/**
 * Crea una publicación en la base de datos
 * 
 * @param {{body: string}} data 
 * @returns {{status: string, message: string}}
 */
export async function sendPosts({body}) {
    const { data: { user } } = await supabase.auth.getUser();
    const {error} = await supabase
        .from('public_posts')
        .insert({
            user_id: user.id, 
            body: body
        });

    if (error) {
        throw new Error("Error al publicar el post. " + error.message)
    };

    return {status: 'success', message: 'Mensaje publicado con éxito.'}
}

/**
 * Obtiene todos las publicaciones.
 * 
 * @returns {Promise<>}
 */
export async function getAllPosts() {

    const {data, error} = await supabase.from('public_posts_with_profiles').select().order('id', { ascending: false });

    if (error) {
        throw new Error("Error al obtener las postulaciones. " + error.message);
    }

    return data;
}

/**
 * Suscripción al canal de posts para inserciones, actualizaciones y eliminaciones.
 * 
 * @param {(payload: object) => void} callback 
 * @returns {() => void} Unsubscribe
 */
export function subscribeToPosts(callback) {
    const postsChannel = supabase.channel('public_posts');

    postsChannel.on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'public_posts'
        },
        payload => { callback(payload) }
    );

    postsChannel.subscribe();

    return () => postsChannel.unsubscribe();
}

/**
 * 
 * @param {{userId: string}} userId 
 * @returns 
 */
export async function getPostsByUser({userId}) {
  const { data, error } = await supabase
    .from('public_posts')
    .select()
    .eq('user_id', userId)
    .order('id', { ascending: false });

  if (error) throw new Error("Error al obtener los posts. " + error.message);

  return data;
}

/**
 * Edita una publicación en la base de datos
 * 
 * @param {string|number} id 
 * @param {{body: string}} data 
 * @returns {Promise<{status: string, message: string}>}
 */
export async function editPost(id, {body}) {
    const { error } = await supabase
        .from('public_posts')
        .update({ body })
        .eq('id', id);

    if (error) {
        throw new Error("Error al editar el post. " + error.message);
    }

    return {status: 'success', message: 'Mensaje editado con éxito.'}
}

/**
 * Elimina una publicación de la base de datos
 * 
 * @param {string|number} id 
 * @returns {Promise<{status: string, message: string}>}
 */
export async function deletePost(id) {
    const { data, error } = await supabase
        .from('public_posts')
        .delete()
        .eq('id', id)
        .select();

    if (error) {
        throw new Error("Error al eliminar el post. " + error.message);
    }

    if (!data || data.length === 0) {
        throw new Error("No se pudo eliminar la publicación. Verifique que tenga permisos (políticas de RLS) para eliminarla.");
    }

    return {status: 'success', message: 'Mensaje eliminado con éxito.'}
}