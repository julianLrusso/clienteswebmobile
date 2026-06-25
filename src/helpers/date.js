const formatter = new Intl.DateTimeFormat('es-AR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
});

/**
 * Retorna la fecha como string en formato:
 *  DD:MM:YYYY hh:ii:ss
 * 
 * @param {Date|string|null} date 
 */
export function formatDate(date) {
    if(!date) return;

    if(typeof date == "string") {
        date = new Date(date);
    }
    
    return formatter.format(date).replace(',', '');
}