function generatePublish(){
  const title=$("#projectTitle").value||"Gaia’s Secret Agents Mission";
  $("#ytTitle").value=title;
  $("#ytDescription").value=`A screen-free Gaia’s Secret Agents adventure for curious young Earth Protectors.\n\nFollow the mission, notice what changes, and take one real-world action for nature.\n\n${$("#endingLine").value.trim()}\n\n#GaiasSecretAgents #KidsActivities #NatureForKids`;
  let t=0;
  $("#ytChapters").value=state.scenes.map((s,i)=>{const line=`${fmt(t)} ${s.text?String(s.text).split(/[.!?]/)[0].slice(0,48):"Scene "+(i+1)}`; t+=Number(s.duration)||0; return line;}).join("\n");
}

async function copyText(text){ try{await navigator.clipboard.writeText(text); alert("Prompt copied.");} catch(e){ alert("Copy failed. Long-press and copy manually."); } }

function buildPollinationsUrl(prompt){
  const provider=$("#genProvider").value;
  if(provider!=="pollinations") return null;
  const model=$("#genModel").value || "flux";
  const size=$("#genSize").value.split("x"); const width=size[0], height=size[1];
  const seed=$("#genSeed").value.trim();
  const q = encodeURIComponent(prompt);
  const params = new URLSearchParams({width, height, model, nologo:"true", safe:"true", enhance:"true"});
  if(seed) params.set("seed", seed);
  return `https://image.pollinations.ai/prompt/${q}?${params.toString()}`;
}
async function generateSceneImage(sceneId){
  const scene=state.scenes.find(s=>s.id===sceneId);if(!scene)return;if(!scene.prompt.trim())scene.prompt=buildPromptForScene(scene,state.scenes.indexOf(scene));
  scene.genStatus="Generating…";renderScenes();renderGenScenes();saveMeta();const url=buildPollinationsUrl(scene.prompt.trim());if(!url){scene.genStatus="No generator configured.";renderScenes();renderGenScenes();return;}
  const name=`scene-${String(state.scenes.indexOf(scene)+1).padStart(2,"0")}-generated.png`;
  try{const response=await fetch(url,{mode:"cors",cache:"no-store"});if(!response.ok)throw new Error(`Generator returned ${response.status}`);const blob=await response.blob();const file=new File([blob],name,{type:blob.type||"image/png"});const obj=createMediaObjectFromFile(file);obj.source="generated-free";state.assets.push(obj);await putMedia(obj);scene.assetId=obj.id;scene.genStatus="Generated and saved locally in this browser.";}
  catch(err){const obj=createRemoteImageObject(url,name,scene.prompt.trim());state.assets.push(obj);scene.assetId=obj.id;scene.genStatus="Free generator returned a remote image. Preview it; if export is blocked, save/re-import this image.";}
  renderAssets();renderScenes();renderGenScenes();renderGallery();saveMeta();drawAt(0);
}
async function generateAllImages(){
  writePromptsForAll();
  for(const s of state.scenes){ await generateSceneImage(s.id); await new Promise(r=>setTimeout(r,500)); }
}

function handleManualGeneratedImport(files){
  ingestFiles(files);
}

$$(".tab").forEach(b=>b.addEventListener("click",()=>{
  $$(".tab").forEach(x=>x.classList.remove("active"));
  $$(".section").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  $("#"+b.dataset.tab).classList.add("active");
  if(b.dataset.tab==="preview"){ setCanvasResolution(); updateKpis(); }
}));

$("#visualFiles").addEventListener("change",e=>ingestFiles(e.target.files));
$("#generatedImport").addEventListener("change",e=>handleManualGeneratedImport(e.target.files));
$("#logoFile").addEventListener("change",async e=>{const f=e.target.files[0]; if(!f)return; const obj=createMediaObjectFromFile(f); state.assets.push(obj); state.logoId=obj.id; await putMedia(obj); renderAssets(); renderGallery(); saveMeta(); drawAt(0)});
$("#narrationAudio").addEventListener("change",async e=>{const f=e.target.files[0]; if(!f)return; const obj=createMediaObjectFromFile(f); state.assets.push(obj); state.narrationId=obj.id; await putMedia(obj); saveMeta()});
$("#musicAudio").addEventListener("change",e=>setMusicFile(e.target.files[0]));

$("#buildScenes").addEventListener("click",()=>{
  const txt=$("#narrationText").value.trim(); if(!txt) return;
  state.scenes = splitNarration(txt).map(defaultScene);
  writePromptsForAll();
  renderScenes(); renderGenScenes();
  $(".tab[data-tab=story]").click();
});
$("#addBlank").addEventListener("click",()=>{ state.scenes.push(defaultScene("")); renderScenes(); renderGenScenes(); $(".tab[data-tab=story]").click() });
$("#addSceneTop").addEventListener("click",()=>{ state.scenes.push(defaultScene("")); renderScenes(); renderGenScenes() });

