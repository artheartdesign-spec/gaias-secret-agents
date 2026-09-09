const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={assets:[], scenes:[], logoId:null, narrationId:null, musicId:null, renderedBlob:null, renderedName:null, playing:false, startTime:0, raf:null, audio:{narr:null,music:null}};
let db=null;

function uid(){return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)+Date.now()}
function fmt(sec){sec=Math.max(0,Math.round(sec||0));return Math.floor(sec/60)+":"+String(sec%60).padStart(2,"0")}
function totalDuration(){return state.scenes.reduce((a,s)=>a+(Number(s.duration)||0),0)}
function assetById(id){return state.assets.find(a=>a.id===id)}
function mediaType(m){if(!m)return "none"; if(m.type.startsWith("image/"))return "image"; if(m.type.startsWith("video/"))return "video"; if(m.type.startsWith("audio/"))return "audio"; return "other"}
function escapeHtml(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]))}

const GSA_PRESETS={
  "ocean-kai":{characterPreset:"kai",character:"Kai, female green sea turtle; ancient and wise; patient and kind; realistic green sea turtle anatomy; gentle expressive eyes; no clothing",setting:"Australian ocean, coral reef, shoreline, moonlit sea, nesting beach and nature discovery",mission:"Mission 1 — Ocean Discoverer. Curiosity is the super power. Hopeful marine discovery, real-world care for oceans, no doom.",note:"Kai is locked as female, wise, patient and kind. Use realistic sea-turtle anatomy."},
  "starter-bramblewicks":{characterPreset:"bramblewicks",character:"Bramblewicks, fox mentor; peacock/royal blue coat; natural fox feet with no sandals; clever, warm guide; keep face and clothing consistent across scenes",setting:"secret nature headquarters, woodland paths, old maps, hidden clues, warm lantern light and outdoor discovery",mission:"GSA Starter Kit induction. This is club induction, not a monthly mission. Mysterious but safe, welcoming and child-friendly.",note:"Bramblewicks uses the approved royal/peacock blue coat and fox feet — never brown coat, never sandals."},
  "flip":{characterPreset:"flip",character:"Flip, male bottlenose dolphin; energetic, playful and fun; realistic bottlenose dolphin anatomy; expressive but not cartoonishly human",setting:"bright open ocean, waves, reef edges and playful marine exploration",mission:"Energetic Gaia’s Secret Agents ocean adventure with positive action and discovery.",note:"Flip is locked as a male bottlenose dolphin with an energetic, fun personality."},
  "general":{characterPreset:"none",character:"",setting:"Australian nature, ocean, forest, garden and outdoor discovery",mission:"Gaia’s Secret Agents screen-free environmental adventure for children ages 6–11. Positive purpose, real-world action, leadership and family connection.",note:"General GSA mode. Use uploaded approved character references whenever a named character appears."}
};
const CHARACTER_PRESETS={
  kai:"Kai, female green sea turtle; ancient and wise; patient and kind; realistic green sea turtle anatomy; gentle expressive eyes; no clothing",
  bramblewicks:"Bramblewicks, fox mentor; peacock/royal blue coat; natural fox feet with no sandals; clever, warm guide; keep face and clothing consistent",
  flip:"Flip, male bottlenose dolphin; energetic, playful and fun; realistic bottlenose dolphin anatomy",
  sprig:"Sprig, tree sprite scout; small nature scout; plant-inspired details; use approved uploaded reference when available and keep design consistent",
  astra:"Astra, owl; observant nature-agent character; realistic owl anatomy with a child-friendly illustrated treatment; keep design consistent",
  ink:"Ink, squid; intelligent ocean-agent character; realistic squid anatomy with a child-friendly illustrated treatment; keep design consistent",
  none:"", custom:null
};
function applyGsaPreset(key){
  if(key==="custom") return;
  const p=GSA_PRESETS[key]||GSA_PRESETS.general;
  $("#characterPreset").value=p.characterPreset; $("#mainCharacter").value=p.character; $("#mainSetting").value=p.setting; $("#missionLook").value=p.mission; $("#presetNote").textContent=p.note;
  state.scenes.forEach(s=>{ if(!s.prompt || s.prompt.includes("Premium illustrated")) s.prompt=""; });
  writePromptsForAll(); saveMeta();
}
function applyCharacterPreset(key){const value=CHARACTER_PRESETS[key]; if(value===null)return; $("#mainCharacter").value=value; saveMeta();}


