/**
 * ao 图床 v3 — Cloudflare R2 + KV + Stats
 */
const WECHAT_QR = 'https://img.aoterniu.online/i/58JTFpGE.webp';
const ALIPAY_QR = 'https://img.aoterniu.online/i/EZeXSESc.webp';

const PAGE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ao 图床 - 简单、快速、免费的图床</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif;background:#f5f7fa;color:#333;min-height:100vh;display:flex;flex-direction:column}
a{color:var(--ac);text-decoration:none}a:hover{opacity:.8}
:root{--ac:#10b981;--ac2:#059669;--bg:#f5f7fa;--card:#fff;--bdr:#e5e7eb;--text:#1f2937;--sub:#6b7280;--light:#f9fafb;--radius:12px}

/* 顶部导航 */
.navbar{background:#fff;border-bottom:1px solid var(--bdr);position:sticky;top:0;z-index:100;height:56px;display:flex;align-items:center;padding:0 24px}
.navbar .logo{font-size:1.1rem;font-weight:700;color:var(--ac);cursor:default}
.navbar .nav{margin-left:auto;display:flex;gap:24px;font-size:.88rem}
.navbar .nav a{color:var(--sub);font-weight:500;padding:4px 0;border-bottom:2px solid transparent;transition:all .2s}
.navbar .nav a:hover,.navbar .nav a.on{color:var(--ac);border-bottom-color:var(--ac)}

/* Hero */
.hero{background:linear-gradient(180deg,#ecfdf5 0%,var(--bg) 100%);padding:48px 20px 0;text-align:center}
.hero h1{font-size:2rem;font-weight:700;color:var(--text)}
.hero .tagline{margin-top:10px;font-size:1rem;color:var(--sub)}
.hero .tagline span{margin:0 6px}
.hero .warn{margin-top:8px;font-size:.78rem;color:#9ca3af}

/* 主内容区 */
.main{max-width:760px;margin:0 auto;padding:20px 20px 60px;width:100%;flex:1}
.card{background:var(--card);border:1px solid var(--bdr);border-radius:var(--radius);box-shadow:0 1px 3px rgba(0,0,0,.04);margin-bottom:20px;overflow:hidden}
.card-hd{padding:14px 20px;border-bottom:1px solid var(--bdr);font-weight:600;font-size:.92rem;display:flex;align-items:center;gap:8px}
.card-bd{padding:20px}

/* 上传区 */
.drop{border:2px dashed #d1d5db;border-radius:10px;padding:48px 20px;text-align:center;cursor:pointer;transition:all .25s;background:var(--light)}
.drop:hover{border-color:var(--ac);background:#ecfdf5}
.drop.active{border-color:var(--ac);background:#ecfdf5;transform:scale(1.005)}
.drop svg{width:44px;height:44px;color:var(--ac)}
.drop .t1{margin-top:12px;font-size:.95rem;color:var(--text)}
.drop .t2{margin-top:4px;font-size:.8rem;color:var(--sub)}

/* URL 输入 */
.url-row{display:flex;gap:8px;margin-top:16px}
.url-row input{flex:1;border:1px solid var(--bdr);border-radius:8px;padding:10px 14px;font-size:.9rem;outline:none;transition:border .2s}
.url-row input:focus{border-color:var(--ac)}
.url-row input::placeholder{color:#9ca3af}
.btn{padding:10px 20px;background:var(--ac);color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:.88rem;white-space:nowrap;transition:all .15s}
.btn:hover{background:var(--ac2)}
.btn:active{transform:scale(.97)}

/* 选项面板 */
.opts{display:flex;gap:20px;margin-top:16px;padding:16px 20px;background:var(--light);border-radius:8px;border:1px solid var(--bdr);flex-wrap:wrap;align-items:center}
.opts .opt{display:flex;align-items:center;gap:6px;font-size:.85rem;color:var(--sub)}
.opts select{border:1px solid var(--bdr);border-radius:6px;padding:5px 8px;font-size:.82rem;color:var(--text);background:#fff;cursor:pointer}
.opts .info{font-size:.78rem;color:#9ca3af;margin-left:4px}

/* 进度条 */
.bar{height:3px;background:var(--bdr);border-radius:2px;margin-top:16px;overflow:hidden;display:none}
.bar .fill{height:100%;background:linear-gradient(90deg,var(--ac),#06b6d4);width:0;transition:width .2s}
.status{text-align:center;margin-top:8px;font-size:.82rem;color:var(--sub);display:none}
.spin{display:inline-block;width:12px;height:12px;border:2px solid #d1d5db;border-top-color:var(--ac);border-radius:50%;animation:spin .7s linear infinite;vertical-align:middle;margin-right:5px}
@keyframes spin{to{transform:rotate(360deg)}}

/* 上传结果 */
.results{display:none;margin-top:16px}
.r-item{background:var(--light);border:1px solid var(--bdr);border-radius:var(--radius);padding:16px;margin-bottom:12px}
.r-item .preview{width:100%;max-height:280px;object-fit:contain;border-radius:8px;background:#fff;cursor:pointer;margin-bottom:12px}
.r-item .row{display:flex;gap:6px;margin-bottom:6px;align-items:center}
.r-item .row label{font-size:.72rem;color:var(--sub);width:64px;flex-shrink:0;text-align:right}
.r-item .row input{flex:1;border:1px solid var(--bdr);border-radius:6px;padding:7px 10px;font-size:.8rem;font-family:'SF Mono','JetBrains Mono',Consolas,monospace;background:#fff}
.r-item .row .cpy{padding:7px 14px;background:var(--ac);color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:.78rem;font-weight:600;white-space:nowrap;transition:all .15s}
.r-item .row .cpy:active{transform:scale(.95)}.r-item .row .cpy.ok{background:#34d399}
.r-item .meta{font-size:.75rem;color:var(--sub);margin-top:4px}

/* 最近上传 */
.grid{display:flex;flex-wrap:wrap;gap:10px}
.thumb{width:80px;height:80px;border-radius:8px;overflow:hidden;border:1px solid var(--bdr);cursor:pointer;transition:all .2s;background:var(--light)}
.thumb:hover{border-color:var(--ac);box-shadow:0 2px 8px rgba(16,185,129,.15)}
.thumb img{width:100%;height:100%;object-fit:cover}
.empty{text-align:center;padding:32px;color:var(--sub);font-size:.85rem}

/* Lightbox */
.lb{position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:999;display:none;justify-content:center;align-items:center;cursor:pointer;backdrop-filter:blur(4px)}
.lb.show{display:flex}
.lb img{max-width:92vw;max-height:92vh;border-radius:8px}

/* 捐助 */
.donate{padding:24px 20px;text-align:center}
.donate h3{font-size:1rem;color:var(--text);margin-bottom:4px}
.donate p{font-size:.82rem;color:var(--sub);margin-bottom:16px}
.qr-row{display:flex;justify-content:center;gap:28px}
.qr-box{text-align:center}
.qr-box img{width:128px;height:128px;border-radius:8px;border:1px solid var(--bdr)}
.qr-box .ql{font-size:.78rem;color:var(--sub);margin-top:6px}

/* Footer */
footer{text-align:center;padding:24px;color:var(--sub);font-size:.78rem;border-top:1px solid var(--bdr)}
footer a{color:var(--sub)}footer a:hover{color:var(--ac)}

@media(max-width:640px){
  .navbar{padding:0 12px}.navbar .nav{gap:14px;font-size:.8rem}
  .hero h1{font-size:1.5rem}.main{padding:12px 12px 40px}
  .opts{gap:12px;padding:12px}.url-row{flex-direction:column}
}
</style>
</head>
<body>
<nav class="navbar">
  <div class="logo">ao 图床</div>
  <div class="nav">
    <a href="/" class="on">上传</a>
    <a href="/api">API文档</a>
    <a href="https://blog.aoterniu.online" target="_blank">博客</a>
    <a href="#donate">捐助</a>
  </div>
</nav>

<div class="hero">
  <h1>简单、快速、免费的图床</h1>
  <p class="tagline">拖拽上传 · <span>·</span> 格式转换 · <span>·</span> 开放 API</p>
  <p class="warn">单文件 ≤ 100MB · Cloudflare R2 全球加速</p>
</div>

<div class="main">
  <div class="card">
    <div class="card-bd">
      <div class="drop" id="drop" onclick="fi.click()">
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><path d="M24 32V16m0 0l-8 8m8-8l8 8" stroke-linecap="round" stroke-linejoin="round"/><rect x="6" y="6" width="36" height="36" rx="6" stroke-dasharray="4 3"/></svg>
        <div class="t1">点击选择文件、拖拽到这里或直接粘贴</div>
        <div class="t2">支持 JPG / PNG / GIF / WebP · Ctrl+V 粘贴上传</div>
      </div>
      <input type="file" id="fi" accept="image/*" multiple>

      <div class="url-row">
        <input type="text" id="urlIn" placeholder="粘贴图片 URL" onkeydown="if(event.key==='Enter')urlUpload()">
        <button class="btn" onclick="urlUpload()">URL 上传</button>
      </div>

      <div class="opts">
        <div class="opt"><label>输出格式:</label><select id="fmt"><option value="original">自动</option><option value="webp">WebP</option><option value="png">PNG</option><option value="jpg">JPG</option></select></div>
        <div class="opt"><label>质量:</label><select id="qlt"><option value="100">无损</option><option value="90" selected>90%</option><option value="80">80%</option><option value="70">70%</option></select></div>
      </div>

      <div class="bar" id="bar"><div class="fill" id="fill"></div></div>
      <div class="status" id="status"></div>
      <div class="results" id="results"></div>
    </div>
  </div>

  <div class="card" id="recentCard" style="display:none">
    <div class="card-hd">📁 最近上传</div>
    <div class="card-bd">
      <div class="grid" id="thumbs"></div>
    </div>
  </div>

  <div class="card" id="donate">
    <div class="card-hd">☕ 支持作者</div>
    <div class="card-bd donate">
      <h3>如果 ao 图床对你有帮助，请作者喝杯咖啡</h3>
      <p>你的支持是持续维护的动力</p>
      <div class="qr-row">
        <div class="qr-box"><img src="${WECHAT_QR}" alt="微信" loading="lazy"><div class="ql">微信赞赏</div></div>
        <div class="qr-box"><img src="${ALIPAY_QR}" alt="支付宝" loading="lazy"><div class="ql">支付宝赞赏</div></div>
      </div>
    </div>
  </div>
</div>

<footer>
  ao 图床 · img.aoterniu.online · Cloudflare R2 · &copy; 2026 &nbsp;
  <a href="https://blog.aoterniu.online">技术笔记</a> · <a href="/api">API</a>
</footer>

<div class="lb" id="lb" onclick="this.classList.remove('show')"><img id="lbImg"></div>

<script>
const $=s=>document.querySelector(s);const drop=$('#drop'),fi=$('#fi'),bar=$('#bar'),fill=$('#fill'),status=$('#status'),results=$('#results');

drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('active')});
drop.addEventListener('dragleave',()=>drop.classList.remove('active'));
drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('active');doUpload(e.dataTransfer.files)});
fi.addEventListener('change',e=>doUpload(e.target.files));
document.addEventListener('paste',e=>{const it=e.clipboardData?.items;if(!it)return;const fs=[];for(const i of it)if(i.type.startsWith('image/'))fs.push(i.getAsFile());if(fs.length)doUpload(fs)});

async function urlUpload(){
  const url=$('#urlIn').value.trim();if(!url)return;
  bar.style.display='block';status.style.display='block';status.innerHTML='<span class="spin"></span>正在下载图片...';
  fill.style.width='20%';results.style.display='block';results.innerHTML='';
  try{
    const r=await fetch('/upload',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url,format:$('#fmt').value,quality:$('#qlt').value})});
    const d=await r.json();fill.style.width='100%';
    if(d.url){results.innerHTML=card(d);status.textContent='上传完成';$('#urlIn').value=''}
    else{results.innerHTML='<div style="color:#dc2626;padding:12px;font-size:.88rem">'+d.error+'</div>';status.textContent='失败'}
  }catch(e){results.innerHTML='<div style="color:#dc2626;padding:12px">网络错误</div>'}
  setTimeout(()=>{bar.style.display='none';status.style.display='none'},2500);loadRecent()
}

async function doUpload(files){
  if(!files.length)return;
  bar.style.display='block';status.style.display='block';results.style.display='block';results.innerHTML='';
  let d=0,t=files.length;
  for(const f of files){
    if(!f.type.startsWith('image/')){d++;continue}
    status.innerHTML='<span class="spin"></span>正在上传 ('+d+'/'+t+')...';
    fill.style.width=(d/t*100)+'%';
    const fd=new FormData();fd.append('file',f);fd.append('format',$('#fmt').value);fd.append('quality',$('#qlt').value);
    try{const r=await fetch('/upload',{method:'POST',body:fd});const j=await r.json();
      if(j.url)results.innerHTML+=card(j);else results.innerHTML+='<div style="color:#dc2626;padding:8px">'+j.error+'</div>'
    }catch(e){results.innerHTML+='<div style="color:#dc2626;padding:8px">网络错误</div>'}
    d++;
  }
  fill.style.width='100%';status.textContent='上传完成 ('+d+' 张)';
  setTimeout(()=>{bar.style.display='none';status.style.display='none'},2500);loadRecent()
}

function card(d){
  const sz=d.size<1024?d.size+'B':d.size<1048576?(d.size/1024).toFixed(1)+'KB':(d.size/1048576).toFixed(1)+'MB';
  const md='![]('+d.url+')',html='<img src="'+d.url+'" alt="'+d.key+'">',bb='[IMG]'+d.url+'[/IMG]';
  return '<div class="r-item"><img class="preview" src="'+d.url+'" onclick="showLB(this.src)">'+
    '<div class="row"><label>直链</label><input value="'+d.url+'" readonly><button class="cpy" onclick="cp(this)">复制</button></div>'+
    '<div class="row"><label>Markdown</label><input value="'+md+'" readonly><button class="cpy" onclick="cp(this)">复制</button></div>'+
    '<div class="row"><label>HTML</label><input value="'+html+'" readonly><button class="cpy" onclick="cp(this)">复制</button></div>'+
    '<div class="row"><label>BBCode</label><input value="'+bb+'" readonly><button class="cpy" onclick="cp(this)">复制</button></div>'+
    '<div class="meta">'+d.originalName+' · '+sz+' · '+d.key+'</div></div>';
}
function cp(b){const i=b.previousElementSibling;navigator.clipboard.writeText(i.value);b.textContent='已复制';b.classList.add('ok');setTimeout(()=>{b.textContent='复制';b.classList.remove('ok')},1500)}
function showLB(s){$('#lbImg').src=s;$('#lb').classList.add('show')}
async function loadRecent(){try{const r=await fetch('/list');const d=await r.json();if(d.files?.length){$('#recentCard').style.display='';$('#thumbs').innerHTML=d.files.slice(0,20).map(f=>'<div class="thumb" onclick="showLB(\\''+f.url+'\\')" title="'+f.key+'"><img src="'+f.url+'" loading="lazy"></div>').join('')}}catch(e){}}
loadRecent();
</script>
</body>
</html>`;

function cors(o){return{'Access-Control-Allow-Origin':o||'*','Access-Control-Allow-Methods':'GET,POST,DELETE,OPTIONS','Access-Control-Allow-Headers':'Content-Type'}}
function randKey(e){const c='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';let id='';for(let i=0;i<8;i++)id+=c[Math.floor(Math.random()*c.length)];return id+e}

async function updateStats(env,size){try{const t=parseInt(await env.STATS.get('total')||'0')+1;const day=new Date().toISOString().slice(0,10);const dk='day_'+day;const tc=parseInt(await env.STATS.get(dk)||'0')+1;const ts=parseInt(await env.STATS.get('totalSize')||'0')+size;await Promise.all([env.STATS.put('total',String(t)),env.STATS.put(dk,String(tc)),env.STATS.put('totalSize',String(ts))])}catch(e){}}

export default{
  async fetch(request,env){
    const url=new URL(request.url);const o=request.headers.get('Origin')||'*';
    if(request.method==='OPTIONS')return new Response(null,{headers:cors(o)});

    if(url.pathname==='/'&&request.method==='GET')
      return new Response(PAGE,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache',...cors(o)}});

    if(url.pathname==='/api'&&request.method==='GET')
      return new Response(API_PAGE,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache',...cors(o)}});

    if(url.pathname==='/upload'&&request.method==='POST'){
      try{
        let file,origName='';const ct=request.headers.get('Content-Type')||'';
        let format='original',quality='100';
        if(ct.includes('application/json')){
          const b=await request.json();if(!b.url)return Response.json({error:'请提供 URL'},{status:400,headers:cors(o)});
          format=b.format||'original';quality=b.quality||'100';
          const resp=await fetch(b.url,{headers:{'User-Agent':'ao-img/3.0'},redirect:'follow'});
          if(!resp.ok)return Response.json({error:'下载失败: '+resp.status},{status:400,headers:cors(o)});
          const ic=resp.headers.get('Content-Type')||'';
          if(!ic.startsWith('image/'))return Response.json({error:'URL 不是图片'},{status:400,headers:cors(o)});
          origName=b.url.split('/').pop().split('?')[0]||'image';
          const ext=origName.includes('.')?'.'+origName.split('.').pop().split('?')[0]:'.png';
          file={stream:()=>resp.body,type:ic,size:parseInt(resp.headers.get('Content-Length')||'0'),ext};
        }else{
          const fd=await request.formData();const f=fd.get('file');
          format=fd.get('format')||'original';quality=fd.get('quality')||'100';
          if(!f||!f.type.startsWith('image/'))return Response.json({error:'请上传图片'},{status:400,headers:cors(o)});
          if(f.size>104857600)return Response.json({error:'超过 100MB'},{status:413,headers:cors(o)});
          origName=f.name||'';const ext=origName?'.'+origName.split('.').pop():'.png';
          file={stream:()=>f.stream(),type:f.type,size:f.size,ext};
        }
        let ext=file.ext||'.png',ct2=file.type;
        if(format==='webp'){ext='.webp';ct2='image/webp'}else if(format==='png'){ext='.png';ct2='image/png'}else if(format==='jpg'){ext='.jpg';ct2='image/jpeg'}
        const key=randKey(ext);
        await env.IMG.put(key,file.stream(),{httpMetadata:{contentType:ct2,cacheControl:'public, max-age=31536000, immutable'},customMetadata:{originalName:origName,uploadedAt:new Date().toISOString()}});
        await updateStats(env,file.size||0);
        return Response.json({url:`${url.origin}/i/${key}`,key,size:file.size,originalName:origName},{headers:cors(o)});
      }catch(e){return Response.json({error:e.message},{status:500,headers:cors(o)})}
    }

    if(url.pathname.startsWith('/i/')&&request.method==='GET'){
      const key=url.pathname.slice(3);const obj=await env.IMG.get(key);
      if(!obj)return new Response('Not Found',{status:404});
      const h=new Headers();
      h.set('Content-Type',obj.httpMetadata?.contentType||'image/png');
      h.set('Cache-Control','public, max-age=31536000, immutable');
      h.set('Access-Control-Allow-Origin','*');h.set('ETag',obj.etag);
      if(url.searchParams.has('dl'))h.set('Content-Disposition','attachment; filename="'+key+'"');
      const inm=request.headers.get('If-None-Match');
      if(inm&&inm===obj.etag)return new Response(null,{status:304,headers:h});
      return new Response(obj.body,{headers:h});
    }

    if(url.pathname.startsWith('/i/')&&request.method==='DELETE'){
      await env.IMG.delete(url.pathname.slice(3));return Response.json({success:true},{headers:cors(o)});
    }

    if(url.pathname==='/list'&&request.method==='GET'){
      const l=await env.IMG.list({limit:20});
      return Response.json({files:l.objects.map(o=>({key:o.key,url:`${url.origin}/i/${o.key}`,size:o.size,uploaded:o.customMetadata?.uploadedAt||o.uploaded}))},{headers:cors(o)});
    }

    if(url.pathname==='/stats'&&request.method==='GET'){
      const t=parseInt(await env.STATS.get('total')||'0');const day=new Date().toISOString().slice(0,10);const tc=parseInt(await env.STATS.get('day_'+day)||'0');const ts=parseInt(await env.STATS.get('totalSize')||'0');
      return Response.json({total:t,today:tc,totalSize:ts,sizeStr:ts<1024?ts+'B':ts<1048576?(ts/1024).toFixed(1)+'KB':ts<1073741824?(ts/1048576).toFixed(1)+'MB':(ts/1073741824).toFixed(1)+'GB'},{headers:cors(o)});
    }

    return new Response('Not Found',{status:404,headers:cors(o)});
  }
};

const API_PAGE=`<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ao 图床 API 文档</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif;background:#f5f7fa;color:#333}
a{color:#10b981;text-decoration:none}a:hover{text-decoration:underline}
a{color:var(--ac)}
:root{--ac:#10b981;--bdr:#e5e7eb;--card:#fff}
.navbar{background:#fff;border-bottom:1px solid var(--bdr);height:56px;display:flex;align-items:center;padding:0 24px;position:sticky;top:0;z-index:100}
.navbar .logo{font-size:1.1rem;font-weight:700;color:var(--ac)}.navbar .nav{margin-left:auto;display:flex;gap:24px;font-size:.88rem}
.navbar .nav a{color:#6b7280;font-weight:500;padding:4px 0;border-bottom:2px solid transparent}.navbar .nav a:hover,.navbar .nav a.on{color:var(--ac);border-bottom-color:var(--ac)}
.wrap{max-width:720px;margin:0 auto;padding:32px 20px 60px}
h1{font-size:1.8rem;text-align:center;margin-bottom:8px}
.sub{text-align:center;color:#6b7280;margin-bottom:28px;font-size:.9rem}
h2{font-size:1.05rem;font-weight:600;margin:24px 0 10px;padding:10px 14px;background:#ecfdf5;border-radius:8px;border-left:3px solid var(--ac)}
p,.desc{margin:8px 0;font-size:.88rem;line-height:1.7;color:#4b5563}
pre{background:#0f172a;color:#e2e8f0;border-radius:8px;padding:14px;overflow-x:auto;margin:10px 0 16px;font-size:.82rem;font-family:'SF Mono','JetBrains Mono',Consolas,monospace;line-height:1.5}
pre code{color:#4ade80}
.badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:.72rem;font-weight:700;margin-right:6px;color:#fff;vertical-align:middle}
.post{background:#10b981}.get{background:#3b82f6}.del{background:#ef4444}
hr{border:none;border-top:1px solid var(--bdr);margin:20px 0}
.back{display:inline-block;margin-bottom:16px;color:#6b7280;font-size:.85rem}.back:hover{color:var(--ac)}
</style></head><body>
<nav class="navbar"><div class="logo">ao 图床</div><div class="nav"><a href="/">上传</a><a href="/api" class="on">API文档</a><a href="https://blog.aoterniu.online" target="_blank">博客</a></div></nav>
<div class="wrap">
<a class="back" href="/">← 返回图床</a>
<h1>公共 API 文档</h1>
<p class="sub">无需认证 · RESTful · 响应 JSON</p>

<h2>API 端点</h2>
<p>基础 URL: <code>https://img.aoterniu.online</code></p>
<hr>
<p><span class="badge post">POST</span> <strong>上传图片（文件）</strong></p>
<p>请求体 <code>multipart/form-data</code>。字段 <code>file</code>（图片文件），可选 <code>format</code>（original/webp/png/jpg）、<code>quality</code>（100/90/80/70）。</p>
<pre><code>curl -X POST https://img.aoterniu.online/upload \\
  -F "file=@image.png" \\
  -F "format=webp" \\
  -F "quality=90"</code></pre>

<p><span class="badge post">POST</span> <strong>URL 上传</strong></p>
<p>请求体 <code>application/json</code>，字段 <code>url</code>（图片远程地址），可选 <code>format</code>、<code>quality</code>。</p>
<pre><code>curl -X POST https://img.aoterniu.online/upload \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://example.com/photo.jpg","format":"webp"}'</code></pre>

<p><strong>响应示例：</strong></p>
<pre><code>{
  "url": "https://img.aoterniu.online/i/aBcDeFgH.webp",
  "key": "aBcDeFgH.webp",
  "size": 45678,
  "originalName": "image.png"
}</code></pre>

<hr>
<p><span class="badge get">GET</span> <strong>访问图片</strong></p>
<pre><code>https://img.aoterniu.online/i/{key}        # 直链
https://img.aoterniu.online/i/{key}?dl=1   # 强制下载</code></pre>

<p><span class="badge get">GET</span> <strong>/list</strong> — 最近上传（20 条）</p>
<p><span class="badge get">GET</span> <strong>/stats</strong> — 统计数据</p>
<p><span class="badge del">DELETE</span> <strong>/i/{key}</strong> — 删除图片</p>

<h2>JavaScript 示例</h2>
<pre><code>const fd = new FormData();
fd.append('file', fileInput.files[0]);
fd.append('format', 'webp');
const res = await fetch('https://img.aoterniu.online/upload', { method: 'POST', body: fd });
const { url } = await res.json();
// url 就是图片直链</code></pre>

<h2>Python 示例</h2>
<pre><code>import requests
r = requests.post('https://img.aoterniu.online/upload',
    files={'file': open('image.png', 'rb')},
    data={'format': 'webp', 'quality': '90'})
print(r.json()['url'])</code></pre>

<h2>PicGo 配置</h2>
<pre><code>{
  "picBed": {
    "uploader": "custom",
    "customUpload": {
      "url": "https://img.aoterniu.online/upload",
      "file": "file",
      "apiKey": ""
    }
  }
}</code></pre>

<h2>Typora 配置</h2>
<pre><code>Image Upload → Custom Command:
curl -s -X POST -F "file=@$2" -F "format=webp" https://img.aoterniu.online/upload</code></pre>
</div></body></html>`;