$("#sceneList").addEventListener("input",e=>{
  const id=e.target.dataset.id, f=e.target.dataset.field; if(!id || !f) return;
  const s=state.scenes.find(x=>x.id===id); if(!s) return;
  s[f]=f==="duration" ? Number(e.target.value) : e.target.value;
  updateKpis(); saveMeta(); drawAt(0); renderGenScenes();
});
$("#sceneList").addEventListener("click",e=>{
  const b=e.target.closest("button[data-act]"); if(!b) return;
  const i=state.scenes.findIndex(x=>x.id===b.dataset.id); if(i<0) return;
  if(b.dataset.act==="del") state.scenes.splice(i,1);
  if(b.dataset.act==="up" && i>0) [state.scenes[i-1],state.scenes[i]]=[state.scenes[i],state.scenes[i-1]];
  if(b.dataset.act==="down" && i<state.scenes.length-1) [state.scenes[i+1],state.scenes[i]]=[state.scenes[i],state.scenes[i+1]];
  if(b.dataset.act==="genprompt") state.scenes[i].prompt = buildPromptForScene(state.scenes[i], i);
  renderScenes(); renderGenScenes();
});
$("#genSceneList").addEventListener("input",e=>{
  const id=e.target.dataset.id; const f=e.target.dataset.gfield; if(!id||!f) return;
  const s=state.scenes.find(x=>x.id===id); if(!s)return; s[f]=e.target.value; saveMeta(); renderScenes();
});
$("#genSceneList").addEventListener("click",async e=>{
  const b=e.target.closest("button[data-gact]"); if(!b) return;
  const s=state.scenes.find(x=>x.id===b.dataset.id); if(!s) return;
  const i=state.scenes.indexOf(s);
  if(b.dataset.gact==="build"){ s.prompt=buildPromptForScene(s,i); renderScenes(); renderGenScenes(); saveMeta(); }
  if(b.dataset.gact==="copy"){ if(!s.prompt.trim()) s.prompt=buildPromptForScene(s,i); renderScenes(); renderGenScenes(); saveMeta(); await copyText(s.prompt); }
  if(b.dataset.gact==="generate"){ await generateSceneImage(s.id); }
});
$("#generateAllPrompts").addEventListener("click",()=>{ writePromptsForAll(); alert("Prompts written for all scenes."); });
$("#generateAllImages").addEventListener("click",generateAllImages);

$("#playPreview").addEventListener("click",playPreview);
$("#stopPreview").addEventListener("click",stopPreview);
$("#renderVideo").addEventListener("click",renderVideo);
$("#generatePublish").addEventListener("click",generatePublish);

["projectTitle","resolution","narrationVolume","musicVolume","duckMusic","mainCharacter","mainSetting","missionLook","characterPreset","gsaPreset","styleLock","promptExtras","endingLine","genProvider","genModel","genSize","genSeed"].forEach(id=>{
  $("#"+id).addEventListener("change",()=>{ saveMeta(); if(id==="resolution") setCanvasResolution(); });
});


$("#gsaPreset").addEventListener("change",e=>applyGsaPreset(e.target.value));
$("#characterPreset").addEventListener("change",e=>applyCharacterPreset(e.target.value));
$("#quickMusicAudio").addEventListener("change",e=>setMusicFile(e.target.files[0]));
$("#fitToSong").addEventListener("click",fitScenesToMusic);$("#quickBuild").addEventListener("click",quickBuild);$("#addEnding").addEventListener("click",addEndingScene);
$("#jumpImages").addEventListener("click",()=>jumpTab("images"));$("#goStoryboard").addEventListener("click",()=>jumpTab("story"));$("#goImageGen").addEventListener("click",()=>jumpTab("images"));
$$(".mobile-dock [data-jump]").forEach(b=>b.addEventListener("click",()=>jumpTab(b.dataset.jump)));
$("#shareVideo").addEventListener("click",async()=>{if(!state.renderedBlob)return;const file=new File([state.renderedBlob],state.renderedName||"gsa-video.mp4",{type:state.renderedBlob.type||"video/mp4"});if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:$("#projectTitle").value||"GSA Video"});}catch(e){}}else{$("#downloadLink").click();}});

$("#formatKpi").textContent = bestMime() ? (bestMime().includes("mp4") ? "MP4" : "WebM") : "Not supported";

if("serviceWorker" in navigator && location.protocol.startsWith("http")){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));}
(async()=>{await openDB();await restore();if(!$("#presetNote").textContent)applyGsaPreset($("#gsaPreset").value||"ocean-kai");})();
