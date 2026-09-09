function roundedRect(ctx,x,y,w,h,r){ctx.beginPath(); if(ctx.roundRect)ctx.roundRect(x,y,w,h,r); else ctx.rect(x,y,w,h); ctx.fill()}
function sceneAt(t){
  let cursor=0;
  for(let i=0;i<state.scenes.length;i++){const d=Number(state.scenes[i].duration)||0; if(t<cursor+d)return {scene:state.scenes[i],index:i,local:t-cursor,duration:d}; cursor+=d}
  return state.scenes.length ? {scene:state.scenes.at(-1),index:state.scenes.length-1,local:Number(state.scenes.at(-1).duration)||0,duration:Number(state.scenes.at(-1).duration)||0} : null;
}
function drawPlaceholder(ctx,w,h,i){
  const g=ctx.createLinearGradient(0,0,w,h); g.addColorStop(0,"#0b2c3d"); g.addColorStop(.5,"#0f5560"); g.addColorStop(1,"#091928");
  ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
  ctx.globalAlpha=.35; ctx.fillStyle="#c8a35c";
  for(let k=0;k<6;k++){ctx.beginPath(); ctx.arc(w*(.15+k*.16), h*(.3+.08*Math.sin(i+k)), 40+k*8, 0, Math.PI*2); ctx.fill();}
  ctx.globalAlpha=1;
}
function drawImageCover(ctx,img,w,h,progress,motion){
  if(!img || !img.naturalWidth) return;
  let scale=Math.max(w/img.naturalWidth,h/img.naturalHeight);
  let motionScale=1; if(motion==="slowZoom") motionScale=1+.08*progress;
  scale*=motionScale;
  const dw=img.naturalWidth*scale, dh=img.naturalHeight*scale;
  let x=(w-dw)/2, y=(h-dh)/2;
  if(motion==="panLeft") x+=(dw-w)*(.5-progress);
  if(motion==="panRight") x+=(dw-w)*(progress-.5);
  ctx.drawImage(img,x,y,dw,dh);
}
function wrapText(ctx,text,maxWidth){
  const words=String(text||"").split(/\s+/), lines=[]; let line="";
  for(const word of words){const test=line?line+" "+word:word; if(ctx.measureText(test).width>maxWidth && line){lines.push(line); line=word;} else line=test;}
  if(line) lines.push(line); return lines.slice(0,5);
}
function drawAt(t, canvas=$("#previewCanvas")){
  const ctx=canvas.getContext("2d"); const w=canvas.width, h=canvas.height; ctx.clearRect(0,0,w,h);
  const item=sceneAt(t);
  if(!item){drawPlaceholder(ctx,w,h,0); ctx.fillStyle="#f4ecd9"; ctx.font=`700 ${Math.round(w*.035)}px system-ui`; ctx.fillText("Add scenes to begin", w*.06, h*.12); return;}
  const {scene,index,local,duration}=item; const p=Math.max(0,Math.min(1,local/Math.max(.1,duration)));
  const asset=assetById(scene.assetId);
  if(asset && mediaType(asset)==="image") drawImageCover(ctx,asset.element,w,h,p,scene.motion);
  else if(asset && mediaType(asset)==="video" && asset.element.readyState>=2){ try{asset.element.currentTime=Math.min(asset.element.duration||local,local); ctx.drawImage(asset.element,0,0,w,h)}catch(e){drawPlaceholder(ctx,w,h,index)}}
  else drawPlaceholder(ctx,w,h,index);
  const shade=ctx.createLinearGradient(0,h*.55,0,h); shade.addColorStop(0,"rgba(0,0,0,0)"); shade.addColorStop(1,"rgba(0,0,0,.72)"); ctx.fillStyle=shade; ctx.fillRect(0,0,w,h);
  if(scene.text){
    const fs=Math.round(w*.037); ctx.font=`800 ${fs}px Georgia,serif`; const lines=wrapText(ctx,scene.text,w*.82); const lh=fs*1.18; const boxH=lines.length*lh+36;
    ctx.fillStyle="rgba(5,19,29,.80)"; roundedRect(ctx,w*.06,h-boxH-50,w*.88,boxH,18);
    ctx.fillStyle="#f4ecd9"; lines.forEach((ln,j)=>ctx.fillText(ln,w*.09,h-boxH-50+31+fs+j*lh));
  }
  const logo=assetById(state.logoId);
  if(logo && logo.element && logo.element.naturalWidth){ const size=w*.09; ctx.globalAlpha=.92; ctx.drawImage(logo.element,w-size-24,24,size,size); ctx.globalAlpha=1; }
}
function setCanvasResolution(){
  const [w,h]=($("#resolution").value||"1280x720").split("x").map(Number); $("#previewCanvas").width=w; $("#previewCanvas").height=h; drawAt(0);
}


