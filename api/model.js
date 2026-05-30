const https = require('https');

const BLOB_URL = 'https://ts9k0yjegcacnjcs.private.blob.vercel-storage.com/l39_skyfox.glb';

module.exports = function handler(req, res) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    res.status(500).json({ error: 'Storage not configured' });
    return;
  }

  const opts = {
    headers: { Authorization: 'Bearer ' + token },
  };

  https.get(BLOB_URL, opts, upstream => {
    if (upstream.statusCode !== 200) {
      console.error('Blob status:', upstream.statusCode);
      res.status(502).json({ error: 'Blob returned ' + upstream.statusCode });
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
    res.status(502).json({ error: err.message });
  });
};
