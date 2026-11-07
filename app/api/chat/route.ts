
const LIBROS: Record<string, {nombre: string, bolls: number}> = {
  'genesis': {nombre: 'Génesis', bolls: 1}, 'exodo': {nombre: 'Éxodo', bolls: 2},
  'levitico': {nombre: 'Levítico', bolls: 3}, 'numeros': {nombre: 'Números', bolls: 4},
  'deuteronomio': {nombre: 'Deuteronomio', bolls: 5}, 'josue': {nombre: 'Josué', bolls: 6},
  'jueces': {nombre: 'Jueces', bolls: 7}, 'rut': {nombre: 'Rut', bolls: 8},
  '1 samuel': {nombre: '1 Samuel', bolls: 9}, '2 samuel': {nombre: '2 Samuel', bolls: 10},
  '1 reyes': {nombre: '1 Reyes', bolls: 11}, '2 reyes': {nombre: '2 Reyes', bolls: 12},
  '1 cronicas': {nombre: '1 Crónicas', bolls: 13}, '2 cronicas': {nombre: '2 Crónicas', bolls: 14},
  'esdras': {nombre: 'Esdras', bolls: 15}, 'nehemias': {nombre: 'Nehemías', bolls: 16},
  'ester': {nombre: 'Ester', bolls: 17}, 'job': {nombre: 'Job', bolls: 18},
  'salmos': {nombre: 'Salmos', bolls: 19}, 'proverbios': {nombre: 'Proverbios', bolls: 20},
  'eclesiastes': {nombre: 'Eclesiastés', bolls: 21}, 'cantares': {nombre: 'Cantares', bolls: 22},
  'isaias': {nombre: 'Isaías', bolls: 23}, 'jeremias': {nombre: 'Jeremías', bolls: 24},
  'lamentaciones': {nombre: 'Lamentaciones', bolls: 25}, 'ezequiel': {nombre: 'Ezequiel', bolls: 26},
  'daniel': {nombre: 'Daniel', bolls: 27}, 'oseas': {nombre: 'Oseas', bolls: 28},
  'joel': {nombre: 'Joel', bolls: 29}, 'amos': {nombre: 'Amós', bolls: 30},
  'abdias': {nombre: 'Abdías', bolls: 31}, 'jonas': {nombre: 'Jonás', bolls: 32},
  'miqueas': {nombre: 'Miqueas', bolls: 33}, 'nahum': {nombre: 'Nahúm', bolls: 34},
  'habacuc': {nombre: 'Habacuc', bolls: 35}, 'sofonias': {nombre: 'Sofonías', bolls: 36},
  'hageo': {nombre: 'Hageo', bolls: 37}, 'zacarias': {nombre: 'Zacarías', bolls: 38},
  'malaquias': {nombre: 'Malaquías', bolls: 39}, 'mateo': {nombre: 'Mateo', bolls: 40},
  'marcos': {nombre: 'Marcos', bolls: 41}, 'lucas': {nombre: 'Lucas', bolls: 42},
  'juan': {nombre: 'Juan', bolls: 43}, 'hechos': {nombre: 'Hechos', bolls: 44},
  'romanos': {nombre: 'Romanos', bolls: 45}, '1 corintios': {nombre: '1 Corintios', bolls: 46},
  '2 corintios': {nombre: '2 Corintios', bolls: 47}, 'galatas': {nombre: 'Gálatas', bolls: 48},
  'efesios': {nombre: 'Efesios', bolls: 49}, 'filipenses': {nombre: 'Filipenses', bolls: 50},
  'colosenses': {nombre: 'Colosenses', bolls: 51}, '1 tesalonicenses': {nombre: '1 Tesalonicenses', bolls: 52},
  '2 tesalonicenses': {nombre: '2 Tesalonicenses', bolls: 53}, '1 timoteo': {nombre: '1 Timoteo', bolls: 54},
  '2 timoteo': {nombre: '2 Timoteo', bolls: 55}, 'tito': {nombre: 'Tito', bolls: 56},
  'filemon': {nombre: 'Filemón', bolls: 57}, 'hebreos': {nombre: 'Hebreos', bolls: 58},
  'santiago': {nombre: 'Santiago', bolls: 59}, '1 pedro': {nombre: '1 Pedro', bolls: 60},
  '2 pedro': {nombre: '2 Pedro', bolls: 61}, '1 juan': {nombre: '1 Juan', bolls: 62},
  '2 juan': {nombre: '2 Juan', bolls: 63}, '3 juan': {nombre: '3 Juan', bolls: 64},
  'judas': {nombre: 'Judas', bolls: 65}, 'apocalipsis': {nombre: 'Apocalipsis', bolls: 66},
};

