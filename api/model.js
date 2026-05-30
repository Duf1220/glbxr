const BLOB_URL = 'https://ts9k0yjegcacnjcs.private.blob.vercel-storage.com/l39_skyfox.glb';

module.exports = async function handler(req, res) {
  const token = (process.env.BLOB_READ_WRITE_TOKEN || '').trim();
  if (!token) {
    res.statusCode = 500;
    res.end('Storage not configured');
    return;
  }

  try {
    const upstream = await fetch(BLOB_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!upstream.ok) {
      res.statusCode = 502;
      res.end('Blob error: ' + upstream.status);
      return;
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());

    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'model/gltf-binary');
    res.setHeader('Content-Length', buffer.length);
    res.end(buffer);

  } catch (e) {
    console.error('Error:', e.message);
    res.statusCode = 500;
    res.end(e.message);
  }
};
