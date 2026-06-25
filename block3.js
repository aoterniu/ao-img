
const $=s=>document.querySelector(s);
const drop=$('#drop'),fi=$('#fi'),bar=$('#bar'),fill=$('#fill'),status=$('#status'),results=$('#results');

// 公告
if(!localStorage.getItem('ao_announced_v5')){$('#modal').classList.add('show')}
function closeModal(){$('#modal').classList.remove('show');localStorage.setItem('ao_announced_v5','1')}

// 拖拽
drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('active')});
drop.addEventListener('dragleave',()=>drop.classList.remove('active'));
drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('active');doUpload(e.dataTransfer.files)});

// 文件选择 - 自动上传（多重兼容性处理）
function handleFileSelect(e){
  try{
    const files=e.target.files||e.dataTransfer?.files;
    if(!files||files.length===0)return;
    const fileList=Array.from(files);
    showSelectedFiles(fileList);
    doUpload(fileList);
    if(e.target)e.target.value='';
  }catch(err){console.error('文件选择错误:',err)}
}
fi.addEventListener('change',handleFileSelect);
fi.addEventListener('input',handleFileSelect);
// 防止 drop 区域的点击事件冒泡到 fi
drop.addEventListener('click',function(e){
  if(e.target===fi)return;
  fi.click();
});

// 显示选中的文件
function showSelectedFiles(files){
  const el=$('#selFiles');
  if(!files.length){el.classList.remove('show');return}
  let html='';
  for(const f of files){
    const sz=f.size<1024?f.size+'B':f.size<1048576?(f.size/1024).toFixed(1)+'KB':(f.size/1048576).toFixed(1)+'MB';
    html+='<div class="file-item"><span class="name">📄 '+f.name+'</span><span class="size">'+sz+'</span></div>';
  }
  el.innerHTML=html;el.classList.add('show');
}
document.addEventListener('paste',e=>{const it=e.clipboardData?.items;if(!it)return;const fs=[];for(const i of it)if(i.type.startsWith('image/'))fs.push(i.getAsFile());if(fs.length)doUpload(fs)});

// 获取图片尺寸
function getImgDim(file){
  return new Promise(r=>{
    const img=new Image();const url=URL.createObjectURL(file);
    img.onload=()=>{URL.revokeObjectURL(url);r({w:img.naturalWidth,h:img.naturalHeight})};
    img.onerror=()=>{URL.revokeObjectURL(url);r({w:0,h:0})};
    img.src=url;
  });
}

