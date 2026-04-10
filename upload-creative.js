/**
 * AdVerify Nigeria — Ad Creative Uploader
 * =========================================
 * Advertisers / agencies use this (or the web dashboard calls it)
 * to register an ad creative with ACRCloud and store the fingerprint ID in Supabase.
 *
 * Usage:
 *   node upload-creative.js \
 *     --file ./dangote-cement-30s.mp3 \
 *     --title "Dangote Cement Q2 2026" \
 *     --advertiser "Dangote Group" \
 *     --campaign-id "uuid-here"
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const FormData = require('form-data');
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const ACR = {
  host:        process.env.ACRCLOUD_HOST,
  accessKey:   process.env.ACRCLOUD_ACCESS_KEY,
  accessSecret:process.env.ACRCLOUD_ACCESS_SECRET,
  bucketName:  process.env.ACRCLOUD_BUCKET || 'adverify-ng',
};

// Build HMAC signature for ACRCloud custom library upload
function signUpload(method, uri, timestamp) {
  const str = [method, uri, ACR.accessKey, timestamp].join('\n');
  return crypto
    .createHmac('sha1', ACR.accessSecret)
    .update(str)
    .digest('base64');
}

async function uploadToACRCloud(filePath, title, advertiser, campaignId) {
  const uri = `/v1/buckets/${ACR.bucketName}/audios`;
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = signUpload('POST', uri, timestamp);

  const form = new FormData();
  form.append('audio_file', fs.createReadStream(filePath));
  form.append('title', title);
  form.append('custom_fields', JSON.stringify({ advertiser, campaign_id: campaignId }));
  form.append('access_key', ACR.accessKey);
  form.append('timestamp', timestamp);
  form.append('signature', signature);

  const res = await fetch(`https://${ACR.host}${uri}`, {
    method: 'POST',
    body: form,
  });
  return res.json();
}

async function registerCreative({ file, title, advertiser, campaignId }) {
  console.log(`\nUploading "${title}" to ACRCloud fingerprint library...`);

  // 1. Upload to ACRCloud custom audio library
  const acrResult = await uploadToACRCloud(file, title, advertiser, campaignId);
  if (!acrResult?.data?.acrid) {
    throw new Error('ACRCloud upload failed: ' + JSON.stringify(acrResult));
  }

  const acrId = acrResult.data.acrid;
  console.log(`ACRCloud fingerprint registered. ACRID: ${acrId}`);

  // 2. Upload original file to Supabase Storage for archiving
  const fileBuffer = fs.readFileSync(file);
  const storageKey = `creatives/${campaignId || 'unassigned'}/${path.basename(file)}`;
  const { error: storErr } = await supabase.storage
    .from('ad-creatives')
    .upload(storageKey, fileBuffer, { contentType: 'audio/mpeg', upsert: true });

  if (storErr) console.warn('Storage upload warning:', storErr.message);

  // 3. Record in Supabase
  const { data, error } = await supabase
    .from('ad_creatives')
    .insert({
      title,
      advertiser,
      campaign_id: campaignId || null,
      acr_id: acrId,
      file_url: storageKey,
    })
    .select()
    .single();

  if (error) throw new Error('DB insert failed: ' + error.message);

  console.log(`Creative saved. DB ID: ${data.id}`);
  console.log('\nCreative is now active — monitor workers will detect it immediately.\n');
  return data;
}

// CLI argument parsing
const args = process.argv.slice(2);
const get = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : null;
};

registerCreative({
  file:       get('--file'),
  title:      get('--title'),
  advertiser: get('--advertiser'),
  campaignId: get('--campaign-id'),
}).catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
