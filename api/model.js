const { download } = require('@vercel/blob');

const BLOB_URL = 'https://ts9k0yjegcacnjcs.private.blob.vercel-storage.com/l39_skyfox.glb';

module.exports = async function handler(req, res) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    res.status(500).json({ error: 'Storage not configured' });
    return;
  }

  try {
    const { url, contentType } = await download(BLOB_URL, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Content-Type', 'model/gltf-binary');

    const https = require('https');
    https.get(url, upstream => {
      if (upstream.headers['content-length']) {
        res.setHeader('Content-Length', upstream.headers['content-length']);
      }
      upstream.pipe(res);
    }).on('error', () => res.status(502).end());

  } catch (e) {
    res.status(502).json({ error: e.message });
  }
};
