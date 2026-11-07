
'use client';
import {useState,useRef,useEffect} from 'react';
const PRIMARY='#387b5b';
export default function Page(){
  const [msgs,setMsgs]=useState<any[]>([{role:'assistant', content:'Bendiciones! Soy Asistente el Camino. Para consultas bíblicas RVR 1909. Escríbeme: Salmo 50 completo, Juan 14:6, o una pregunta general como ¿Qué es la fe?'}]);
  const [input,setInput]=useState(''); const [loading,setLoading]=useState(false);
  const endRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}); },[msgs,loading]);
  async function send(text?:string){
    const content=text||input; if(!content.trim()) return;
    const newMsgs=[...msgs,{role:'user',content}]; setMsgs(newMsgs as any); setInput(''); setLoading(true);
    try{ const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:newMsgs})}); const data=await res.json(); if(data.error) throw new Error(data.error); setMsgs([...newMsgs,{role:'assistant',content:data.message}] as any);}catch(e:any){ setMsgs([...newMsgs,{role:'assistant',content:'Error: '+e.message}] as any);} setLoading(false);
  }
  function printChat(){
    const w=window.open('', '_blank'); if(!w) return;
    let html='<html><head><title>El Camino - Juan 14:6</title><style>body{font-family:sans-serif;padding:20px} .header{text-align:center;border-bottom:3px solid #387b5b;padding-bottom:12px} .msg{margin:12px 0;padding:10px;border-radius:12px} .user{background:#387b5b;color:white;text-align:right} .assistant{background:#f5f5f0;border:1px solid #ddd}</style></head><body>';
    html+='<div class="header"><div style="font-size:12px;letter-spacing:2px;color:#387b5b;font-weight:700">PARA CONSULTAS BÍBLICAS RVR 1909</div><h1 style="color:#387b5b;margin:6px 0">El Camino - Juan 14:6</h1><div>Asistente el Camino • www.elcaminojuan146.lat</div><div>'+new Date().toLocaleString()+'</div></div>';
    msgs.forEach((m:any)=>{ html+='<div class="msg '+m.role+'"><b>'+(m.role==='user'?'Tu':'Asistente el Camino')+':</b><br/>'+m.content.replace(/\n/g,'<br/>')+'</div>'; });
    html+='</body></html>'; w.document.write(html); w.document.close(); w.print();
  }
  function clearChat(){ if(confirm('¿Borrar chat?')) setMsgs([{role:'assistant', content:'Historial borrado. Bendiciones! Soy Asistente el Camino.'}]); }
  return (
    <div style={{minHeight:'100vh', background:'#f6f5f0', display:'flex', justifyContent:'center', padding:16}}>
      <div style={{width:'100%', maxWidth:760, display:'flex', flexDirection:'column', gap:12}}>
        <div style={{background:'white', borderRadius:20, padding:'20px 20px 16px', textAlign:'center', border:'1px solid #e8e5de'}}>
          <div style={{fontSize:11, letterSpacing:2, color:PRIMARY, fontWeight:800}}>PARA CONSULTAS BÍBLICAS RVR 1909</div>
          <div style={{fontWeight:800, fontSize:22, color:PRIMARY, margin:'6px 0 2px'}}>El Camino - Juan 14:6</div>
          <div style={{fontSize:13, color:'#6b6a63'}}>Asistente el Camino.</div>
        </div>
        <div style={{background:'white', borderRadius:20, padding:'12px 16px', display:'flex', alignItems:'center', gap:12, border:'1px solid #e8e5de'}}>
          <div style={{width:40, height:40, borderRadius:12, background:PRIMARY, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>✝️</div>
          <div style={{flex:1, fontSize:12, color:'#6b6a63'}}>Biblia RVR 1909 de internet • Simple, sin TXT</div>
          <button onClick={printChat} title="Imprimir" style={{width:36, height:36, borderRadius:10, border:'1px solid #e8e5de', cursor:'pointer', background:'white'}}>🖨️</button>
          <button onClick={clearChat} title="Borrar" style={{width:36, height:36, borderRadius:10, border:'1px solid #f0c0c0', background:'#fff5f5', cursor:'pointer'}}>🗑️</button>
        </div>
        <div style={{flex:1, background:'white', borderRadius:20, border:'1px solid #e8e5de', display:'flex', flexDirection:'column', overflow:'hidden', height:620}}>
          <div style={{flex:1, overflowY:'auto', padding:20, display:'flex', flexDirection:'column', gap:12, background:'#fdfcf8'}}>
            {msgs.map((m:any,i:number)=>(
              <div key={i} style={{display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start'}}>
                <div style={{maxWidth:'78%', padding:'12px 16px', borderRadius:m.role==='user'?'18px 18px 4px 18px':'4px 18px 18px 18px', background:m.role==='user'?PRIMARY:'white', color:m.role==='user'?'white':'#2b2a27', border:m.role==='user'?'none':'1px solid #e8e5de', fontSize:14, whiteSpace:'pre-wrap'}}>{m.content}</div>
              </div>
            ))}
            {loading && <div style={{padding:'12px 16px', borderRadius:'4px 18px 18px 18px', background:'white', border:'1px solid #e8e5de'}}>Buscando RVR 1909 en internet...</div>}
            <div ref={endRef}></div>
          </div>
          <div style={{padding:14, borderTop:'1px solid #e8e5de', background:'white', display:'flex', gap:8}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Escribe: Salmo 50 completo o ¿Qué es la fe?" style={{flex:1, padding:'12px 16px', borderRadius:24, border:'1px solid #e8e5de', background:'#f6f5f0'}} />
            <button onClick={()=>send()} style={{width:42, height:42, borderRadius:12, background:input.trim()?PRIMARY:'#e8e5de', color:'white', border:'none', cursor:'pointer'}}>↑</button>
          </div>
        </div>
        <div style={{fontSize:11, color:'#888', textAlign:'center'}}>Para consultas bíblicas RVR 1909 • El Camino - Juan 14:6 • Asistente el Camino • www.elcaminojuan146.lat</div>
      </div>
    </div>
  );
}