function parsearPedido(texto: string){
  const norm = (s:string)=> s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const t = norm(texto);
  const m = t.match(/(salmo|salmos|genesis|exodo|levitico|numeros|deuteronomio|josue|jueces|rut|1 samuel|2 samuel|1 reyes|2 reyes|1 cronicas|2 cronicas|esdras|nehemias|ester|job|proverbios|eclesiastes|cantares|isaias|jeremias|lamentaciones|ezequiel|daniel|oseas|joel|amos|abdias|jonas|miqueas|nahum|habacuc|sofonias|hageo|zacarias|malaquias|mateo|marcos|lucas|juan|hechos|romanos|1 corintios|2 corintios|galatas|efesios|filipenses|colosenses|1 tesalonicenses|2 tesalonicenses|1 timoteo|2 timoteo|tito|filemon|hebreos|santiago|1 pedro|2 pedro|1 juan|2 juan|3 juan|judas|apocalipsis)\s*(\d+)(?::(\d+))?/);
  if(!m) return null;
  let key = m[1]; if(key==='salmo') key='salmos';
  const info = LIBROS[key]; if(!info) return null;
  return { libro: info.nombre, bolls: info.bolls, cap: parseInt(m[2]), verso: m[3] ? parseInt(m[3]) : null };
}

async function buscarEnInternet(libro: string, bolls: number, cap: number, verso: number | null){
  try{
    const res = await fetch(`https://bolls.life/get-text/RVR/${bolls}/${cap}/`, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if(!res.ok) return null;
    const data = await res.json();
    if(!Array.isArray(data) || data.length===0) return null;
    const versiculos: string[] = [];
    for(const v of data){
      const n = v.verse;
      const t = (v.text || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g,' ').trim();
      if(!t) continue;
      if(verso){ if(n===verso) versiculos.push(`${libro} ${cap}:${n} ${t}`); }
      else versiculos.push(`${libro} ${cap}:${n} ${t}`);
    }
    return versiculos.length ? versiculos : null;
  }catch{ return null; }
}

export async function POST(req: Request){
  try{
    const { messages } = await req.json();
    if(!process.env.GROQ_API_KEY) return Response.json({ error: 'Falta GROQ_API_KEY en Vercel' }, { status: 500 });
    const lastUser = [...messages].reverse().find((m:any)=>m.role==='user')?.content || '';
    const pedido = parsearPedido(lastUser);

    // Si pide Biblia -> SIEMPRE de internet RVR 1909, nunca inventar, nunca TXT
    if(pedido){
      const biblia = await buscarEnInternet(pedido.libro, pedido.bolls, pedido.cap, pedido.verso);
      if(biblia){
        let texto = `**${pedido.libro} ${pedido.cap}${pedido.verso ? ':'+pedido.verso : ''} - Reina-Valera 1909**\n\n`;
        biblia.forEach((v:string)=>{ texto += v + '\n'; });
        texto += `\n*(Texto REAL de internet RVR 1909 - No inventado por IA.)*\n`;
        return Response.json({ message: texto });
      }
      const nombre = `${pedido.libro} ${pedido.cap}${pedido.verso ? ':'+pedido.verso : ''}`;
      return Response.json({ message: `⚠️ **${nombre} no se pudo cargar de internet en este momento.**\n\nPara no inventar versículos, no te doy un texto inventado.\n\nPuedes verlo aquí:\n🔗 https://www.biblegateway.com/passage/?search=${encodeURIComponent(nombre)}&version=RVR1960\n\nIntenta de nuevo en un momento.` });
    }

    // Pregunta general -> Groq
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b', temperature: 0.2, max_tokens: 2000,
        messages: [
          { role: 'system', content: 'Eres Asistente el Camino, asistente bíblico de www.elcaminojuan146.lat - Juan 14:6. Si te preguntan como te llamas, di: Soy Asistente el Camino. Si te saludan, saluda con Bendiciones. NUNCA inventes versículos ni capítulos de la Biblia. Para preguntas generales, estudios, oraciones, explicaciones, responde claro y cálido en español. Usa Jehová, no Señor.' },
          ...messages.slice(-5).map((m:any)=>({ role: m.role, content: m.content })),
        ]
      })
    });
    const data = await res.json();
    if(!res.ok) return Response.json({ error: data?.error?.message || 'Error en Groq' }, { status: 500 });
    return Response.json({ message: data.choices?.[0]?.message?.content || 'Sin respuesta' });
  }catch(e:any){ console.error(e); return Response.json({ error: e.message || 'Error en Groq' }, { status: 500 }); }
}
