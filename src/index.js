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
