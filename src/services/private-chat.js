import supabase from "./supabase";

/**
 * Ordena 2 ids
 * @param {string} id1 
 * @param {string} id2 
 * @returns 
 */
function sortIds(id1, id2) {
    return [id1, id2].sort();
}

/**
 * Crea una conversación privada
 * @param {{sender_id: string, receiver_id: string}} 
 * @returns {Promise<{id: string, user_id1: string, user_id2: string, created_at: string}>}
 */
async function createPrivateChat({sender_id, receiver_id}){
    const [id1, id2] = sortIds(sender_id, receiver_id);

    const {data, error: errorChat} = await supabase
        .from('private_chats')
        .insert({
            user_id1: id1,
            user_id2: id2
        })
        .select();

    if (errorChat) throw new Error("Error al generar la conversación. " + errorChat.message);

    return data[0];
}
/**
 * Envia los mensajes privados
 * @param {{sender_id: string, receiver_id: string, body: string}}
 * 
 */
export async function sendPrivateChatMessage({sender_id, receiver_id, body}) {

    const chat = await fetchOrCreatePrivateChatFor({sender_id, receiver_id});
    const chatId = chat.id

    const {error: errorMessage} = await supabase
        .from('private_chats_messages')
        .insert({
            chat_id: chatId,
            sender_id: sender_id,
            body: body
        })

    if (errorMessage) throw new Error("Error al enviar el mensaje privado. " + errorMessage.message);

}

/**
 * 
 * @param {{sender_id: string, receiver_id: string}} 
 * @returns {Promise<{id: string, user_id1: string, user_id2: string, created_at: string}>}
 */
async function fetchPrivateChatFor({sender_id, receiver_id}) {
    const [id1, id2] = sortIds(sender_id, receiver_id);
    const {data, error} = await supabase
        .from('private_chats')
        .select()
        .eq('user_id1', id1)
        .eq('user_id2', id2);
    
    if (error) throw new Error("Error al buscar la conversación privada. " + error.message);

    return data?.[0] || null
}

/**
 * 
 * @param {{sender_id: string, receiver_id: string}} 
 * @returns {Promise<{id: string, user_id1: string, user_id2: string, created_at: string}>}
 */
async function fetchOrCreatePrivateChatFor({sender_id, receiver_id}) {
    let chat = await fetchPrivateChatFor({sender_id, receiver_id});

    if(!chat){
        chat = await createPrivateChat({sender_id, receiver_id});
    }

   return chat;
}

/**
 * @param {{sender_id: string, receiver_id: string}} data
 * @returns {Promise<{id: string, chat_id: number, sender_id: string, body: string, created_at: string}[]>}
 */
export async function getPrivateMessages({ sender_id, receiver_id }) {
    const chat = await fetchOrCreatePrivateChatFor({ sender_id, receiver_id });

    const { data, error } = await supabase
        .from('private_chats_messages')
        .select()
        .eq('chat_id', chat.id);

    if(error) {
        console.error("Error al traer los mensajes de la conversación: ", error);
        throw new Error(error.message);
    }

    return data;
}

/**
 * 
 * @param {{sender_id: string, receiver_id: string}} data 
 * @param {(newMessage: {id: string, chat_id: number, sender_id: string, receiver_id: string, body: string, created_at: string}) => void} callback
 * @returns {Promise<() => void>} 
 */
export async function subscribeToPrivateChatMessages({sender_id, receiver_id}, callback) {
    const chat = await fetchOrCreatePrivateChatFor({sender_id, receiver_id});

    const privateChatChannel = supabase.channel(`private_chat:${chat.id}:messages`);

    privateChatChannel.on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'private_chats_messages',
            filter: 'chat_id=eq.' + chat.id,
        },
        payload => {
            callback(payload.new)
        }
    );

    privateChatChannel.subscribe();

    return () => {
        privateChatChannel.unsubscribe();
    }
}