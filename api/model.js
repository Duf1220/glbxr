const https = require('https');

const BLOB_URL = 'https://ts9k0yjegcacnjcs.private.blob.vercel-storage.com/l39_skyfox.glb';

module.exports = function handler(req, res) {
  const token = (process.env.BLOB_READ_WRITE_TOKEN || '').trim();
  if (!token) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Storage not configured' }));
    return;
  }

  https.get(BLOB_URL, { headers: { Authorization: 'Bearer ' + token } }, upstream => {
    if (upstream.statusCode !== 200) {
      console.error('Blob status:', upstream.statusCode);
      res.statusCode = 502;
      res.end(JSON.stringify({ error: 'Blob returned ' + upstream.statusCode }));
      return;
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Content-Type', 'model/gltf-binary');
    if (upstream.headers['content-length']) {
      res.setHeader('Content-Length', upstream.headers['content-length']);
    }
    upstream.pipe(res);
  }).on('error', err => {
    console.error('Fetch error:', err.message);
    res.statusCode = 502;
    res.end(JSON.stringify({ error: err.message }));
  });
};
