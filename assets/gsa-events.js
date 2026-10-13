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
    /* PostHog's browser snippet must create its queue/stub before loading array.js. */
    !function(t,e){
      var o,n,p,r;
      e.__SV||(window.posthog&&window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){
        function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=e[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}
        p||(p=t.createElement("script"),p.type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",p.onerror=function(){p=null},(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r));
        var u=e;
        void 0!==a?u=e[a]=[]:a="posthog";
        u.people=u.people||[];
        o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing opt_in_capturing has_opted_out_capturing reset get_distinct_id get_session_id".split(" ");
        for(n=0;n<o.length;n++)g(u,o[n]);
        e._i.push([i,s,a]);
      },e.__SV=1)
    }(document,window.posthog||[]);
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