// Quote form handler (Vercel Function, POST /api/quote).
//
// 1. Validates the enquiry: name, phone or email, suburb, service.
// 2. Stores up to 5 job photos in Vercel Blob (BLOB_READ_WRITE_TOKEN) and keeps their public URLs.
// 3. Sends it straight into the LeadConnector CRM with a Private Integration Token:
//      a. upsert the contact (name, phone, email, suburb, street address, source, custom fields)
//      b. add a note with every detail and the photo links
//      c. add the tag "website quote" LAST, so a tag-triggered workflow (the notification email)
//         fires once the contact and note are complete.
//
// Environment variables (Vercel, Project Settings, Environment Variables):
//   GHL_PIT_TOKEN          required, secret. Sub-account Private Integration Token with the contacts.write scope.
//   GHL_LOCATION_ID        required. The sub-account (location) ID.
//   GHL_TAG                optional, default "website quote".
//   GHL_API_VERSION        optional, default "v3" (the Version header the current API docs require).
//   BLOB_READ_WRITE_TOKEN  set automatically by the connected Vercel Blob store.

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

  const token = process.env.GHL_PIT_TOKEN, locationId = process.env.GHL_LOCATION_ID;
  if (!token || !locationId) {
    console.error('quote: GHL_PIT_TOKEN or GHL_LOCATION_ID is not set, enquiry not delivered', { service: f.service_needed, suburb: f.suburb });
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

  const [firstName, ...rest] = f.full_name.split(/\s+/);
  const crm = (path, payload) => fetch('https://services.leadconnectorhq.com' + path, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, Version: process.env.GHL_API_VERSION || 'v3', 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload)
  });

  // a. Contact. Custom fields are matched by key; if the CRM rejects them (for example a key that does
  //    not exist yet), retry without them. The note below always carries every detail.
  const contact = {
    locationId, firstName, lastName: rest.join(' '), name: f.full_name, source: 'Website quote form',
    city: f.suburb, ...(f.phone && { phone: f.phone }), ...(f.email && { email: f.email }), ...(f.property_address && { address1: f.property_address }),
    customFields: [
      ['service_needed', f.service_needed], ['property_size', f.property_size], ['property_address', f.property_address],
      ['job_notes', f.job_notes], ['job_photos', photoUrls.join('\n')]
    ].filter(([, v]) => v).map(([key, fieldValue]) => ({ key, fieldValue }))
  };
  let contactId;
  try {
    let res = await crm('/contacts/upsert', contact);
    if (!res.ok && res.status !== 401 && res.status !== 403 && contact.customFields.length) {
      console.warn('quote: upsert with custom fields failed', res.status, await res.text().catch(() => ''));
      delete contact.customFields;
      res = await crm('/contacts/upsert', contact);
    }
    const data = await res.json().catch(() => ({}));
    contactId = data?.contact?.id;
    if (!res.ok || !contactId) {
      console.error('quote: contact upsert failed', res.status, JSON.stringify(data).slice(0, 500));
      return json(502, { ok: false, error: 'crm_rejected' });
    }
  } catch (err) {
    console.error('quote: CRM unreachable', err);
    return json(502, { ok: false, error: 'crm_unreachable' });
  }

  // b. Note with the full enquiry. c. Tag last. The contact already exists, so a failure here is logged, not shown to the visitor.
  const note = [
    `Website quote request (${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Perth' })} Perth time)`,
    `Service: ${f.service_needed}`,
    `Name: ${f.full_name}`,
    f.phone && `Phone: ${f.phone}`,
    f.email && `Email: ${f.email}`,
    `Suburb: ${f.suburb}`,
    f.property_address && `Street address: ${f.property_address}`,
    f.property_size && `Property size: ${f.property_size}`,
    f.job_notes && `Job notes: ${f.job_notes}`,
    photoUrls.length ? `Job photos:\n${photoUrls.join('\n')}` : '',
    photoNote,
    f.page_url && `Sent from: ${f.page_url}`
  ].filter(Boolean).join('\n');
  for (const [path, payload] of [[`/contacts/${contactId}/notes`, { body: note, title: `Website quote: ${f.service_needed}` }], [`/contacts/${contactId}/tags`, { tags: [process.env.GHL_TAG || 'website quote'] }]]) {
    try {
      const res = await crm(path, payload);
      if (!res.ok) console.error('quote:', path, 'returned', res.status, await res.text().catch(() => ''));
    } catch (err) { console.error('quote:', path, 'failed', err); }
  }

  return json(200, { ok: true, photos: photoUrls.length });
}
