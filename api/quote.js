// Quote form handler (Vercel Function, POST /api/quote).
//
// 1. Validates the enquiry: name, phone or email, suburb, service.
// 2. Stores up to 5 job photos in Vercel Blob (when BLOB_READ_WRITE_TOKEN is set) and keeps their public URLs.
// 3. Forwards everything as JSON to a LeadConnector (GoHighLevel) "Inbound Webhook" workflow trigger
//    (GHL_WEBHOOK_URL). That workflow creates or updates the contact in the CRM and sends the
//    notification email, so the CRM and the notification inbox both come from one place.
//
// Environment variables (set in Vercel, Project Settings, Environment Variables):
//   GHL_WEBHOOK_URL        required. The Inbound Webhook URL from the LeadConnector workflow.
//   BLOB_READ_WRITE_TOKEN  optional. Added automatically when a Vercel Blob store is connected to the project.
//                          Without it, enquiries still go through, but photos are not stored.

const MAX_PHOTOS = 5;
const MAX_PHOTO_BYTES = 4 * 1024 * 1024;
const LIMITS = { full_name: 120, phone: 40, email: 160, suburb: 80, property_address: 160, property_size: 80, service_needed: 80, job_notes: 2000, page_url: 300 };

const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const clean = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);

export function GET() {
  return json(405, { ok: false, error: 'method_not_allowed' });
}

export async function POST(request) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return json(400, { ok: false, error: 'bad_request' });
  }

  // Spam trap: real visitors never see or fill the "website" field.
  if (clean(form.get('website'), 200)) return json(200, { ok: true });

  const f = {};
  for (const [key, max] of Object.entries(LIMITS)) f[key] = clean(form.get(key), max);

  const missing = [];
  if (!f.full_name) missing.push('full_name');
  if (!f.phone && !f.email) missing.push('phone_or_email');
  if (!f.suburb) missing.push('suburb');
  if (!f.service_needed) missing.push('service_needed');
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) missing.push('email');
  if (missing.length) return json(422, { ok: false, error: 'invalid', fields: missing });

  const webhook = process.env.GHL_WEBHOOK_URL;
  if (!webhook) {
    console.error('quote: GHL_WEBHOOK_URL is not set, enquiry not delivered', { service: f.service_needed, suburb: f.suburb });
    return json(503, { ok: false, error: 'not_configured' });
  }

  // Photos
  const files = form.getAll('photos').filter(p => p && typeof p === 'object' && p.size > 0).slice(0, MAX_PHOTOS);
  const photoUrls = [];
  let photoNote = '';
  if (files.length && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import('@vercel/blob');
      const stamp = new Date().toISOString().slice(0, 10);
      const id = Math.random().toString(36).slice(2, 10);
      for (const [i, file] of files.entries()) {
        if (!/^image\//.test(file.type) || file.size > MAX_PHOTO_BYTES) continue;
        const ext = (file.type.split('/')[1] || 'jpg').replace('jpeg', 'jpg').replace(/[^a-z0-9]/g, '');
        const blob = await put(`quote-photos/${stamp}/${id}-${i + 1}.${ext}`, file, { access: 'public', contentType: file.type, addRandomSuffix: true });
        photoUrls.push(blob.url);
      }
    } catch (err) {
      console.error('quote: photo upload failed', err);
      photoNote = `${files.length} photo(s) were attached but could not be stored. Ask the customer to email them.`;
    }
  } else if (files.length) {
    photoNote = `${files.length} photo(s) were attached but photo storage is not set up. Ask the customer to email them.`;
  }

  const [first_name, ...rest] = f.full_name.split(/\s+/);
  const payload = {
    ...f,
    first_name,
    last_name: rest.join(' '),
    city: f.suburb,
    photo_urls: photoUrls.join('\n'),
    photo_count: photoUrls.length,
    ...Object.fromEntries(photoUrls.map((u, i) => [`photo_${i + 1}`, u])),
    photo_note: photoNote,
    source: 'Website quote form',
    submitted_at: new Date().toISOString()
  };

  try {
    const res = await fetch(webhook, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) {
      console.error('quote: webhook returned', res.status, await res.text().catch(() => ''));
      return json(502, { ok: false, error: 'crm_rejected' });
    }
  } catch (err) {
    console.error('quote: webhook request failed', err);
    return json(502, { ok: false, error: 'crm_unreachable' });
  }

  return json(200, { ok: true, photos: photoUrls.length });
}
