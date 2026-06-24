/**
 * ao 图床 v4 — R2 + KV + 多功能
 */
const WECHAT_QR='https://img.aoterniu.online/i/58JTFpGE.webp';
const ALIPAY_QR='https://img.aoterniu.online/i/EZeXSESc.webp';

const PAGE=`<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#10b981">
<title>ao 图床 - 简单、快速、免费的图床</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif;background:#f5f7fa;color:#333;min-height:100vh;display:flex;flex-direction:column}
:root{--ac:#10b981;--ac2:#059669;--bg:#f5f7fa;--card:#fff;--bdr:#e5e7eb;--text:#1f2937;--sub:#6b7280;--light:#f9fafb;--r:12px}
a{color:var(--ac);text-decoration:none}
.navbar{background:#fff;border-bottom:1px solid var(--bdr);position:sticky;top:0;z-index:100;height:56px;display:flex;align-items:center;padding:0 24px}
.navbar .logo{font-size:1.1rem;font-weight:700;color:var(--ac)}
.navbar .nav{margin-left:auto;display:flex;gap:20px;font-size:.88rem}
.navbar .nav a{color:var(--sub);font-weight:500;padding:4px 0;border-bottom:2px solid transparent;transition:all .2s}
.navbar .nav a:hover,.navbar .nav a.on{color:var(--ac);border-bottom-color:var(--ac)}
.hero{background:linear-gradient(180deg,#ecfdf5 0%,var(--bg) 100%);padding:48px 20px 0;text-align:center}
.hero h1{font-size:2rem;font-weight:700;color:var(--text)}
.hero .tagline{margin-top:10px;font-size:1rem;color:var(--sub)}
.hero .warn{margin-top:8px;font-size:.78rem;color:#9ca3af}
.main{max-width:760px;margin:0 auto;padding:20px 20px 60px;width:100%;flex:1}
.card{background:var(--card);border:1px solid var(--bdr);border-radius:var(--r);box-shadow:0 1px 3px rgba(0,0,0,.04);margin-bottom:20px;overflow:hidden}
.card-hd{padding:14px 20px;border-bottom:1px solid var(--bdr);font-weight:600;font-size:.92rem;display:flex;align-items:center;gap:8px}
.card-hd .acts{margin-left:auto;display:flex;gap:12px;font-size:.78rem}
.card-hd .acts a{color:var(--sub)}.card-hd .acts a:hover{color:var(--ac)}
.card-bd{padding:20px}
.drop{border:2px dashed #d1d5db;border-radius:10px;padding:44px 20px;text-align:center;cursor:pointer;transition:all .25s;background:var(--light)}
.drop:hover{border-color:var(--ac);background:#ecfdf5}
.drop.active{border-color:var(--ac);background:#d1fae5;transform:scale(1.003)}
.drop svg{width:44px;height:44px;color:var(--ac)}
.drop .t1{margin-top:12px;font-size:.95rem;color:var(--text)}
.drop .t2{margin-top:4px;font-size:.8rem;color:var(--sub)}
.url-row{display:flex;gap:8px;margin-top:14px}
.url-row input{flex:1;border:1px solid var(--bdr);border-radius:8px;padding:10px 14px;font-size:.9rem;outline:none;transition:border .2s}
.url-row input:focus{border-color:var(--ac)}
.url-row input::placeholder{color:#9ca3af}
.btn{padding:10px 18px;background:var(--ac);color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:.85rem;white-space:nowrap;transition:all .15s}
.btn:hover{background:var(--ac2)}.btn:active{transform:scale(.97)}
.btn-ghost{background:transparent;border:1px solid var(--bdr);color:var(--sub)}.btn-ghost:hover{border-color:var(--ac);color:var(--ac);background:#ecfdf5}
.opts{display:flex;gap:16px;margin-top:14px;padding:14px 18px;background:var(--light);border-radius:8px;border:1px solid var(--bdr);flex-wrap:wrap;align-items:center}
.opts .opt{display:flex;align-items:center;gap:6px;font-size:.83rem;color:var(--sub)}
.opts select{border:1px solid var(--bdr);border-radius:6px;padding:5px 8px;font-size:.8rem;color:var(--text);background:#fff}
.opts .chk{display:flex;align-items:center;gap:5px;font-size:.83rem;color:var(--sub);cursor:pointer;user-select:none}
.opts .chk input{accent-color:var(--ac);cursor:pointer}
.pwd-input{display:none;margin-top:10px}
.pwd-input input{width:100%;border:1px solid var(--bdr);border-radius:8px;padding:8px 14px;font-size:.88rem;outline:none}
.pwd-input input:focus{border-color:var(--ac)}
.bar{height:3px;background:var(--bdr);border-radius:2px;margin-top:14px;overflow:hidden;display:none}
.bar .fill{height:100%;background:linear-gradient(90deg,var(--ac),#06b6d4);width:0;transition:width .15s}
.status{text-align:center;margin-top:8px;font-size:.82rem;color:var(--sub);display:none}
.spin{display:inline-block;width:12px;height:12px;border:2px solid #d1d5db;border-top-color:var(--ac);border-radius:50%;animation:spin .7s linear infinite;vertical-align:middle;margin-right:5px}
@keyframes spin{to{transform:rotate(360deg)}}
.results{display:none;margin-top:14px}
.r-item{background:var(--light);border:1px solid var(--bdr);border-radius:var(--r);padding:14px;margin-bottom:10px}
.r-item .row{display:flex;gap:5px;margin-bottom:5px;align-items:center}
.r-item .row label{font-size:.72rem;color:var(--sub);width:60px;flex-shrink:0;text-align:right}
.r-item .row input{flex:1;border:1px solid var(--bdr);border-radius:5px;padding:6px 8px;font-size:.78rem;font-family:'SF Mono','JetBrains Mono',monospace;background:#fff}
.r-item .row .cpy{padding:6px 12px;background:var(--ac);color:#fff;border:none;border-radius:5px;cursor:pointer;font-size:.74rem;font-weight:600;white-space:nowrap;transition:all .12s}
.r-item .row .cpy:active{transform:scale(.95)}.r-item .row .cpy.ok{background:#34d399}
.r-item .meta{font-size:.72rem;color:var(--sub);margin-top:3px;display:flex;gap:12px;flex-wrap:wrap}

/* 最近上传 */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:10px}
.thumb{border-radius:8px;overflow:hidden;border:1px solid var(--bdr);cursor:pointer;position:relative;aspect-ratio:1;background:var(--light);transition:all .2s}
.thumb:hover{border-color:var(--ac);box-shadow:0 2px 8px rgba(16,185,129,.15)}
.thumb img{width:100%;height:100%;object-fit:cover}
.thumb .overlay{position:absolute;inset:0;background:rgba(0,0,0,.5);display:flex;gap:4px;align-items:center;justify-content:center;opacity:0;transition:opacity .2s}
.thumb:hover .overlay{opacity:1}
.thumb .overlay button{padding:4px 8px;font-size:.7rem;border:none;border-radius:4px;cursor:pointer;font-weight:600}
.thumb .overlay .ov-copy{background:var(--ac);color:#fff}
.thumb .overlay .ov-del{background:#ef4444;color:#fff}
.thumb .overlay .ov-prev{background:#3b82f6;color:#fff}
.empty{text-align:center;padding:32px;color:var(--sub);font-size:.85rem}

/* Lightbox */
.lb{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:999;display:none;justify-content:center;align-items:center;cursor:pointer;backdrop-filter:blur(4px)}
.lb.show{display:flex}
.lb img{max-width:92vw;max-height:92vh;border-radius:8px}

/* 捐助 */
.donate{text-align:center;padding:20px}
.donate h3{font-size:1rem;color:var(--text);margin-bottom:4px}
.donate p{font-size:.82rem;color:var(--sub);margin-bottom:14px}
.qr-row{display:flex;justify-content:center;gap:28px}
.qr-box img{width:120px;height:120px;border-radius:8px;border:1px solid var(--bdr)}
.qr-box .ql{font-size:.78rem;color:var(--sub);margin-top:6px}

/* 统计 */
.stats{display:flex;justify-content:center;gap:36px;padding:0 20px;margin-top:14px}
.stats .item{text-align:center}.stats .item .num{font-size:1.1rem;font-weight:700;color:var(--ac)}.stats .item .lbl{font-size:.72rem;color:var(--sub);margin-top:2px}

/* 公告弹窗 */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:1000;display:none;justify-content:center;align-items:center;backdrop-filter:blur(2px)}
.modal-bg.show{display:flex}
.modal{background:#fff;border-radius:16px;max-width:420px;width:90%;padding:28px;box-shadow:0 20px 60px rgba(0,0,0,.2);position:relative}
.modal h2{font-size:1.15rem;margin-bottom:12px;display:flex;align-items:center;gap:8px}
.modal .close{position:absolute;top:14px;right:16px;background:none;border:none;font-size:1.2rem;cursor:pointer;color:var(--sub)}
.modal p{font-size:.88rem;color:var(--sub);line-height:1.6;margin-bottom:10px}
.modal .ok-btn{width:100%;padding:10px;background:var(--ac);color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer;margin-top:8px;font-size:.9rem}

footer{text-align:center;padding:24px;color:var(--sub);font-size:.78rem;border-top:1px solid var(--bdr)}
footer a{color:var(--sub)}footer a:hover{color:var(--ac)}
@media(max-width:640px){.navbar{padding:0 12px}.navbar .nav{gap:12px;font-size:.8rem}.hero h1{font-size:1.5rem}.main{padding:12px 12px 40px}.opts{gap:10px;padding:10px}.url-row{flex-direction:column}.stats{gap:20px}}
</style>
</head>
<body>
<nav class="navbar">
  <div class="logo">ao 图床</div>
  <div class="nav">
    <a href="/" class="on">上传</a>
    <a href="/api">API文档</a>
    <a href="/manage">管理</a>
    <a href="https://blog.aoterniu.online" target="_blank">博客</a>
  </div>
</nav>

<div class="hero">
  <h1>简单、快速、免费的图床</h1>
  <p class="tagline">拖拽上传 · 加密保护 · 开放 API</p>
  <p class="warn">Cloudflare R2 全球加速 · 单文件 ≤ 100MB</p>
</div>

<div class="stats">
  <div class="item"><div class="num" id="sTotal">-</div><div class="lbl">总上传</div></div>
  <div class="item"><div class="num" id="sToday">-</div><div class="lbl">今日</div></div>
  <div class="item"><div class="num" id="sSize">-</div><div class="lbl">存储量</div></div>
</div>

<div class="main">
  <div class="card">
    <div class="card-bd">
      <div class="drop" id="drop" onclick="fi.click()">
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><path d="M24 32V16m0 0l-8 8m8-8l8 8" stroke-linecap="round" stroke-linejoin="round"/><rect x="6" y="6" width="36" height="36" rx="6" stroke-dasharray="4 3"/></svg>
        <div class="t1">点击选择文件、拖拽到这里或直接粘贴（支持图片、ZIP批量）</div>
      </div>
      <input type="file" id="fi" accept="image/*,.zip" multiple>

      <div class="url-row">
        <input type="text" id="urlIn" placeholder="粘贴图片 URL" onkeydown="if(event.key==='Enter')urlUpload()">
        <button class="btn" onclick="urlUpload()">URL 上传</button>
        <button class="btn btn-ghost" onclick="fi.click()">批量上传</button>
      </div>

      <div class="opts">
        <div class="opt"><label>输出格式:</label><select id="fmt"><option value="original">自动（推荐）</option><option value="webp">WebP</option><option value="png">PNG</option><option value="jpg">JPG</option></select></div>
        <div class="opt"><label>质量:</label><select id="qlt"><option value="100">无损</option><option value="90" selected>90%</option><option value="80">80%</option><option value="70">70%</option></select></div>
        <label class="chk"><input type="checkbox" id="pwdChk" onchange="$('#pwdIn').style.display=this.checked?'':'none'"> 需要密码访问</label>
      </div>
      <div class="pwd-input" id="pwdIn"><input type="password" id="pwdVal" placeholder="设置访问密码（可选）"></div>

      <div class="bar" id="bar"><div class="fill" id="fill"></div></div>
      <div class="status" id="status"></div>
      <div class="results" id="results"></div>
    </div>
  </div>

  <div class="card" id="recentCard" style="display:none">
    <div class="card-hd">📁 最近上传<div class="acts"><a href="/manage">查看全部</a></div></div>
    <div class="card-bd"><div class="grid" id="thumbs"></div></div>
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

<footer>ao 图床 · img.aoterniu.online · Cloudflare R2 · © 2026 · <a href="https://blog.aoterniu.online">技术笔记</a> · <a href="/api">API</a></footer>
<div class="lb" id="lb" onclick="this.classList.remove('show')"><img id="lbImg"></div>

<div class="modal-bg" id="modal">
  <div class="modal">
    <button class="close" onclick="closeModal()">&times;</button>
    <h2>📢 更新公告</h2>
    <p><strong>ao 图床 v4.0</strong> 已上线！</p>
    <p>✅ ZIP 批量上传<br>✅ 密码保护访问<br>✅ 图片管理页面<br>✅ URL 远程上传<br>✅ 格式转换（WebP/PNG/JPG）<br>✅ PWA 支持（可安装到桌面）</p>
    <p style="font-size:.78rem;color:#9ca3af">首次访问弹出此公告，之后不再显示</p>
    <button class="ok-btn" onclick="closeModal()">我知道了</button>
  </div>
</div>

<script>
const $=s=>document.querySelector(s);
const drop=$('#drop'),fi=$('#fi'),bar=$('#bar'),fill=$('#fill'),status=$('#status'),results=$('#results');

// 公告
if(!localStorage.getItem('ao_announced')){$('#modal').classList.add('show')}
function closeModal(){$('#modal').classList.remove('show');localStorage.setItem('ao_announced','1')}

// 拖拽
drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('active')});
drop.addEventListener('dragleave',()=>drop.classList.remove('active'));
drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('active');doUpload(e.dataTransfer.files)});
fi.addEventListener('change',e=>doUpload(e.target.files));
document.addEventListener('paste',e=>{const it=e.clipboardData?.items;if(!it)return;const fs=[];for(const i of it)if(i.type.startsWith('image/'))fs.push(i.getAsFile());if(fs.length)doUpload(fs)});

// URL 上传
async function urlUpload(){
  const url=$('#urlIn').value.trim();if(!url)return;
  bar.style.display='block';status.style.display='block';status.innerHTML='<span class="spin"></span>正在下载...';
  fill.style.width='20%';results.style.display='block';results.innerHTML='';
  const pwd=$('#pwdChk').checked?$('#pwdVal').value:'';
  try{
    const r=await fetch('/upload',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url,format:$('#fmt').value,quality:$('#qlt').value,password:pwd})});
    const d=await r.json();fill.style.width='100%';
    if(d.url){results.innerHTML+=card(d);status.textContent='上传完成';$('#urlIn').value=''}
    else{results.innerHTML+='<div style="color:#dc2626;padding:12px">'+d.error+'</div>';status.textContent='失败'}
  }catch(e){results.innerHTML+='<div style="color:#dc2626;padding:12px">网络错误</div>'}
  setTimeout(()=>{bar.style.display='none';status.style.display='none'},2500);loadRecent();loadStats()
}

// 文件/ZIP 上传
async function doUpload(files){
  if(!files.length)return;
  // ZIP 处理
  for(const f of files){
    if(f.name&&f.name.endsWith('.zip')){
      status.innerHTML='<span class="spin"></span>正在解压 ZIP...';
      bar.style.display='block';status.style.display='block';results.style.display='block';results.innerHTML='';
      try{
        const ab=await f.arrayBuffer();
        const imgs=await extractZip(ab);
        if(imgs.length===0){results.innerHTML='<div style="color:#dc2626">ZIP 中没有图片</div>';status.textContent='空 ZIP';return}
        let d=0;
        for(const img of imgs){
          status.innerHTML='<span class="spin"></span>上传 ('+d+'/'+imgs.length+'): '+img.name;
          fill.style.width=(d/imgs.length*100)+'%';
          const fd=new FormData();fd.append('file',img.blob,img.name);fd.append('format',$('#fmt').value);fd.append('quality',$('#qlt').value);
          try{const r=await fetch('/upload',{method:'POST',body:fd});const j=await r.json();if(j.url)results.innerHTML+=card(j)}catch(e){}
          d++
        }
        fill.style.width='100%';status.textContent='完成 ('+imgs.length+' 张)';
      }catch(e){results.innerHTML+='<div style="color:#dc2626">ZIP 解压失败</div>'}
      setTimeout(()=>{bar.style.display='none';status.style.display='none'},2500);loadRecent();loadStats();return
    }
  }
  // 普通图片批量上传
  bar.style.display='block';status.style.display='block';results.style.display='block';results.innerHTML='';
  let d=0,t=files.length;const pwd=$('#pwdChk').checked?$('#pwdVal').value:'';
  for(const f of files){
    if(!f.type.startsWith('image/')&&!(f.name&&f.name.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i))){d++;continue}
    status.innerHTML='<span class="spin"></span>上传 ('+d+'/'+t+')...';fill.style.width=(d/t*100)+'%';
    const fd=new FormData();fd.append('file',f);fd.append('format',$('#fmt').value);fd.append('quality',$('#qlt').value);if(pwd)fd.append('password',pwd);
    try{const r=await fetch('/upload',{method:'POST',body:fd});const j=await r.json();if(j.url)results.innerHTML+=card(j);else results.innerHTML+='<div style="color:#dc2626;padding:8px">'+j.error+'</div>'}catch(e){results.innerHTML+='<div style="color:#dc2626;padding:8px">网络错误</div>'}
    d++
  }
  fill.style.width='100%';status.textContent='完成 ('+d+' 张)';
  setTimeout(()=>{bar.style.display='none';status.style.display='none'},2500);loadRecent();loadStats()
}

// ZIP 解压
async function extractZip(ab){
  const imgs=[];
  try{
    const files=await JSZip.loadAsync(ab);
    for(const [name,file] of Object.entries(files)){
      if(file.dir)continue;
      if(!name.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i))continue;
      const blob=await file.async('blob');
      imgs.push({name,blob});
    }
  }catch(e){console.error('ZIP error',e)}
  return imgs
}

function card(d){
  const sz=d.size<1024?d.size+'B':d.size<1048576?(d.size/1024).toFixed(1)+'KB':(d.size/1048576).toFixed(1)+'MB';
  const fmt=(d.originalName||'').split('.').pop().toUpperCase()||'IMG';
  const md='![]('+d.url+')',ht='<img src="'+d.url+'" alt="'+d.key+'">',bb='[IMG]'+d.url+'[/IMG]';
  const pwdInfo=d.protected?'🔒 密码保护 · ':'';
  const savings=d.savings?' · 已节省 '+d.savings:'';
  return '<div class="r-item">'+
    '<div class="row"><label>直链</label><input value="'+d.url+'" readonly><button class="cpy" onclick="cp(this)">复制</button></div>'+
    '<div class="row"><label>Markdown</label><input value="'+md+'" readonly><button class="cpy" onclick="cp(this)">复制</button></div>'+
    '<div class="row"><label>HTML</label><input value="'+ht+'" readonly><button class="cpy" onclick="cp(this)">复制</button></div>'+
    '<div class="row"><label>BBCode</label><input value="'+bb+'" readonly><button class="cpy" onclick="cp(this)">复制</button></div>'+
    '<div class="meta"><span>'+pwdInfo+sz+'</span><span>'+fmt+'</span><span>'+d.key+'</span>'+savings+'</div></div>';
}
function cp(b){const i=b.previousElementSibling;navigator.clipboard.writeText(i.value);b.textContent='已复制';b.classList.add('ok');setTimeout(()=>{b.textContent='复制';b.classList.remove('ok')},1500)}
function showLB(s){$('#lbImg').src=s;$('#lb').classList.add('show')}

async function loadRecent(){try{const r=await fetch('/list');const d=await r.json();if(d.files?.length){$('#recentCard').style.display='';$('#thumbs').innerHTML=d.files.slice(0,20).map(f=>'<div class="thumb" title="'+f.key+'" ondblclick="showLB(this.querySelector(\\'img\\').src)"><img src="'+f.url+'" loading="lazy"><div class="overlay"><button class="ov-prev" onclick="event.stopPropagation();showLB(this.closest(\\'.thumb\\').querySelector(\\'img\\').src)">👁</button><button class="ov-copy" onclick="event.stopPropagation();navigator.clipboard.writeText(\\''+f.url+'\\');this.textContent=\\'✓\\';setTimeout(()=>this.textContent=\\'📋\\',800)">📋</button><button class="ov-del" onclick="event.stopPropagation();delImg(\\''+f.key+'\\',this.closest(\\'.thumb\\'))">✕</button></div></div>').join('')}}catch(e){}}

async function delImg(key,el){if(!confirm('确认删除 '+key+' ?'))return;try{await fetch('/i/'+key,{method:'DELETE'});el.style.opacity='0';setTimeout(()=>el.remove(),300)}catch(e){}}

async function loadStats(){try{const r=await fetch('/stats');const d=await r.json();$('#sTotal').textContent=d.total||0;$('#sToday').textContent=d.today||0;$('#sSize').textContent=d.sizeStr||'0B'}catch(e){}}

// JSZip CDN (for ZIP support)
const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';document.head.appendChild(script);

loadRecent();loadStats();
</script>
</body>
</html>`;

