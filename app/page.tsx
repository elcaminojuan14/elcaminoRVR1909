'use client';
import {useState} from 'react';
export default function Page(){
  const [msgs,setMsgs]=useState<any[]>([{role:'assistant', content:'Bendiciones! Soy Asistente el Camino. Para consultas bíblicas RVR 1909.'}]);
  const [input,setInput]=useState(''); const [loading,setLoading]=useState(false);
  async function send(text?:string){
    const content=text||input; if(!content.trim()) return;
    const newMsgs=[...msgs,{role:'user',content}]; setMsgs(newMsgs as any); setInput(''); setLoading(true);
    try{ const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:newMsgs})}); const data=await res.json(); if(data.error) throw new Error(data.error); setMsgs([...newMsgs,{role:'assistant',content:data.message}] as any);}catch(e:any){ setMsgs([...newMsgs,{role:'assistant',content:'Error: '+e.message}] as any);} setLoading(false);
  }
  return (<div style={{maxWidth:760,margin:'0 auto',padding:16,fontFamily:'sans-serif'}}><div style={{textAlign:'center'}}><div style={{fontSize:11,letterSpacing:2,color:'#387b5b',fontWeight:800}}>PARA CONSULTAS BÍBLICAS RVR 1909</div><h1 style={{color:'#387b5b'}}>El Camino - Juan 14:6</h1><div>Asistente el Camino.</div></div><div style={{border:'1px solid #ddd',borderRadius:12,height:500,overflowY:'auto',padding:16,display:'flex',flexDirection:'column',gap:12}}>{msgs.map((m:any,i:number)=>(<div key={i} style={{alignSelf:m.role==='user'?'flex-end':'flex-start',maxWidth:'80%',padding:'10px 14px',borderRadius:12,background:m.role==='user'?'#387b5b':'white',color:m.role==='user'?'white':'black',border:'1px solid #ddd',whiteSpace:'pre-wrap'}}>{m.content}</div>))}{loading&&<div>Buscando...</div>}</div><div style={{display:'flex',gap:8,marginTop:12}}><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Pide: Salmo 50 completo" style={{flex:1,padding:12,borderRadius:8,border:'1px solid #ddd'}} /><button onClick={()=>send()} style={{padding:'12px 20px',borderRadius:8,background:'#387b5b',color:'white',border:'none'}}>Enviar</button></div></div>);
}
