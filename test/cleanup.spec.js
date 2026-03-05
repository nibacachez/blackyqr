/**
 * test/cleanup.spec.js
 * Uso:
 *   CLEANUP_SECRET=mi-secret CLEANUP_URL=http://localhost:3000/api/cleanup-reports node test/cleanup.spec.js
 * Requiere Node 18+ (fetch global) o instala `node-fetch`.
 */
(async () => {
  let fetchFn;
  try {
    fetchFn = global.fetch || require('node-fetch');
  } catch (e) {
    fetchFn = global.fetch;
  }

  if (!fetchFn) {
    console.error('fetch no disponible. Usa Node 18+ o instala node-fetch.');
    process.exit(1);
  }

  const url = process.env.CLEANUP_URL || 'http://localhost:3000/api/cleanup-reports';
  const secret = process.env.CLEANUP_SECRET || 'mi-secret';

  try {
    const res = await fetchFn(url, { method: 'POST', headers: { 'x-admin-secret': secret } });
    console.log('status', res.status);
    const body = await res.text();
    console.log('body', body);
  } catch (err) {
    console.error('Error ejecutando la petición:', err);
    process.exit(2);
  }
})();