const MANAGE_PAGE=`<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ao 图床 - 图片管理</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif;background:#f5f7fa;color:#333}
:root{--ac:#10b981;--ac2:#059669;--card:#fff;--bdr:#e5e7eb;--sub:#6b7280;--light:#f9fafb;--r:12px}
a{color:var(--ac);text-decoration:none}
.navbar{background:#fff;border-bottom:1px solid var(--bdr);position:sticky;top:0;z-index:100;height:56px;display:flex;align-items:center;padding:0 24px}
.navbar .logo{font-size:1.1rem;font-weight:700;color:var(--ac)}
.navbar .nav{margin-left:auto;display:flex;gap:20px;font-size:.88rem}
.navbar .nav a{color:var(--sub);font-weight:500;padding:4px 0;border-bottom:2px solid transparent}.navbar .nav a:hover,.navbar .nav a.on{color:var(--ac);border-bottom-color:var(--ac)}
.main{max-width:960px;margin:0 auto;padding:24px 20px 60px}
h1{font-size:1.5rem;margin-bottom:16px}
.toolbar{display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap}
.toolbar input{flex:1;min-width:200px;border:1px solid var(--bdr);border-radius:8px;padding:10px 14px;font-size:.9rem;outline:none}.toolbar input:focus{border-color:var(--ac)}
.toolbar button{padding:10px 18px;background:var(--ac);color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:.88rem}
.info-bar{font-size:.82rem;color:var(--sub);margin-bottom:14px}
.mgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:10px}
.mgrid .item{border-radius:8px;overflow:hidden;border:1px solid var(--bdr);cursor:pointer;aspect-ratio:1;background:var(--light);position:relative;transition:all .2s}
.mgrid .item:hover{border-color:var(--ac)}
.mgrid .item img{width:100%;height:100%;object-fit:cover}
.mgrid .item .overlay{position:absolute;inset:0;background:rgba(0,0,0,.6);display:flex;gap:6px;align-items:center;justify-content:center;opacity:0;transition:opacity .2s}
.mgrid .item:hover .overlay{opacity:1}
.mgrid .item .overlay button{padding:6px 10px;font-size:.72rem;border:none;border-radius:4px;cursor:pointer;font-weight:600}
.mgrid .item .overlay .ov-copy{background:var(--ac);color:#fff}
.mgrid .item .overlay .ov-del{background:#ef4444;color:#fff}
.mgrid .item .overlay .ov-prev{background:#3b82f6;color:#fff}
.empty{text-align:center;padding:48px;color:var(--sub);font-size:.9rem}
.lb{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:999;display:none;justify-content:center;align-items:center;cursor:pointer;backdrop-filter:blur(4px)}
.lb.show{display:flex}
.lb img{max-width:92vw;max-height:92vh;border-radius:8px}
.pager{display:flex;justify-content:center;gap:8px;margin-top:20px}
.pager button{padding:6px 14px;border:1px solid var(--bdr);background:#fff;border-radius:6px;cursor:pointer;font-size:.85rem}
.pager button.on{background:var(--ac);color:#fff;border-color:var(--ac)}
.pager button:disabled{opacity:.4;cursor:default}
footer{text-align:center;padding:24px;color:var(--sub);font-size:.78rem;border-top:1px solid var(--bdr)}footer a{color:var(--sub)}
</style></head>
<body>
<nav class="navbar"><div class="logo">ao 图床</div><div class="nav"><a href="/">上传</a><a href="/api">API文档</a><a href="/manage" class="on">管理</a><a href="https://blog.aoterniu.online" target="_blank">博客</a></div></nav>
<div class="main">
<h1>图片管理</h1>
<div class="toolbar">
  <input type="text" id="search" placeholder="搜索文件名..." onkeydown="if(event.key==='Enter')doSearch()">
  <button onclick="doSearch()">搜索</button>
</div>
<div class="info-bar" id="info">加载中...</div>
<div class="mgrid" id="grid"></div>
<div class="pager" id="pager"></div>
</div>
<footer>ao 图床 · img.aoterniu.online · <a href="/">返回首页</a></footer>
<div class="lb" id="lb" onclick="this.classList.remove('show')"><img id="lbImg"></div>
<script>
let page=0,allFiles=[];
async function load(){try{const r=await fetch('/list?all=1');const d=await r.json();allFiles=d.files||[];render()}catch(e){}}
function render(){
  const q=$('#search').value.toLowerCase();
  const filtered=q?allFiles.filter(f=>f.key.toLowerCase().includes(q)):allFiles;
  const per=40,total=Math.ceil(filtered.length/per),pg=Math.min(page,total-1);
  if(pg<0)page=0;const start=page*per,slice=filtered.slice(start,start+per);
  $('#info').textContent='共 '+filtered.length+' 张'+(q?' (搜索: '+q+')':'');
  if(!slice.length){$('#grid').innerHTML='<div class="empty">暂无图片</div>';$('#pager').innerHTML='';return}
  $('#grid').innerHTML=slice.map(f=>'<div class="item" title="'+f.key+'"><img src="'+f.url+'" loading="lazy"><div class="overlay"><button class="ov-prev" onclick="event.stopPropagation();showLB(this.closest(\\'.item\\').querySelector(\\'img\\').src)">👁</button><button class="ov-copy" onclick="event.stopPropagation();navigator.clipboard.writeText(\\''+f.url+'\\');this.textContent=\\'✓\\';setTimeout(()=>this.textContent=\\'📋\\',800)">📋</button><button class="ov-del" onclick="event.stopPropagation();delI(\\''+f.key+'\\',this.closest(\\'.item\\'))">✕</button></div></div>').join('');
  if(total<=1){$('#pager').innerHTML='';return}
  let p='';p+='<button '+(page===0?'disabled':'')+' onclick="page=0;render()">首页</button>';
  p+='<button '+(page===0?'disabled':'')+' onclick="page--;render()">上一页</button>';
  p+='<button class="on">'+(pg+1)+'/'+total+'</button>';
  p+='<button '+(pg>=total-1?'disabled':'')+' onclick="page++;render()">下一页</button>';
  p+='<button '+(pg>=total-1?'disabled':'')+' onclick="page='+(total-1)+';render()">末页</button>';
  $('#pager').innerHTML=p;
}
function doSearch(){page=0;render()}
function showLB(s){$('#lbImg').src=s;$('#lb').classList.add('show')}
async function delI(k,el){if(!confirm('删除 '+k+' ?'))return;try{await fetch('/i/'+k,{method:'DELETE'});el.style.opacity='0';setTimeout(()=>{el.remove();allFiles=allFiles.filter(f=>f.key!==k);render()},300)}catch(e){}}
function $(s){return document.querySelector(s)}
load();
</script></body></html>`;

