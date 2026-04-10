const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const FormData = require('form-data');
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

const CONFIG = {
  acrcloud: {
    host: 'identify-eu-west-1.acrcloud.com',
    accessKey: '81dde312b57af72d24b9f502d5e439ea',
    accessSecret: '0kr5JkdqMHSVvCJxT9fzaDNelOkMdcNP8303JPri',
  },
  supabase: {
    url: 'https://toqevpwwssimvytitrye.supabase.co',
    serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvcWV2cHd3c3NpbXZ5dGl0cnllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgxNzE2NSwiZXhwIjoyMDkxMzkzMTY1fQ.eqwlPZxOmu0MEC8fhHfHqWA5dUBAEaXRkai5VWce09E',
  },
  chunkDurationSeconds: 30,
  tempDir: '/tmp/adverify_chunks',
  retryDelayMs: 5000,
};

const STATIONS = [
  { id: 'freedom-kano',   name: 'Freedom Radio Kano',   market: 'Kano',   frequency: '99.3 FM',  streamUrl: 'http://s2.voscast.com:12330/' },
  { id: 'freedom-kaduna', name: 'Freedom Radio Kaduna', market: 'Kaduna', frequency: '90.5 FM',  streamUrl: 'https://stream.zeno.fm/pwbsfalp9o8tv' },
  { id: 'freedom-dutse',  name: 'Freedom Radio Dutse',  market: 'Dutse',  frequency: '89.5 FM',  streamUrl: 'http://s2.voscast.com:12330/' },
  { id: 'freedom-abuja',  name: 'Freedom Radio Abuja',  market: 'Abuja',  frequency: '95.1 FM',  streamUrl: 'http://s2.voscast.com:12330/' },
  { id: 'dala-fm',        name: 'Dala FM Kano',         market: 'Kano',   frequency: '101.5 FM', streamUrl: 'http://s2.voscast.com:12334' },
];

const supabase = createClient(CONFIG.supabase.url, CONFIG.supabase.serviceKey);

function buildACRSignature(timestamp) {
  const { accessKey, accessSecret } = CONFIG.acrcloud;
  const stringToSign = ['POST', '/v1/identify', accessKey, 'audio', '1', timestamp].join('\n');
  return crypto.createHmac('sha1', accessSecret).update(stringToSign).digest('base64');
}

function captureChunk(station) {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const outputFile = path.join(CONFIG.tempDir, station.id + '_' + timestamp + '.mp3');
    const ffmpeg = spawn('ffmpeg', [
      '-y',
      '-i', station.streamUrl,
      '-t', String(CONFIG.chunkDurationSeconds),
      '-ar', '8000',
      '-ac', '1',
      '-acodec', 'libmp3lame',
      '-b:a', '64k',
      outputFile,
    ], { stdio: ['ignore', 'pipe', 'pipe'] });

    ffmpeg.on('close', (code) => {
      if (code === 0 && fs.existsSync(outputFile)) {
        resolve(outputFile);
      } else {
        reject(new Error('ffmpeg exited with code ' + code + ' for ' + station.name));
      }
    });

    setTimeout(() => {
      ffmpeg.kill('SIGKILL');
      reject(new Error('ffmpeg timeout for ' + station.name));
    }, (CONFIG.chunkDurationSeconds + 15) * 1000);
  });
}

async function identifyChunk(audioFile) {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = buildACRSignature(timestamp.toString());
  const fileBuffer = fs.readFileSync(audioFile);
  const form = new FormData();
  form.append('sample', fileBuffer, { filename: path.basename(audioFile), contentType: 'audio/mp3' });
  form.append('sample_bytes', fileBuffer.length.toString());
  form.append('access_key', CONFIG.acrcloud.accessKey);
  form.append('data_type', 'audio');
  form.append('signature_version', '1');
  form.append('timestamp', timestamp.toString());
  form.append('signature', signature);
  const response = await fetch('https://' + CONFIG.acrcloud.host + '/v1/identify', {
    method: 'POST',
    body: form,
    timeout: 20000,
  });
  return response.json();
}

async function logPlayEvent(station, acr, chunkStartTime) {
  const customMatches = acr && acr.metadata && acr.metadata.custom_files ? acr.metadata.custom_files : [];
  if (customMatches.length === 0) return;
  const match = customMatches[0];
  const event = {
    station_id: station.id,
    station_name: station.name,
    market: station.market,
    frequency: station.frequency,
    ad_id: match.acrid,
    ad_title: match.title || 'Unknown',
    advertiser: match.custom_fields ? match.custom_fields.advertiser : null,
    campaign_id: match.custom_fields ? match.custom_fields.campaign_id : null,
    play_start: new Date(chunkStartTime).toISOString(),
    duration_sec: match.duration_ms ? Math.round(match.duration_ms / 1000) : null,
    confidence: match.score || null,
    detection_method: 'stream',
    raw_response: acr,
  };
  const result = await supabase.from('play_events').insert(event);
  if (result.error) {
    console.error('[DB ERROR] ' + station.name + ':', result.error.message);
  } else {
    console.log('[MATCH] ' + station.name + ' => "' + event.ad_title + '" @ ' + event.play_start);
  }
}

function sleep(ms) { return new Promise(function(r) { setTimeout(r, ms); }); }

async function monitorStation(station) {
  console.log('[START] Monitoring ' + station.name + ' (' + station.streamUrl + ')');
  while (true) {
    const chunkStart = Date.now();
    let audioFile = null;
    try {
      audioFile = await captureChunk(station);
      const acr = await identifyChunk(audioFile);
      const status = acr && acr.status ? acr.status.code : null;
      if (status === 0) {
        await logPlayEvent(station, acr, chunkStart);
      } else if (status === 1001) {
        console.log('[NO MATCH] ' + station.name + ' — listening, no registered ad detected');
      } else {
        console.warn('[ACR WARN] ' + station.name + ': code ' + status + ' — ' + (acr && acr.status ? acr.status.msg : 'unknown'));
      }
    } catch (err) {
      console.error('[ERROR] ' + station.name + ':', err.message);
      await sleep(CONFIG.retryDelayMs);
    } finally {
      if (audioFile && fs.existsSync(audioFile)) {
        try { fs.unlinkSync(audioFile); } catch(e) {}
      }
    }
  }
}

async function main() {
  if (!fs.existsSync(CONFIG.tempDir)) fs.mkdirSync(CONFIG.tempDir, { recursive: true });
  console.log('=== AdVerify Nigeria Monitor Worker ===');
  console.log('Starting ' + STATIONS.length + ' station monitors...');
  await Promise.allSettled(STATIONS.map(function(s) { return monitorStation(s); }));
}

main().catch(console.error);
