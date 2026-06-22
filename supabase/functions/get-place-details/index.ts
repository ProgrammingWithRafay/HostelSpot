// This file runs on the Deno runtime (Supabase Edge Functions), not Node/Vite.

// Supabase Edge Function: get-place-details
// Deploy with: supabase functions deploy get-place-details --no-verify-jwt
// Set secret: supabase secrets set GOOGLE_MAPS_API_KEY=your_key

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const CACHE_HOURS = 24;

serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { placeId } = await req.json();

    if (!placeId) {
      return new Response(JSON.stringify({ error: 'placeId is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Check cache first
    const { data: cached } = await supabase
      .from('place_cache')
      .select('data, fetched_at')
      .eq('place_id', placeId)
      .single();

    if (cached) {
      const fetchedAt = new Date(cached.fetched_at);
      const hoursSince = (Date.now() - fetchedAt.getTime()) / 1000 / 3600;
      if (hoursSince < CACHE_HOURS) {
        return new Response(JSON.stringify(cached.data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Fetch from Google Places API
    if (!GOOGLE_MAPS_API_KEY) {
      return new Response(JSON.stringify({ photos: [], reviews: [], opening_hours: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const fields = 'name,rating,reviews,photos,formatted_phone_number,opening_hours';
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const googleData = await response.json();

    if (googleData.status !== 'OK') {
      return new Response(JSON.stringify({ photos: [], reviews: [], opening_hours: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const result = googleData.result;

    const cleaned = {
      photos: (result.photos || []).slice(0, 8).map((p: Record<string, unknown>) => ({
        photo_reference: p.photo_reference,
        width: p.width,
        height: p.height,
        url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${p.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`,
      })),
      reviews: (result.reviews || []).slice(0, 5).map((r: Record<string, unknown>) => ({
        author_name: r.author_name,
        rating: r.rating,
        text: r.text,
        relative_time_description: r.relative_time_description,
        profile_photo_url: r.profile_photo_url,
      })),
      opening_hours: result.opening_hours?.weekday_text || [],
      formatted_phone_number: result.formatted_phone_number,
    };

    // Store in cache
    await supabase.from('place_cache').upsert({
      place_id: placeId,
      data: cleaned,
      fetched_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify(cleaned), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