function cors(o){return{'Access-Control-Allow-Origin':o||'*','Access-Control-Allow-Methods':'GET,POST,DELETE,OPTIONS','Access-Control-Allow-Headers':'Content-Type'}}
function randKey(e){const c='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';let id='';for(let i=0;i<8;i++)id+=c[Math.floor(Math.random()*c.length)];return id+e}
async function updateStats(env,size){try{const t=parseInt(await env.STATS.get('total')||'0')+1;const day=new Date().toISOString().slice(0,10);const tc=parseInt(await env.STATS.get('day_'+day)||'0')+1;const ts=parseInt(await env.STATS.get('totalSize')||'0')+size;await Promise.all([env.STATS.put('total',String(t)),env.STATS.put('day_'+day,String(tc)),env.STATS.put('totalSize',String(ts))])}catch(e){}}

export default{
  async fetch(request,env){
    const url=new URL(request.url);const o=request.headers.get('Origin')||'*';
    if(request.method==='OPTIONS')return new Response(null,{headers:cors(o)});

    if(url.pathname==='/'&&request.method==='GET')return new Response(PAGE,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache',...cors(o)}});
    if(url.pathname==='/manage'&&request.method==='GET')return new Response(MANAGE_PAGE,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache',...cors(o)}});
    if(url.pathname==='/api'&&request.method==='GET')return new Response(API_PAGE,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache',...cors(o)}});

    // PWA
    if(url.pathname==='/manifest.json'&&request.method==='GET')return new Response(JSON.stringify({name:'ao 图床',short_name:'ao图床',start_url:'/',display:'standalone',background_color:'#f5f7fa',theme_color:'#10b981',icons:[{src:'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%2310b981"/><text x="50" y="65" font-size="40" text-anchor="middle" fill="white" font-family="sans-serif" font-weight="bold">ao</text></svg>',sizes:'192x192',type:'image/svg+xml'}]},{headers:{'Content-Type':'application/json'}}));

    if(url.pathname==='/upload'&&request.method==='POST'){
      try{
        let file,origName='';const ct=request.headers.get('Content-Type')||'';
        let format='original',quality='100',password='';
        if(ct.includes('application/json')){
          const b=await request.json();if(!b.url)return Response.json({error:'请提供 URL'},{status:400,headers:cors(o)});
          format=b.format||'original';quality=b.quality||'100';password=b.password||'';
          const resp=await fetch(b.url,{headers:{'User-Agent':'ao-img/4.0'},redirect:'follow'});
          if(!resp.ok)return Response.json({error:'下载失败: '+resp.status},{status:400,headers:cors(o)});
          const ic=resp.headers.get('Content-Type')||'';if(!ic.startsWith('image/'))return Response.json({error:'URL 不是图片'},{status:400,headers:cors(o)});
          const origSize=parseInt(resp.headers.get('Content-Length')||'0');
          origName=b.url.split('/').pop().split('?')[0]||'image';const ext=origName.includes('.')?'.'+origName.split('.').pop().split('?')[0]:'.png';
          file={stream:()=>resp.body,type:ic,size:origSize,ext,origSize};
        }else{
          const fd=await request.formData();const f=fd.get('file');format=fd.get('format')||'original';quality=fd.get('quality')||'100';password=fd.get('password')||'';
          if(!f||(!f.type.startsWith('image/')&&!f.name?.endsWith('.zip'))){return Response.json({error:'请上传图片'},{status:400,headers:cors(o)})}
          if(f.size>104857600)return Response.json({error:'超过 100MB'},{status:413,headers:cors(o)});
          origName=f.name||'';const ext=origName?'.'+origName.split('.').pop():'.png';
          file={stream:()=>f.stream(),type:f.type||'image/png',size:f.size,ext,origSize:f.size};
        }
        let ext=file.ext||'.png',ct2=file.type;
        if(format==='webp'){ext='.webp';ct2='image/webp'}else if(format==='png'){ext='.png';ct2='image/png'}else if(format==='jpg'){ext='.jpg';ct2='image/jpeg'}
        const key=randKey(ext);
        const meta={originalName:origName,uploadedAt:new Date().toISOString(),format,protected:password?'true':''};
        if(password)meta.password=password;
        await env.IMG.put(key,file.stream(),{httpMetadata:{contentType:ct2,cacheControl:'public, max-age=31536000, immutable'},customMetadata:meta});
        await updateStats(env,file.size||0);
        const savings=file.origSize&&file.size&&file.origSize>file.size?((1-file.size/file.origSize)*100).toFixed(0)+'%':'';
        return Response.json({url:`${url.origin}/i/${key}`,key,size:file.size,originalName:origName,protected:!!password,savings},{headers:cors(o)});
      }catch(e){return Response.json({error:e.message},{status:500,headers:cors(o)})}
    }

    // 图片访问（密码保护）
    if(url.pathname.startsWith('/i/')&&request.method==='GET'){
      const key=url.pathname.slice(3);const obj=await env.IMG.get(key);
      if(!obj)return new Response('Not Found',{status:404});
      if(obj.customMetadata?.password&&obj.customMetadata.password!==(url.searchParams.get('pwd')||'')){
        return new Response('<html><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f5f7fa"><form style="text-align:center;background:#fff;padding:32px;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,.1)"><h2 style="margin-bottom:12px">🔒 密码保护</h2><input name="pwd" placeholder="请输入密码" style="padding:8px 12px;border:1px solid #ddd;border-radius:6px;width:200px;margin-bottom:12px"><br><button style="padding:8px 20px;background:#10b981;color:#fff;border:none;border-radius:6px;cursor:pointer">访问</button></form></body></html>',{headers:{'Content-Type':'text/html; charset=utf-8'}});
      }
      const h=new Headers();
      h.set('Content-Type',obj.httpMetadata?.contentType||'image/png');
      h.set('Cache-Control','public, max-age=31536000, immutable');
      h.set('Access-Control-Allow-Origin','*');h.set('ETag',obj.etag);
      if(url.searchParams.has('dl'))h.set('Content-Disposition','attachment; filename="'+key+'"');
      const inm=request.headers.get('If-None-Match');if(inm&&inm===obj.etag)return new Response(null,{status:304,headers:h});
      return new Response(obj.body,{headers:h});
    }

    if(url.pathname.startsWith('/i/')&&request.method==='DELETE'){
      await env.IMG.delete(url.pathname.slice(3));return Response.json({success:true},{headers:cors(o)});
    }

    // 列表（支持 /list?all=1 获取全部）
    if(url.pathname==='/list'&&request.method==='GET'){
      const all=url.searchParams.has('all');
      const limit=all?1000:20;
      const l=await env.IMG.list({limit});
      return Response.json({files:l.objects.map(o=>({key:o.key,url:`${url.origin}/i/${o.key}`,size:o.size,uploaded:o.customMetadata?.uploadedAt||o.uploaded,protected:!!o.customMetadata?.password}))},{headers:cors(o)});
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
:root{--ac:#10b981;--bdr:#e5e7eb}
a{color:var(--ac);text-decoration:none}a:hover{text-decoration:underline}
.navbar{background:#fff;border-bottom:1px solid var(--bdr);height:56px;display:flex;align-items:center;padding:0 24px;position:sticky;top:0;z-index:100}
.navbar .logo{font-size:1.1rem;font-weight:700;color:var(--ac)}.navbar .nav{margin-left:auto;display:flex;gap:20px;font-size:.88rem}
.navbar .nav a{color:#6b7280;font-weight:500;padding:4px 0;border-bottom:2px solid transparent}.navbar .nav a:hover,.navbar .nav a.on{color:var(--ac);border-bottom-color:var(--ac)}
.wrap{max-width:720px;margin:0 auto;padding:32px 20px 60px}
h1{font-size:1.8rem;text-align:center;margin-bottom:8px}
.sub{text-align:center;color:#6b7280;margin-bottom:28px;font-size:.9rem}
h2{font-size:1.05rem;font-weight:600;margin:24px 0 10px;padding:10px 14px;background:#ecfdf5;border-radius:8px;border-left:3px solid var(--ac)}
p{margin:8px 0;font-size:.88rem;line-height:1.7;color:#4b5563}
pre{background:#0f172a;color:#e2e8f0;border-radius:8px;padding:14px;overflow-x:auto;margin:10px 0 16px;font-size:.82rem;font-family:'SF Mono','JetBrains Mono',Consolas,monospace;line-height:1.5}
.badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:.72rem;font-weight:700;margin-right:6px;color:#fff;vertical-align:middle}
.post{background:#10b981}.get{background:#3b82f6}.del{background:#ef4444}
hr{border:none;border-top:1px solid var(--bdr);margin:20px 0}
.back{display:inline-block;margin-bottom:16px;color:#6b7280;font-size:.85rem}.back:hover{color:var(--ac)}
</style></head><body>
<nav class="navbar"><div class="logo">ao 图床</div><div class="nav"><a href="/">上传</a><a href="/api" class="on">API文档</a><a href="/manage">管理</a><a href="https://blog.aoterniu.online" target="_blank">博客</a></div></nav>
<div class="wrap"><a class="back" href="/">← 返回</a><h1>公共 API 文档</h1><p class="sub">无需认证 · RESTful · 响应 JSON</p>
<h2>API 端点</h2><p>基础 URL: <code>https://img.aoterniu.online</code></p><hr>
<p><span class="badge post">POST</span><strong> /upload</strong> — 上传图片（文件）</p><p>字段 <code>file</code>（图片），可选 <code>format</code>（original/webp/png/jpg）、<code>quality</code>（100/90/80/70）、<code>password</code>（密码保护）</p>
<pre>curl -X POST https://img.aoterniu.online/upload \\
  -F "file=@image.png" -F "format=webp" -F "quality=90" -F "password=1234"</pre>
<p><span class="badge post">POST</span><strong> /upload</strong> — URL 上传（JSON body）</p><p>字段 <code>url</code>（远程图片地址），可选 <code>format</code>、<code>quality</code>、<code>password</code></p>
<pre>curl -X POST https://img.aoterniu.online/upload \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://example.com/photo.jpg","format":"webp","password":"1234"}'</pre>
<p><strong>响应：</strong></p>
<pre>{"url":"...","key":"...","size":12345,"originalName":"image.png","protected":false,"savings":"30%"}</pre>
<hr><p><span class="badge get">GET</span><strong> /i/:key</strong> — 访问图片（密码图片: <code>?pwd=xxx</code>）</p>
<p><span class="badge get">GET</span><strong> /list</strong> — 最近 20 张（加 <code>?all=1</code> 获取全部）</p>
<p><span class="badge get">GET</span><strong> /stats</strong> — 统计数据</p>
<p><span class="badge del">DELETE</span><strong> /i/:key</strong> — 删除图片</p>
<h2>JavaScript</h2><pre>const fd = new FormData();
fd.append('file', file);
fd.append('format', 'webp');
fd.append('password', '1234');
const r = await fetch('https://img.aoterniu.online/upload', {method:'POST', body:fd});
const {url} = await r.json();</pre>
<h2>Python</h2><pre>r = requests.post('https://img.aoterniu.online/upload',
    files={'file': open('img.png','rb')},
    data={'format':'webp','password':'1234'})
print(r.json()['url'])</pre>
<h2>PicGo / Typora</h2><pre># PicGo Custom: curl -F "file=@$2" -F "format=webp" https://img.aoterniu.online/upload
# Typora: curl -s -X POST -F "file=@$2" -F "format=webp" https://img.aoterniu.online/upload</pre>
</div></body></html>`;
