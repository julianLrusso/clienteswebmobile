import supabase from '@/services/supabase';

/**
 * Crea una publicación en la base de datos
 * 
 * @param {{name: string, body: string}} data 
 * @returns {{status: string, message: string}}
 */
export async function sendPosts({name, body}) {

    const {error} = await supabase
        .from('public_posts')
        .insert({
            name: name, 
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

    const {data, error} = await supabase.from('public_posts').select().order('id', { ascending: false });

    if (error) {
        throw new Error("Error al obtener las postulaciones. " + error.message);
    }

    return data;
}

/**
 * Suscripción al canal de posts.
 * 
 * @param {({id: number, name: string, body: string, created_at: string}) => void} callback 
 * @returns {() => void} Unsubscribe
 */
export function subscribeToPosts(callback) {
    const postsChannel = supabase.channel('public_posts');

    postsChannel.on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'public_posts'
        },
        payload => { callback(payload.new) }
    );

    postsChannel.subscribe();

    return () => postsChannel.unsubscribe();
}