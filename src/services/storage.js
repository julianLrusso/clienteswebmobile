import supabase from "./supabase";

/**
 * 
 * @param {File} file 
 * @param {string} filename 
 * @param {string} bucket 
 * @param {boolean} upsert
 */
export async function uploadFile(file, filename, bucket = 'Avatars', upsert = true) {
    const {error} = await supabase
        .storage.from(bucket)
        .upload(filename, file, {upsert});

    if (error) throw new Error("Error al subir el archivo. " + error.message);
}

/**
 * 
 * @param {string} filename 
 * @param {string} bucket 
 * @returns {string}
 */
export function getFileUrl(filename, bucket = 'Avatars') {
    const {data, error} = supabase
        .storage.from(bucket)
        .getPublicUrl(filename);
    if (error) throw new Error("Error al leer el archivo. " + error.message);

    return data.publicUrl;
}

/**
 * 
 * @param {string} filename 
 * @param {string} bucket 
 */
export async function deleteFile(filename, bucket = 'Avatars') {
    const { error } = await supabase
        .storage.from(bucket)
        .remove(filename);

    if(error) {
        throw new Error("Error al eliminar el archivo. "+error.message);
    }
}