// URL 上传
async function urlUpload(){
  const url=$('#urlIn').value.trim();
  if(!url){
    $('#status').style.display='block';$('#status').textContent='请输入图片 URL';$('#status').style.color='#dc2626';
    setTimeout(()=>{$('#status').style.display='none';$('#status').style.color=''},2000);
    return;
  }
  bar.style.display='block';status.style.display='block';status.innerHTML='<span class="spin"></span>正在下载图片...';
  fill.style.width='20%';results.style.display='block';results.innerHTML='';
  const pwd=$('#pwdChk').checked?$('#pwdVal').value:'';
  try{
    const body={url,format:$('#fmt').value,quality:$('#qlt').value,password:pwd};
    const tkn=document.getElementById('cf-turnstile')?.dataset?.token;
    if(tkn)body.cf_turnstile=tkn;
    const r=await fetch('/upload',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    const d=await r.json();
    fill.style.width='100%';
    if(d.url){
      results.innerHTML=card(d);
      status.textContent='上传成功！';
      status.style.color='#10b981';
      $('#urlIn').value='';
    }else{
      results.innerHTML='<div style="color:#dc2626;padding:12px;font-size:.9rem">'+(d.error||'上传失败')+'</div>';
      status.textContent='上传失败';
      status.style.color='#dc2626';
    }
  }catch(e){
    results.innerHTML='<div style="color:#dc2626;padding:12px;font-size:.9rem">网络错误，请重试</div>';
    status.textContent='网络错误';
    status.style.color='#dc2626';
  }
  setTimeout(()=>{bar.style.display='none';status.style.display='none';status.style.color=''},3000);
  loadRecent();loadStats();
}

// 上传（带错误捕获）
async function doUpload(files){
  if(!files||!files.length)return;
  try{
    const isZip=f=>f.name&&f.name.endsWith('.zip');
    const isVid=f=>f.type?.startsWith('video/')||f.name?.match(/\.(mp4|webm)$/i);
    const isImg=f=>f.type?.startsWith('image/')||f.name?.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i);

    bar.style.display='block';status.style.display='block';results.style.display='block';
    let d=0,t=files.length;const pwd=$('#pwdChk').checked?$('#pwdVal').value:'';
    status.innerHTML='<span class="spin"></span>准备上传...';status.style.color='';
  // ZIP 处理
  for(const f of files){
    if(!isZip(f))continue;
    status.innerHTML='<span class="spin"></span>正在解压 ZIP...';
    try{
      const imgs=await extractZip(await f.arrayBuffer());
      if(!imgs.length){results.innerHTML+='<div style="color:#dc2626;padding:12px">ZIP 中没有图片/视频</div>';continue}
      t=imgs.length;d=0;
      for(const img of imgs){
        status.innerHTML='<span class="spin"></span>上传 ('+d+'/'+t+'): '+img.name;
        fill.style.width=(d/t*100)+'%';
        const fd=new FormData();fd.append('file',img.blob,img.name);fd.append('format',$('#fmt').value);fd.append('quality',$('#qlt').value);if(pwd)fd.append('password',pwd);
        try{const r=await fetch('/upload',{method:'POST',body:fd});const j=await r.json();if(j.url)results.innerHTML+=card(j)}catch(e){}
        d++
      }
      fill.style.width='100%';status.textContent='ZIP 解压上传完成 ('+t+' 个)';status.style.color='#10b981';
    }catch(e){results.innerHTML+='<div style="color:#dc2626;padding:12px">ZIP 解压失败</div>';status.textContent='ZIP 解压失败';status.style.color='#dc2626'}
    setTimeout(()=>{bar.style.display='none';status.style.display='none';status.style.color=''},3000);
    $('#selFiles').classList.remove('show');
    loadRecent();loadStats();return
  }

  // 图片/视频批量上传
  for(const f of files){
    if(!isImg(f)&&!isVid(f)){d++;continue}
    status.innerHTML='<span class="spin"></span>上传 ('+d+'/'+t+')...';fill.style.width=(d/t*100)+'%';
    // 获取图片尺寸
    let dim=null;
    if(isImg(f)){dim=await getImgDim(f)}
    const fd=new FormData();fd.append('file',f);fd.append('format',$('#fmt').value);fd.append('quality',$('#qlt').value);if(pwd)fd.append('password',pwd);
    const tkn=document.getElementById('cf-turnstile')?.dataset?.token;if(tkn)fd.append('cf-turnstile',tkn);
    try{
      const r=await fetch('/upload',{method:'POST',body:fd});const j=await r.json();
      if(j.url){if(dim&&dim.w)j.dim=dim.w+'×'+dim.h;results.innerHTML+=card(j)}
      else results.innerHTML+='<div style="color:#dc2626;padding:8px">'+j.error+'</div>'
    }catch(e){results.innerHTML+='<div style="color:#dc2626;padding:8px">网络错误</div>'}
    d++
  }
  fill.style.width='100%';status.textContent='上传完成 ('+d+' 个)';status.style.color='#10b981';
  setTimeout(()=>{bar.style.display='none';status.style.display='none';status.style.color=''},3000);
  $('#selFiles').classList.remove('show');
  loadRecent();loadStats()
  }catch(err){
    console.error('上传错误:',err);
    bar.style.display='block';status.style.display='block';
    status.textContent='上传失败: '+err.message;status.style.color='#dc2626';
    results.style.display='block';
    results.innerHTML='<div style="color:#dc2626;padding:12px">上传失败，请重试</div>';
    setTimeout(()=>{bar.style.display='none';status.style.display='none'},3000);
  }
}