async function setMusicFile(file){
  if(!file)return; const obj=createMediaObjectFromFile(file); state.assets.push(obj); state.musicId=obj.id; await putMedia(obj); saveMeta();
  const a=obj.element; const report=()=>{$("#songStatus").textContent=`Loaded: ${file.name}${Number.isFinite(a.duration)?` — ${fmt(a.duration)}`:""}`;};
  if(a.readyState>=1)report(); else a.addEventListener("loadedmetadata",report,{once:true});
}
async function getMusicDuration(){
  const a=assetById(state.musicId); if(!a||mediaType(a)!=="audio")return 0; const el=a.element;
  if(Number.isFinite(el.duration)&&el.duration>0)return el.duration;
  await new Promise(resolve=>{const done=()=>resolve();el.addEventListener("loadedmetadata",done,{once:true});el.addEventListener("error",done,{once:true});setTimeout(done,2500);});
  return Number.isFinite(el.duration)?el.duration:0;
}
async function fitScenesToMusic(){
  if(!state.scenes.length){alert("Create the storyboard first.");return false;} const dur=await getMusicDuration(); if(!dur){alert("Add a song first so I can match the scene timing.");return false;}
  const endingIndex=state.scenes.findIndex(s=>s.isEnding), endingDur=endingIndex>=0?Math.min(5,Math.max(3,dur*.05)):0, usable=Math.max(1,dur-endingDur);
  const contentScenes=state.scenes.filter(s=>!s.isEnding); const weights=contentScenes.map(s=>Math.max(4,(s.text||"").trim().split(/\s+/).filter(Boolean).length)); const totalW=weights.reduce((a,b)=>a+b,0)||1;
  contentScenes.forEach((s,i)=>s.duration=Math.max(2.5,usable*weights[i]/totalW)); if(endingIndex>=0)state.scenes[endingIndex].duration=endingDur;
  const now=totalDuration(); if(now>0){const scale=dur/now;state.scenes.forEach(s=>s.duration=Math.max(1.5,s.duration*scale));}
  renderScenes();renderGenScenes();saveMeta();$("#songStatus").textContent=`Scenes fitted to song length: ${fmt(dur)}.`;return true;
}
function addEndingScene(){
  const ending=$("#endingLine").value.trim()||"Even small hands can change the world."; const existing=state.scenes.find(s=>s.isEnding);
  if(existing){existing.text=ending;existing.prompt=`${styleLock()} End card scene: hopeful view of Earth and nature with space for a final message. No generated logo and no generated words.`;}
  else{const s=defaultScene(ending);s.isEnding=true;s.duration=4;s.motion="slowZoom";s.prompt=`${styleLock()} End card scene: hopeful view of Earth and nature, warm sense of possibility, clean 16:9 composition with calm negative space for an overlaid slogan. No generated logo and no generated words.`;state.scenes.push(s);}
  renderScenes();renderGenScenes();saveMeta();
}
async function quickBuild(){
  const txt=$("#narrationText").value.trim();if(!txt){alert("Paste the song lyrics first.");$("#narrationText").focus();return;}
  applyGsaPreset($("#gsaPreset").value);state.scenes=splitNarration(txt).map(defaultScene);writePromptsForAll();if(state.musicId)await fitScenesToMusic();renderScenes();renderGenScenes();jumpTab("story");
}
function jumpTab(name){const b=$(`.tab[data-tab="${name}"]`);if(b)b.click();window.scrollTo({top:0,behavior:"smooth"});}

