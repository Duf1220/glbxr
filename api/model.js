const BLOB_URL = 'https://ts9k0yjegcacnjcs.private.blob.vercel-storage.com/l39_skyfox.glb';

module.exports = async function handler(req, res) {
  const token = (process.env.BLOB_READ_WRITE_TOKEN || '').trim();
  if (!token) {
    res.statusCode = 500;
    res.end('Storage not configured');
    return;
  }

  let upstream;
  try {
    upstream = await fetch(BLOB_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (e) {
    console.error('Fetch error:', e.message);
    res.statusCode = 502;
    res.end(e.message);
    return;
  }

  if (!upstream.ok) {
    console.error('Blob status:', upstream.status);
    res.statusCode = 502;
    res.end('Blob returned ' + upstream.status);
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.setHeader('Content-Type', 'model/gltf-binary');
  const len = upstream.headers.get('content-length');
  if (len) res.setHeader('Content-Length', len);

  const { Readable } = require('stream');
  Readable.fromWeb(upstream.body).pipe(res);
};