// ZIP 解压
async function extractZip(ab){
  const out=[];
  try{
    const files=await JSZip.loadAsync(ab);
    for(const [name,file] of Object.entries(files)){
      if(file.dir)continue;
      if(!name.match(/\.(jpg|jpeg|png|gif|webp|bmp|mp4|webm)$/i))continue;
      const blob=await file.async('blob');out.push({name,blob});
    }
  }catch(e){console.error('ZIP',e)}
  return out
}

function card(d){
  const sz=d.size<1024?d.size+'B':d.size<1048576?(d.size/1024).toFixed(1)+'KB':(d.size/1048576).toFixed(1)+'MB';
  const fmt=(d.originalName||'').split('.').pop().toUpperCase()||'IMG';
  const isVideo=fmt==='MP4'||fmt==='WEBM';

  // 根据用户选择的格式生成 URL
  const selectedFormat=$('#fmt').value;
  const quality=$('#qlt').value;
  let displayUrl=d.url;
  if(selectedFormat!=='original'&&selectedFormat!=='preserve'&&!isVideo){
    displayUrl=d.url+'?format='+selectedFormat+'&quality='+quality;
  }

  const dimLine=d.dim?'<div class="line"><b>尺　寸：</b>'+d.dim+'</div>':'';
  const savLine=d.savings?'<div class="line"><b>压缩率：</b>已节省 <span class="sav">'+d.savings+'</span> ✨</div>':'';
  const pwdLine=d.protected?'<div class="line"><b>保　护：</b>🔒 密码访问</div>':'';
  const previewTag=isVideo
    ?'<div class="preview-wrap"><video class="preview" src="'+d.url+'" muted style="cursor:pointer" onclick="showLB(this.src,true)"></video><button class="dl-preview" data-dl-url="'+d.url+'" data-dl-key="'+d.key+'" title="下载"><svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button></div>'
    :'<div class="preview-wrap"><img class="preview" src="'+displayUrl+'" onclick="showLB(this.src)"><button class="dl-preview" data-dl-url="'+d.url+'" data-dl-key="'+d.key+'" title="下载"><svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button></div>';
  const md=isVideo?'[video]('+d.url+')':'![]('+displayUrl+')';
  const htmlCode=isVideo?'<video src="'+d.url+'" controls></video>':'<img src="'+displayUrl+'" alt="'+d.key+'">';
  const bb=isVideo?'[video]'+d.url+'[/video]':'[IMG]'+displayUrl+'[/IMG]';
  return '<div class="r-item">'+
    '<div class="success">✅ 上传成功</div>'+
    '<div class="top">'+previewTag+
      '<div class="info">'+
        '<div class="line"><b>文件名：</b>'+d.key+'</div>'+
        '<div class="line"><b>大　小：</b>'+sz+'</div>'+
        '<div class="line"><b>格　式：</b>'+fmt+'</div>'+dimLine+savLine+pwdLine+
      '</div></div>'+
    '<div class="links">'+
      '<div class="row"><label>直链</label><input value="'+displayUrl+'" readonly><button class="cpy" onclick="cp(this)">复制</button></div>'+
      '<div class="row"><label>Markdown</label><input value="'+md+'" readonly><button class="cpy" onclick="cp(this)">复制</button></div>'+
      '<div class="row"><label>HTML</label><input value="'+html+'" readonly><button class="cpy" onclick="cp(this)">复制</button></div>'+
      '<div class="row"><label>BBCode</label><input value="'+bb+'" readonly><button class="cpy" onclick="cp(this)">复制</button></div>'+
      '<div class="btn-row">'+
        '<button class="dl-btn" data-dl-url="'+d.url+'" data-dl-key="'+d.key+'"><svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> 下载原图</button>'+
        '<button class="del-btn" data-del-key="'+d.key+'"><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg> 删除</button>'+
      '</div>'+
    '</div></div>';
}