async function openDB(){
  return new Promise((resolve)=>{
    const req=indexedDB.open("gsa-video-studio-v3",1);
    req.onupgradeneeded=()=>{const d=req.result;if(!d.objectStoreNames.contains("media"))d.createObjectStore("media",{keyPath:"id"})}
    req.onsuccess=()=>{db=req.result;resolve(db)}
    req.onerror=()=>resolve(null)
  })
}
async function putMedia(obj){
  if(!db || !obj.persistable) return;
  await new Promise(res=>{const tx=db.transaction("media","readwrite");tx.objectStore("media").put({id:obj.id,name:obj.name,type:obj.type,blob:obj.blob,source:obj.source||"local"});tx.oncomplete=res;tx.onerror=res})
}
async function getAllMedia(){
  if(!db)return[];
  return await new Promise(res=>{const tx=db.transaction("media","readonly");const r=tx.objectStore("media").getAll();r.onsuccess=()=>res(r.result||[]);r.onerror=()=>res([])})
}

function createMediaObjectFromFile(file,id=uid()){
  const obj={id,name:file.name,type:file.type||"application/octet-stream",blob:file,url:URL.createObjectURL(file),element:null,persistable:true,source:"local"};
  if(obj.type.startsWith("image/")){const im=new Image();im.crossOrigin="anonymous";im.src=obj.url;obj.element=im}
  else if(obj.type.startsWith("video/")){const v=document.createElement("video");v.src=obj.url;v.muted=true;v.playsInline=true;v.preload="auto";obj.element=v}
  else if(obj.type.startsWith("audio/")){const a=new Audio(obj.url);a.preload="auto";obj.element=a}
  return obj;
}
function createRemoteImageObject(url,name,prompt="",id=uid()){
  const obj={id,name,type:"image/png",blob:null,url,element:null,persistable:false,source:"remote",prompt};
  const im=new Image(); im.crossOrigin="anonymous"; im.referrerPolicy="no-referrer"; im.src=url; obj.element=im;
  return obj;
}
async function ingestFiles(files){
  for(const file of files){
    const obj=createMediaObjectFromFile(file);state.assets.push(obj);await putMedia(obj)
  }
  renderAssets(); renderScenes(); renderGenScenes(); renderGallery(); saveMeta();
}

function renderAssets(){
  const host=$("#assetList");host.innerHTML="";
  state.assets.filter(a=>["image","video"].includes(mediaType(a))).forEach(a=>{
    const d=document.createElement("div");d.className="asset-pill";
    d.innerHTML=`<span>${escapeHtml(a.name)}</span><span class="muted">${mediaType(a)}</span>`;
    host.appendChild(d);
  });
}
function assetOptions(selected){
  return `<option value="">Generic placeholder</option>`+state.assets.filter(a=>["image","video"].includes(mediaType(a))).map(a=>`<option value="${a.id}" ${a.id===selected?"selected":""}>${escapeHtml(a.name)}</option>`).join("")
}

function defaultScene(text=""){
  return {
    id:uid(),
    assetId:"",
    duration:Math.max(4,Math.min(12,Math.ceil((text.trim().split(/\s+/).filter(Boolean).length||12)/2.2))),
    text:text.trim(),
    caption:"",
    motion:"slowZoom",
    prompt:"",
    genStatus:""
  }
}
function splitNarration(text){
  let parts=text.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
  if(parts.length<2){
    const sentences=(text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[]).map(x=>x.trim()).filter(Boolean);
    parts=[]; for(let i=0;i<sentences.length;i+=2) parts.push(sentences.slice(i,i+2).join(" "));
  }
  return parts.length?parts:[text.trim()].filter(Boolean)
}
function styleLock(){ return $("#styleLock").value.trim(); }
function promptExtras(){ return $("#promptExtras").value.trim(); }

