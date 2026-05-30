const { presignUrl } = require('@vercel/blob');

const BLOB_URL = 'https://ts9k0yjegcacnjcs.private.blob.vercel-storage.com/l39_skyfox.glb';

module.exports = async function handler(req, res) {
  const token = (process.env.BLOB_READ_WRITE_TOKEN || '').trim();
  if (!token) {
    res.statusCode = 500;
    res.end('Storage not configured');
    return;
  }

  try {
    const signed = await presignUrl(BLOB_URL, {
      token,
      expiresIn: 300, // 5 minutes
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store');
    res.statusCode = 302;
    res.setHeader('Location', signed);
    res.end();
  } catch (e) {
    console.error('presignUrl error:', e.message);
    res.statusCode = 500;
    res.end(e.message);
  }
};
