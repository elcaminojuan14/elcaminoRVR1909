
'use client';
import {useState,useRef,useEffect} from 'react';
const PRIMARY='#387b5b';
const LIBROS = [
  {nombre:'Génesis', cap:50},{nombre:'Éxodo', cap:40},{nombre:'Levítico', cap:27},{nombre:'Números', cap:36},{nombre:'Deuteronomio', cap:34},
  {nombre:'Josué', cap:24},{nombre:'Jueces', cap:21},{nombre:'Rut', cap:4},{nombre:'1 Samuel', cap:31},{nombre:'2 Samuel', cap:24},
  {nombre:'1 Reyes', cap:22},{nombre:'2 Reyes', cap:25},{nombre:'1 Crónicas', cap:29},{nombre:'2 Crónicas', cap:36},{nombre:'Esdras', cap:10},
  {nombre:'Nehemías', cap:13},{nombre:'Ester', cap:10},{nombre:'Job', cap:42},{nombre:'Salmos', cap:150},{nombre:'Proverbios', cap:31},
  {nombre:'Eclesiastés', cap:12},{nombre:'Cantares', cap:8},{nombre:'Isaías', cap:66},{nombre:'Jeremías', cap:52},{nombre:'Lamentaciones', cap:5},
  {nombre:'Ezequiel', cap:48},{nombre:'Daniel', cap:12},{nombre:'Oseas', cap:14},{nombre:'Joel', cap:3},{nombre:'Amós', cap:9},
  {nombre:'Abdías', cap:1},{nombre:'Jonás', cap:4},{nombre:'Miqueas', cap:7},{nombre:'Nahúm', cap:3},{nombre:'Habacuc', cap:3},
  {nombre:'Sofonías', cap:3},{nombre:'Hageo', cap:2},{nombre:'Zacarías', cap:14},{nombre:'Malaquías', cap:4},
  {nombre:'Mateo', cap:28},{nombre:'Marcos', cap:16},{nombre:'Lucas', cap:24},{nombre:'Juan', cap:21},{nombre:'Hechos', cap:28},
  {nombre:'Romanos', cap:16},{nombre:'1 Corintios', cap:16},{nombre:'2 Corintios', cap:13},{nombre:'Gálatas', cap:6},{nombre:'Efesios', cap:6},
  {nombre:'Filipenses', cap:4},{nombre:'Colosenses', cap:4},{nombre:'1 Tesalonicenses', cap:5},{nombre:'2 Tesalonicenses', cap:3},{nombre:'1 Timoteo', cap:6},
  {nombre:'2 Timoteo', cap:4},{nombre:'Tito', cap:3},{nombre:'Filemón', cap:1},{nombre:'Hebreos', cap:13},{nombre:'Santiago', cap:5},
  {nombre:'1 Pedro', cap:5},{nombre:'2 Pedro', cap:3},{nombre:'1 Juan', cap:5},{nombre:'2 Juan', cap:1},{nombre:'3 Juan', cap:1},
  {nombre:'Judas', cap:1},{nombre:'Apocalipsis', cap:22},
];
export default function Page(){
  const [msgs,setMsgs]=useState<any[]>([{role:'assistant', content:'Bendiciones! Soy Asistente el Camino. Para consultas bíblicas RVR 1909. Usa el menú de abajo para buscar cualquier libro y capítulo de la Biblia, o escríbeme una pregunta general.'}]);
  const [input,setInput]=useState(''); const [loading,setLoading]=useState(false);
  const [libro,setLibro]=useState('Salmos'); const [capitulo,setCapitulo]=useState('50');
  const endRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}); },[msgs,loading]);
  const libroActual = LIBROS.find(l=>l.nombre===libro);
  async function send(text?:string){
    const content = text || input; if(!content.trim()) return;
    const newMsgs = [...msgs, {role:'user', content}]; setMsgs(newMsgs as any); setInput(''); setLoading(true);
    try{
      const res = await fetch('/api/chat', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({messages: newMsgs})});
      const data = await res.json(); if(data.error) throw new Error(data.error);
      setMsgs([...newMsgs, {role:'assistant', content: data.message}] as any);
    }catch(e:any){ setMsgs([...newMsgs, {role:'assistant', content: 'Error: '+ e.message}] as any); }
    setLoading(false);
  }
  function buscarMenu(){
    send(`${libro} ${capitulo} completo`);
  }
  function printChat(){
    const w = window.open('', '_blank'); if(!w) return;
    let html = '<html><head><title>El Camino - Juan 14:6</title><style>body{font-family:sans-serif;padding:20px} .header{text-align:center;border-bottom:3px solid #387b5b;padding-bottom:12px} .msg{margin:12px 0;padding:10px;border-radius:12px} .user{background:#387b5b;color:white;text-align:right} .assistant{background:#f5f5f0;border:1px solid #ddd}</style></head><body>';
    html += '<div class="header"><div style="font-size:12px;letter-spacing:2px;color:#387b5b;font-weight:700">PARA CONSULTAS BÍBLICAS RVR 1909</div><h1 style="color:#387b5b;margin:6px 0">El Camino - Juan 14:6</h1><div>Asistente el Camino • www.elcaminojuan146.lat</div><div>'+ new Date().toLocaleString() +'</div></div>';
    msgs.forEach((m:any)=>{ html += '<div class="msg '+ m.role +'"><b>'+ (m.role==='user'?'Tu':'Asistente el Camino') +':</b><br/>'+ m.content.replace(/\n/g,'<br/>') +'</div>'; });
    html += '</body></html>'; w.document.write(html); w.document.close(); w.print();
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
          <div style={{flex:1, fontSize:12, color:'#6b6a63'}}>Biblia RVR 1909 en TXT • Menú completo de 66 libros</div>
          <button onClick={printChat} style={{width:36, height:36, borderRadius:10, border:'1px solid #e8e5de', cursor:'pointer'}}>🖨️</button>
          <button onClick={clearChat} style={{width:36, height:36, borderRadius:10, border:'1px solid #f0c0c0', background:'#fff5f5', cursor:'pointer'}}>🗑️</button>
        </div>
        <div style={{flex:1, background:'white', borderRadius:20, border:'1px solid #e8e5de', display:'flex', flexDirection:'column', overflow:'hidden', height:620}}>
          <div style={{flex:1, overflowY:'auto', padding:20, display:'flex', flexDirection:'column', gap:12, background:'#fdfcf8'}}>
            {msgs.map((m:any,i:number)=>(
              <div key={i} style={{display:'flex', gap:10, justifyContent: m.role==='user'?'flex-end':'flex-start'}}>
                <div style={{maxWidth:'78%', padding:'12px 16px', borderRadius: m.role==='user'?'18px 18px 4px 18px':'4px 18px 18px 18px', background: m.role==='user'?PRIMARY:'white', color: m.role==='user'?'white':'#2b2a27', border: m.role==='user'?'none':'1px solid #e8e5de', fontSize:14, whiteSpace:'pre-wrap'}}>{m.content}</div>
              </div>
            ))}
            {loading && <div style={{padding:'12px 16px', borderRadius:'4px 18px 18px 18px', background:'white', border:'1px solid #e8e5de'}}>Buscando en biblia.txt RVR 1909...</div>}
            <div ref={endRef}></div>
          </div>
          {/* MENÚ COMPLETO DE LA BIBLIA - SIN BOTONES SUELTOS */}
          <div style={{padding:'12px 20px', background:'#f6f5f0', borderTop:'1px solid #e8e5de'}}>
            <div style={{fontSize:11, fontWeight:700, color:PRIMARY, marginBottom:6}}>📖 MENÚ DE LA BIBLIA - Busca cualquier libro y capítulo</div>
            <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
              <select value={libro} onChange={e=>{ setLibro(e.target.value); setCapitulo('1'); }} style={{flex:1, minWidth:140, padding:'10px 12px', borderRadius:12, border:'1px solid #e8e5de', background:'white', fontSize:13}}>
                <optgroup label="Antiguo Testamento">
                  {LIBROS.slice(0,39).map(l=>(<option key={l.nombre} value={l.nombre}>{l.nombre}</option>))}
                </optgroup>
                <optgroup label="Nuevo Testamento">
                  {LIBROS.slice(39).map(l=>(<option key={l.nombre} value={l.nombre}>{l.nombre}</option>))}
                </optgroup>
              </select>
              <select value={capitulo} onChange={e=>setCapitulo(e.target.value)} style={{width:90, padding:'10px 12px', borderRadius:12, border:'1px solid #e8e5de', background:'white', fontSize:13}}>
                {Array.from({length: libroActual?.cap || 1}, (_,i)=>i+1).map(n=>(<option key={n} value={String(n)}>Cap. {n}</option>))}
              </select>
              <button onClick={buscarMenu} style={{padding:'10px 16px', borderRadius:12, background:PRIMARY, color:'white', border:'none', fontWeight:700, cursor:'pointer'}}>Buscar 📖</button>
            </div>
            <div style={{fontSize:11, color:'#888', marginTop:6}}>Ejemplo: Salmos Cap. 50 → Buscar. Si el capítulo aún no está en biblia.txt, te dirá que lo agregues desde eBible.org.</div>
          </div>
          <div style={{padding:14, borderTop:'1px solid #e8e5de', background:'white', display:'flex', gap:8}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="O escribe una pregunta general: ¿Qué es la fe?" style={{flex:1, padding:'12px 16px', borderRadius:24, border:'1px solid #e8e5de', background:'#f6f5f0'}} />
            <button onClick={()=>send()} style={{width:42, height:42, borderRadius:12, background:input.trim()?PRIMARY:'#e8e5de', color:'white', border:'none', cursor:'pointer'}}>↑</button>
          </div>
        </div>
        <div style={{fontSize:11, color:'#888', textAlign:'center'}}>Para consultas bíblicas RVR 1909 • El Camino - Juan 14:6 • Asistente el Camino • www.elcaminojuan146.lat</div>
      </div>
    </div>
  );
}
