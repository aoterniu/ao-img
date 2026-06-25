/**
 * ao 图床 v16 — 完整功能 + 配额追踪
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 页面路由（从 R2 读取 HTML）
    if (path === '/' || path === '') return servePage(env, '__page_page', cors(url.origin));
    if (path === '/extensions') return servePage(env, '__page_extensions', cors(url.origin));
    if (path === '/manage') return servePage(env, '__page_manage', cors(url.origin));
    if (path === '/api') return servePage(env, '__page_api', cors(url.origin));

    // PWA manifest
    if (path === '/manifest.json') {
      return Response.json({
        name: 'ao 图床',
        short_name: 'ao图床',
        start_url: '/',
        display: 'standalone',
        background_color: '#f5f7fa',
        theme_color: '#10b981',
        icons: [{
          src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%2310b981"/><text x="50" y="65" font-size="40" font-weight="bold" text-anchor="middle" fill="white">ao</text></svg>',
          sizes: '192x192',
          type: 'image/svg+xml'
        }]
      }, { headers: { 'Content-Type': 'application/json' } });
    }

    // CORS
    const o = request.headers.get('Origin') || '*';

    if (path === '/test-r2') {
      try {
        const list = await env.IMG.list({ limit: 5 });
        const keys = list.objects.filter(o => !o.key.startsWith('__')).map(o => o.key);
        return Response.json({ ok: true, count: keys.length, files: keys.slice(0, 3) });
      } catch (e) { return Response.json({ error: e.message }); }
    }

    if (path === '/test-get') {
      try {
        const obj = await env.IMG.get('2tpioVdq.png');
        if (!obj) return Response.json({ error: 'null' });
        const buf = await obj.arrayBuffer();
        return new Response(buf, { headers: { 'Content-Type': obj.httpMetadata?.contentType || 'image/png' } });
      } catch (e) { return Response.json({ error: e.message }); }
    }

    // 图片访问（不带扩展名 → Cloudflare 不拦截）
    if (path.startsWith('/i/')) {
      const key = path.slice(3);
      if (!key) return new Response('No key', { status: 400 });

      // 如果 key 没有扩展名，尝试查找对应的 R2 对象
      let actualKey = key;
      if (!key.includes('.')) {
        // 没有扩展名，尝试找对应文件
        const listed = await env.IMG.list({ prefix: key, limit: 5 });
        const match = listed.objects.find(o => o.key.startsWith(key) && !o.key.startsWith('__'));
        if (match) actualKey = match.key;
      }

      try {
        const obj = await env.IMG.get(actualKey);
        if (!obj) return new Response('Not Found', { status: 404 });

        // 格式转换配额检查
        const format = url.searchParams.get('format');
        if (format) {
          const monthKey = 'transform_' + new Date().toISOString().slice(0, 7);
          const used = parseInt(await env.STATS.get(monthKey) || '0');
          const limit = 5000;
          if (used >= limit) {
            return new Response('本月免费转换次数已用完（5000次/月），下月重置', { status: 429 });
          }
          await env.STATS.put(monthKey, String(used + 1));
        }

        // IMAGES binding 格式转换（免费 5000 次/月）
        if (format && env.IMAGES) {
          try {
            const formatMap = {'webp':'image/webp','png':'image/png','jpg':'image/jpeg','jpeg':'image/jpeg','avif':'image/avif'};
            const mimeType = formatMap[format.toLowerCase()] || 'image/webp';
            const result = await env.IMAGES
              .input(obj.body)
              .transform({ fit: 'scale-down' })
              .output({ format: mimeType });
            const resp = result.response();
            return new Response(resp.body, {
              headers: {
                'Content-Type': mimeType,
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Access-Control-Allow-Origin': '*'
              }
            });
          } catch (e) {
            // 转换失败，返回原图
          }
        }

        const buf = await obj.arrayBuffer();
        return new Response(buf, {
          headers: {
            'Content-Type': obj.httpMetadata?.contentType || 'image/png',
            'Cache-Control': 'public, max-age=31536000, immutable',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (e) {
        return new Response('ERROR: ' + e.message, { status: 500 });
      }
    }

    if (path === '/stats') {
      try {
        const total = parseInt(await env.STATS.get('total') || '0');
        const today = new Date().toISOString().slice(0, 10);
        const todayCount = parseInt(await env.STATS.get('day_' + today) || '0');
        const totalSize = parseInt(await env.STATS.get('totalSize') || '0');
        const monthKey = 'transform_' + new Date().toISOString().slice(0, 7);
        const transformUsed = parseInt(await env.STATS.get(monthKey) || '0');
        return Response.json({ total, today: todayCount, totalSize, sizeStr: totalSize < 1024 ? totalSize + 'B' : totalSize < 1048576 ? (totalSize/1024).toFixed(1) + 'KB' : (totalSize/1048576).toFixed(1) + 'MB', transformUsed, transformLimit: 5000 });
      } catch (e) { return Response.json({ total: 0 }); }
    }

    // 上传接口（支持文件上传和 URL 上传）
    if (url.pathname === '/upload' && request.method === 'POST') {
      try {
        const contentType = request.headers.get('Content-Type') || '';
        let f, origName = '', sz = 0, format = 'original', quality = '100', password = '';

        if (contentType.includes('application/json')) {
          // URL 上传模式
          const body = await request.json();
          const fileUrl = body.url;
          format = body.format || 'original';
          quality = body.quality || '100';
          password = body.password || '';
          if (!fileUrl) return Response.json({ error: '请提供图片 URL' }, { status: 400, headers: cors(o) });

          // 下载远程文件
          const resp = await fetch(fileUrl, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0' } });
          if (!resp.ok) return Response.json({ error: '下载失败：' + resp.status }, { status: 400, headers: cors(o) });

          const ct = resp.headers.get('Content-Type') || '';
          if (!ct.startsWith('image/') && !ct.startsWith('video/'))
            return Response.json({ error: 'URL 不是图片或视频' }, { status: 400, headers: cors(o) });

          origName = fileUrl.split('/').pop().split('?')[0] || 'image.jpg';
          sz = parseInt(resp.headers.get('Content-Length') || '0');
          f = { stream: () => resp.body, type: ct, name: origName, size: sz };
        } else {
          // 文件上传模式
          const fd = await request.formData();
          f = fd.get('file');
          format = fd.get('format') || 'original';
          quality = fd.get('quality') || '100';
          password = fd.get('password') || '';
          if (!f) return Response.json({ error: '请选择文件' }, { status: 400, headers: cors(o) });
          origName = f.name || '';
          sz = f.size || 0;
        }

        const ext = origName ? '.' + origName.split('.').pop() : '.png';
        const key = randKey(ext);
        const ct = format === 'webp' ? 'image/webp' : format === 'png' ? 'image/png' : format === 'jpg' ? 'image/jpeg' : f.type || 'image/png';

        await env.IMG.put(key, f.stream(), {
          httpMetadata: { contentType: ct, cacheControl: 'public, max-age=31536000, immutable' },
          customMetadata: { originalName: origName, uploadedAt: new Date().toISOString(), format, protected: password ? 'true' : '' }
        });

        await updateStats(env, sz);

        return Response.json({
          url: url.origin + '/i/' + key,
          key,
          size: sz,
          originalName: origName,
          protected: !!password
        }, { headers: cors(o) });
      } catch (e) {
        return Response.json({ error: e.message }, { status: 500, headers: cors(o) });
      }
    }

    // 最近上传（不带扩展名的 URL，避免 Cloudflare 拦截）
    if (path.startsWith('/recent')) {
      try {
        const l = await env.IMG.list({ limit: 20 });
        const files = l.objects.filter(o => !o.key.startsWith('__')).map(o => ({
          key: o.key, url: url.origin + '/i/' + o.key, size: o.size,
          uploaded: o.customMetadata?.uploadedAt || o.uploaded,
          protected: !!o.customMetadata?.password
        }));
        return Response.json({ files }, { headers: cors(o) });
      } catch (e) { return Response.json({ files: [] }); }
    }

    return new Response('Not Found', { status: 404 });
  }
};

// 辅助函数
function cors(origin) {
  return { 'Access-Control-Allow-Origin': origin || '*', 'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
}

function randKey(ext) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id + ext;
}

async function updateStats(env, size) {
  try {
    const t = parseInt(await env.STATS.get('total') || '0') + 1;
    const today = new Date().toISOString().slice(0, 10);
    const todayCount = parseInt(await env.STATS.get('day_' + today) || '0') + 1;
    const totalSize = parseInt(await env.STATS.get('totalSize') || '0') + size;
    await Promise.all([
      env.STATS.put('total', String(t)),
      env.STATS.put('day_' + today, String(todayCount)),
      env.STATS.put('totalSize', String(totalSize))
    ]);
  } catch (e) {}
}

async function servePage(env, key, corsHeaders) {
  try {
    const obj = await env.IMG.get(key);
    if (!obj) return new Response('Not Found', { status: 404 });
    const buf = await obj.arrayBuffer();
    return new Response(buf, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache', ...corsHeaders } });
  } catch (e) {
    return new Response('ERROR: ' + e.message, { status: 500 });
  }
}
