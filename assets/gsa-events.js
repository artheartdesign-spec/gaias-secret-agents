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
    return event;
  };
})();