function cp(b){const i=b.previousElementSibling;navigator.clipboard.writeText(i.value);b.textContent='已复制';b.classList.add('ok');setTimeout(()=>{b.textContent='复制';b.classList.remove('ok')},1500)}
function dlImg(url,filename){const a=document.createElement('a');a.href=url+'?dl=1';a.download=filename;a.click()}
function delCard(key,el){
  const btn=el.closest('.del-btn');
  if(!btn.dataset.confirm){
    btn.dataset.confirm='1';
    btn.innerHTML='<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg> 确认删除？';
    btn.style.color='#ef4444';btn.style.borderColor='#ef4444';btn.style.background='#fef2f2';
    setTimeout(()=>{delete btn.dataset.confirm;btn.innerHTML='<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg> 删除';btn.style.cssText=''},3000);
    return;
  }
  fetch('/i/'+key,{method:'DELETE'}).then(()=>{
    const card=btn.closest('.r-item');
    card.style.opacity='0';card.style.transform='scale(0.95)';
    setTimeout(()=>card.remove(),300);
  }).catch(()=>alert('删除失败'));
}

// 事件委托：下载按钮 + 删除按钮
document.addEventListener('click',function(e){
  const dlBtn=e.target.closest('.dl-preview,.dl-btn');
  if(dlBtn&&dlBtn.dataset.dlUrl){e.stopPropagation();dlImg(dlBtn.dataset.dlUrl,dlBtn.dataset.dlKey);return}
  const delBtn=e.target.closest('.del-btn');
  if(delBtn&&delBtn.dataset.delKey){e.stopPropagation();delCard(delBtn.dataset.delKey,delBtn)}
});

function showLB(src,isVid){
  const img=$('#lbImg'),vid=$('#lbVid');
  if(isVid){img.style.display='none';vid.style.display='';vid.src=src}
  else{vid.style.display='none';img.style.display='';img.src=src}
  $('#lb').classList.add('show');
}
$('#lb').addEventListener('click',function(e){if(e.target===this){this.classList.remove('show');$('#lbVid').pause()}});

async function loadRecent(){
  try{
    const r=await fetch('/recent');
    if(!r.ok){$('#recentCard').style.display='none';return}
    const d=await r.json();
    if(d.files?.length){
      $('#recentCard').style.display='';
      $('#thumbs').innerHTML=d.files.slice(0,20).map(f=>{
        const isV=f.key.match(/\.(mp4|webm)$/i);
        const thumb=isV?'<video src="'+f.url+'" muted></video>':'<img src="'+f.url+'" loading="lazy">';
        const lbCall=isV?'showLB(\''+f.url+'\',true)':'showLB(\''+f.url+'\')';
        return '<div class="thumb" title="'+f.key+'" ondblclick="'+lbCall+'">'+thumb+'<div class="overlay">'+
          '<button class="ov-prev" onclick="event.stopPropagation();'+lbCall+'">👁</button>'+
          '<button class="ov-copy" onclick="event.stopPropagation();navigator.clipboard.writeText(\''+f.url+'\');this.textContent=\'✓\';setTimeout(()=>this.textContent=\'📋\',800)">📋</button>'+
        '</div></div>';
      }).join('');
    }else{$('#recentCard').style.display='none'}
  }catch(e){$('#recentCard').style.display='none'}
}

async function delImg(key,el){if(!confirm('确认删除 '+key+' ?'))return;try{await fetch('/i/'+key,{method:'DELETE'});el.style.opacity='0';setTimeout(()=>el.remove(),300)}catch(e){}}

async function loadStats(){try{const r=await fetch('/stats');const d=await r.json();$('#sTotal').textContent=d.total||0;$('#sToday').textContent=d.today||0;$('#sSize').textContent=d.sizeStr||'0B';document.getElementById('sTransform').textContent=d.transformUsed!==undefined?d.transformUsed+'/'+d.transformLimit:'-'}catch(e){}}

// JSZip CDN
const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';document.head.appendChild(s);

loadRecent();loadStats();