function setupAudioPlayback(){
  [["narr",state.narrationId],["music",state.musicId]].forEach(([k,id])=>{
    const a=assetById(id);
    if(a && a.type.startsWith("audio/")){
      const el=new Audio(a.url); el.preload="auto";
      const musicMul=(k==="music" && $("#duckMusic").checked && state.narrationId)?0.45:1;
      el.volume = k==="narr" ? Number($("#narrationVolume").value) : Number($("#musicVolume").value)*musicMul;
      state.audio[k]=el; el.play().catch(()=>{});
    }
  });
}
async function playPreview(){
  stopPreview(); if(!state.scenes.length)return;
  state.playing=true; state.startTime=performance.now(); setupAudioPlayback();
  const tick=()=>{
    if(!state.playing) return;
    const t=(performance.now()-state.startTime)/1000; drawAt(t); $("#timeReadout").textContent=`${fmt(t)} / ${fmt(totalDuration())}`;
    if(t>=totalDuration()) return stopPreview();
    state.raf=requestAnimationFrame(tick);
  };
  tick();
}
function stopPreview(){
  state.playing=false; if(state.raf) cancelAnimationFrame(state.raf);
  Object.values(state.audio).forEach(a=>{if(a){a.pause(); a.currentTime=0;}});
  state.audio={narr:null,music:null}; drawAt(0); $("#timeReadout").textContent=`0:00 / ${fmt(totalDuration())}`;
}

function bestMime(){
  const candidates=["video/mp4;codecs=h264,aac","video/mp4","video/webm;codecs=vp9,opus","video/webm;codecs=vp8,opus","video/webm"];
  for(const m of candidates) if(window.MediaRecorder && MediaRecorder.isTypeSupported(m)) return m;
  return "";
}
async function renderVideo(){
  const canvas=$("#previewCanvas"); setCanvasResolution(); if(!state.scenes.length) return alert("Add at least one scene first.");
  if(!canvas.captureStream || !window.MediaRecorder) return alert("This browser cannot render video here.");
  const mime=bestMime(); if(!mime) return alert("No supported recording format found.");
  $("#renderVideo").disabled=true; $("#downloadLink").style.display="none"; $("#renderStatus").textContent="Preparing render…"; $("#renderBar").style.width="0%";
  const fps=30; const canvasStream=canvas.captureStream(fps);
  const audioCtx=new (window.AudioContext||window.webkitAudioContext)(); const dest=audioCtx.createMediaStreamDestination(); const temp=[];
  async function connectAudio(id,vol){
    const a=assetById(id); if(!a || !a.type.startsWith("audio/")) return;
    const el=new Audio(a.url); el.preload="auto"; el.crossOrigin="anonymous";
    const src=audioCtx.createMediaElementSource(el); const gain=audioCtx.createGain(); gain.gain.value=vol;
    src.connect(gain).connect(dest); temp.push(el);
  }
  await connectAudio(state.narrationId, Number($("#narrationVolume").value));
  const musicVol = Number($("#musicVolume").value) * ($("#duckMusic").checked && state.narrationId ? .45 : 1);
  await connectAudio(state.musicId, musicVol);
  const mixed=new MediaStream([...canvasStream.getVideoTracks(), ...dest.stream.getAudioTracks()]);
  const chunks=[]; let rec;
  try{rec=new MediaRecorder(mixed,{mimeType:mime,videoBitsPerSecond:$("#resolution").value.startsWith("1920")?8000000:4500000})}catch(e){rec=new MediaRecorder(mixed)}
  rec.ondataavailable=e=>{if(e.data.size) chunks.push(e.data)}
  rec.onstop=()=>{const blob=new Blob(chunks,{type:mime.split(";")[0]}); state.renderedBlob=blob; const url=URL.createObjectURL(blob); const a=$("#downloadLink");
    a.href=url; a.download=($("#projectTitle").value||"gsa-video").replace(/[^\w\-]+/g,"_")+"."+(mime.includes("mp4")?"mp4":"webm");
    state.renderedName=a.download; a.style.display="inline-block"; $("#shareVideo").style.display="inline-block"; $("#renderStatus").textContent="Render complete."; $("#renderBar").style.width="100%"; $("#renderVideo").disabled=false; audioCtx.close().catch(()=>{})
  };
  await audioCtx.resume(); rec.start(1000); temp.forEach(x=>x.play().catch(()=>{}));
  const start=performance.now(), dur=totalDuration();
  await new Promise(resolve=>{
    const loop=()=>{const t=(performance.now()-start)/1000; drawAt(Math.min(t,dur),canvas); $("#renderBar").style.width=(Math.min(1,t/dur)*100).toFixed(1)+"%"; $("#renderStatus").textContent=`Rendering ${fmt(t)} of ${fmt(dur)}…`; if(t>=dur) return resolve(); requestAnimationFrame(loop)}; loop()
  });
  temp.forEach(x=>x.pause()); rec.stop();
}
