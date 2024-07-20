
import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

function getLocalDateISO() {
    let date = new Date();
    let timezoneOffset = date.getTimezoneOffset() * 60000; // Convert offset to milliseconds
    let localDate = new Date(date.getTime() - timezoneOffset);
    return localDate.toISOString().split('T')[0];
}

export async function get({ params, locals }) {
    const { id } = params;
    const { session } = locals;

    let query = supabase.from('journal')
        .select(`id, day, content, embedding`)
        .eq('user_id', session?.user.id);

    if (id === 'today') {
        query = query.eq('day', getLocalDateISO());
    } else {
        query = query.eq('id', id);
    }

    const { data, error } = await query;

    if (error) {
        return json({ error: error.message }, { status: 500 });
    }

    return json(data);
}