function buildPromptForScene(scene, index){
  const char=$("#mainCharacter").value.trim();
  const setting=$("#mainSetting").value.trim();
  const extra=promptExtras();
  const style=styleLock();
  const mission=$("#missionLook")?.value?.trim()||"";
  let content=scene.text?.trim() || scene.caption?.trim() || `Scene ${index+1}`;
  return [
    style,
    `Scene focus: ${content}.`,
    char ? `Main recurring character: ${char}.` : "",
    setting ? `Setting: ${setting}.` : "",
    mission ? `Mission direction: ${mission}.` : "",
    extra ? `Extra guidance: ${extra}.` : "",
    "Create a single polished illustrated scene image for a children's YouTube video. Keep the composition clean and readable. Preserve any named character description exactly across scenes. No logo inside generated art. No text unless specifically required by the scene. Do not invent replacement branding."
  ].filter(Boolean).join(" ");
}
function writePromptsForAll(){
  state.scenes.forEach((s,i)=>{ if(!s.prompt || s.prompt.startsWith("Premium illustrated")) s.prompt=buildPromptForScene(s,i); else if(!s.prompt.trim()) s.prompt=buildPromptForScene(s,i);});
  renderScenes(); renderGenScenes(); saveMeta();
}
function renderScenes(){
  const host=$("#sceneList"); host.innerHTML="";
  state.scenes.forEach((s,i)=>{
    const d=document.createElement("div"); d.className="scene";
    d.innerHTML=`
      <div class="scene-head">
        <div class="scene-title">Scene ${i+1}</div>
        <div class="scene-actions">
          <button class="btn small" data-act="up" data-id="${s.id}">↑</button>
          <button class="btn small" data-act="down" data-id="${s.id}">↓</button>
          <button class="btn small" data-act="genprompt" data-id="${s.id}">Write prompt</button>
          <button class="btn small danger" data-act="del" data-id="${s.id}">Delete</button>
        </div>
      </div>
      <div class="scene-grid">
        <div><label>Visual</label><select data-field="assetId" data-id="${s.id}">${assetOptions(s.assetId)}</select></div>
        <div><label>Seconds</label><input type="number" min="1" max="120" step=".5" value="${s.duration}" data-field="duration" data-id="${s.id}"></div>
        <div><label>Motion</label><select data-field="motion" data-id="${s.id}">
          <option value="none" ${s.motion==="none"?"selected":""}>Still</option>
          <option value="slowZoom" ${s.motion==="slowZoom"?"selected":""}>Slow zoom</option>
          <option value="panLeft" ${s.motion==="panLeft"?"selected":""}>Pan left</option>
          <option value="panRight" ${s.motion==="panRight"?"selected":""}>Pan right</option>
        </select></div>
      </div>
      <div class="scene-grid2">
        <div><label>On-screen text</label><textarea data-field="text" data-id="${s.id}" style="min-height:82px">${escapeHtml(s.text)}</textarea></div>
        <div><label>Notes / caption</label><textarea data-field="caption" data-id="${s.id}" style="min-height:82px">${escapeHtml(s.caption)}</textarea></div>
      </div>
      <label style="margin-top:8px">Image prompt</label>
      <textarea data-field="prompt" data-id="${s.id}" style="min-height:96px">${escapeHtml(s.prompt||"")}</textarea>
      <div class="muted">${escapeHtml(s.genStatus||"")}</div>`;
    host.appendChild(d);
  });
  updateKpis(); saveMeta();
}
function renderGenScenes(){
  const host=$("#genSceneList"); host.innerHTML="";
  state.scenes.forEach((s,i)=>{
    const currentAsset=assetById(s.assetId);
    const preview=currentAsset && mediaType(currentAsset)==="image" ? `<img src="${currentAsset.url}" alt="">` : `<div class="muted" style="padding:18px;text-align:center">No scene image yet</div>`;
    const d=document.createElement("div"); d.className="gen-scene";
    d.innerHTML=`
      <div class="scene-head">
        <div class="scene-title">Scene ${i+1}</div>
        <div class="scene-actions">
          <button class="btn small" data-gact="build" data-id="${s.id}">Write prompt</button>
          <button class="btn small primary" data-gact="generate" data-id="${s.id}">Generate image</button>
          <button class="btn small" data-gact="copy" data-id="${s.id}">Copy prompt</button>
        </div>
      </div>
      <div class="gen-preview" style="margin-top:10px">
        <div class="gen-box">${preview}</div>
        <div>
          <label>Prompt</label>
          <textarea data-gfield="prompt" data-id="${s.id}" style="min-height:120px">${escapeHtml(s.prompt||"")}</textarea>
          <div class="muted">${escapeHtml(s.genStatus||"")}</div>
        </div>
      </div>`;
    host.appendChild(d);
  });
}
function renderGallery(){
  const host=$("#generatedGallery"); host.innerHTML="";
  const imgs=state.assets.filter(a=>mediaType(a)==="image");
  if(!imgs.length){host.innerHTML='<div class="muted">No images yet.</div>'; return;}
  imgs.slice().reverse().forEach(a=>{
    const d=document.createElement("div"); d.className="thumb";
    d.innerHTML=`<img src="${a.url}" alt=""><div class="meta"><div class="name">${escapeHtml(a.name)}</div><div style="margin-top:6px"><span class="badge-mini">${escapeHtml(a.source||"image")}</span></div></div>`;
    host.appendChild(d);
  });
}

