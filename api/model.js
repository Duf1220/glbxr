const { getDownloadUrl } = require('@vercel/blob');
const https = require('https');

const BLOB_URL = 'https://ts9k0yjegcacnjcs.private.blob.vercel-storage.com/l39_skyfox.glb';

module.exports = async function handler(req, res) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    res.status(500).json({ error: 'Storage not configured' });
    return;
  }

  try {
    const { url } = await getDownloadUrl(BLOB_URL, { token });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Content-Type', 'model/gltf-binary');

    https.get(url, upstream => {
      if (upstream.headers['content-length']) {
        res.setHeader('Content-Length', upstream.headers['content-length']);
      }
      upstream.pipe(res);
    }).on('error', err => {
      console.error('Upstream error:', err.message);
      res.status(502).end();
    });

  } catch (e) {
    console.error('Blob error:', e.message);
    res.status(502).json({ error: e.message });
  }
};
