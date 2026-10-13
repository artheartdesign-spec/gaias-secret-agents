(function(){
  function safeQueue(event){
    try{
      var key='gsa_event_queue_v1';
      var q=JSON.parse(localStorage.getItem(key)||'[]');
      if(!Array.isArray(q)) q=[];
      q.push(event);
      if(q.length>100) q=q.slice(q.length-100);
      localStorage.setItem(key,JSON.stringify(q));
    }catch(e){}
  }
  var posthogQueue=[];
  var posthogReady=false;
  function sendToPostHog(event){
    if(posthogReady && window.posthog && typeof window.posthog.capture==='function'){
      var props=Object.assign({},event);
      delete props.event;
      window.posthog.capture(event.event,props);
    }else{
      posthogQueue.push(event);
      if(posthogQueue.length>50) posthogQueue.shift();
    }
  }
  function startPostHog(){
    if(window.__gsaPostHogStarted) return;
    window.__gsaPostHogStarted=true;
    var script=document.createElement('script');
    script.async=true;
    script.src='https://us.i.posthog.com/static/array.js';
    script.onload=function(){
      if(!window.posthog || typeof window.posthog.init!=='function') return;
      window.posthog.init('phc_qy5YVBScRgc9t3H74zxTTDHSNGCSDuDEm3GnaNrp26x8',{
        api_host:'https://us.i.posthog.com',
        autocapture:false,
        capture_pageview:false,
        disable_session_recording:true,
        person_profiles:'identified_only',
        loaded:function(client){
          posthogReady=true;
          while(posthogQueue.length){
            var queued=posthogQueue.shift();
            var props=Object.assign({},queued);
            delete props.event;
            client.capture(queued.event,props);
          }
        }
      });
    };
    script.onerror=function(){window.__gsaPostHogLoadFailed=true;};
    document.head.appendChild(script);
  }
  startPostHog();
  window.gsaTrack=function(name,details){
    var event=Object.assign({
      event:name,
      gsa_event:true,
      page:window.location.pathname,
      timestamp:new Date().toISOString()
    },details||{});
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push(event);
    safeQueue(event);
    sendToPostHog(event);
    return event;
  };
  if(!window.__gsaPageViewTracked){
    window.__gsaPageViewTracked=true;
    setTimeout(function(){
      window.gsaTrack('gsa_page_view',{
        title:document.title||'',
        referrer:document.referrer||''
      });
    },0);
  }
})();