function updateKpis(){
  $("#sceneCount").textContent=state.scenes.length;
  $("#durationKpi").textContent=fmt(totalDuration());
  $("#timeReadout").textContent=`0:00 / ${fmt(totalDuration())}`;
}
function saveMeta(){
  const payload={
    title:$("#projectTitle")?.value||"GSA Mission Video",
    resolution:$("#resolution")?.value||"1280x720",
    scenes:state.scenes,
    logoId:state.logoId, narrationId:state.narrationId, musicId:state.musicId,
    narrationVolume:$("#narrationVolume")?.value||1, musicVolume:$("#musicVolume")?.value||.55, duck:$("#duckMusic")?.checked!==false,
    mainCharacter:$("#mainCharacter")?.value||"", mainSetting:$("#mainSetting")?.value||"", missionLook:$("#missionLook")?.value||"", characterPreset:$("#characterPreset")?.value||"custom", gsaPreset:$("#gsaPreset")?.value||"general", styleLock:$("#styleLock")?.value||"",
    promptExtras:$("#promptExtras")?.value||"", endingLine:$("#endingLine")?.value||""
  };
  try{ localStorage.setItem("gsa-video-project-v3", JSON.stringify(payload)); }catch(e){}
}
async function restore(){
  const raw=localStorage.getItem("gsa-video-project-v3"); let meta=null; try{meta=raw?JSON.parse(raw):null}catch(e){}
  const stored=await getAllMedia();
  state.assets=stored.map(x=>createMediaObjectFromFile(x.blob,x.id));
  renderAssets();
  if(meta){
    $("#projectTitle").value=meta.title||"GSA Mission Video";
    $("#resolution").value=meta.resolution||"1280x720";
    state.scenes=meta.scenes||[];
    state.logoId=meta.logoId||null; state.narrationId=meta.narrationId||null; state.musicId=meta.musicId||null;
    $("#narrationVolume").value=meta.narrationVolume??1; $("#musicVolume").value=meta.musicVolume??.55; $("#duckMusic").checked=meta.duck!==false;
    $("#mainCharacter").value=meta.mainCharacter||"Kai the wise green sea turtle";
    $("#mainSetting").value=meta.mainSetting||"Australian ocean, shoreline, moonlit sea and nature adventure";
    $("#missionLook").value=meta.missionLook||"Ocean Discoverer: curious, hopeful marine discovery";
    $("#characterPreset").value=meta.characterPreset||"kai";
    $("#gsaPreset").value=meta.gsaPreset||"ocean-kai";
    $("#styleLock").value=meta.styleLock||$("#styleLock").value;
    $("#promptExtras").value=meta.promptExtras||"";
    $("#endingLine").value=meta.endingLine||"Even small hands can change the world.";
  }
  renderScenes(); renderGenScenes(); renderGallery(); drawAt(0);
}
