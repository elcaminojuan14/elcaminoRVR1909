
import fs from 'fs';
import path from 'path';

// Mapa: nombre español -> código eBible + nombre para URL
const LIBROS: Record<string, {codigo: string, nombre: string}> = {
  'genesis': {codigo: 'GEN', nombre: 'Génesis'}, 'exodo': {codigo: 'EXO', nombre: 'Éxodo'}, 'levitico': {codigo: 'LEV', nombre: 'Levítico'},
  'numeros': {codigo: 'NUM', nombre: 'Números'}, 'deuteronomio': {codigo: 'DEU', nombre: 'Deuteronomio'},
  'josue': {codigo: 'JOS', nombre: 'Josué'}, 'jueces': {codigo: 'JDG', nombre: 'Jueces'}, 'rut': {codigo: 'RUT', nombre: 'Rut'},
  '1 samuel': {codigo: '1SA', nombre: '1 Samuel'}, '2 samuel': {codigo: '2SA', nombre: '2 Samuel'},
  '1 reyes': {codigo: '1KI', nombre: '1 Reyes'}, '2 reyes': {codigo: '2KI', nombre: '2 Reyes'},
  '1 cronicas': {codigo: '1CH', nombre: '1 Crónicas'}, '2 cronicas': {codigo: '2CH', nombre: '2 Crónicas'},
  'esdras': {codigo: 'EZR', nombre: 'Esdras'}, 'nehemias': {codigo: 'NEH', nombre: 'Nehemías'}, 'ester': {codigo: 'EST', nombre: 'Ester'},
  'job': {codigo: 'JOB', nombre: 'Job'}, 'salmos': {codigo: 'PSA', nombre: 'Salmos'}, 'proverbios': {codigo: 'PRO', nombre: 'Proverbios'},
  'eclesiastes': {codigo: 'ECC', nombre: 'Eclesiastés'}, 'cantares': {codigo: 'SNG', nombre: 'Cantares'},
  'isaias': {codigo: 'ISA', nombre: 'Isaías'}, 'jeremias': {codigo: 'JER', nombre: 'Jeremías'}, 'lamentaciones': {codigo: 'LAM', nombre: 'Lamentaciones'},
  'ezequiel': {codigo: 'EZK', nombre: 'Ezequiel'}, 'daniel': {codigo: 'DAN', nombre: 'Daniel'}, 'oseas': {codigo: 'HOS', nombre: 'Oseas'},
  'joel': {codigo: 'JOL', nombre: 'Joel'}, 'amos': {codigo: 'AMO', nombre: 'Amós'}, 'abdias': {codigo: 'OBA', nombre: 'Abdías'},
  'jonas': {codigo: 'JON', nombre: 'Jonás'}, 'miqueas': {codigo: 'MIC', nombre: 'Miqueas'}, 'nahum': {codigo: 'NAM', nombre: 'Nahúm'},
  'habacuc': {codigo: 'HAB', nombre: 'Habacuc'}, 'sofonias': {codigo: 'ZEP', nombre: 'Sofonías'}, 'hageo': {codigo: 'HAG', nombre: 'Hageo'},
  'zacarias': {codigo: 'ZEC', nombre: 'Zacarías'}, 'malaquias': {codigo: 'MAL', nombre: 'Malaquías'},
  'mateo': {codigo: 'MAT', nombre: 'Mateo'}, 'marcos': {codigo: 'MRK', nombre: 'Marcos'}, 'lucas': {codigo: 'LUK', nombre: 'Lucas'},
  'juan': {codigo: 'JHN', nombre: 'Juan'}, 'hechos': {codigo: 'ACT', nombre: 'Hechos'}, 'romanos': {codigo: 'ROM', nombre: 'Romanos'},
  '1 corintios': {codigo: '1CO', nombre: '1 Corintios'}, '2 corintios': {codigo: '2CO', nombre: '2 Corintios'},
  'galatas': {codigo: 'GAL', nombre: 'Gálatas'}, 'efesios': {codigo: 'EPH', nombre: 'Efesios'},
  'filipenses': {codigo: 'PHP', nombre: 'Filipenses'}, 'colosenses': {codigo: 'COL', nombre: 'Colosenses'},
  '1 tesalonicenses': {codigo: '1TH', nombre: '1 Tesalonicenses'}, '2 tesalonicenses': {codigo: '2TH', nombre: '2 Tesalonicenses'},
  '1 timoteo': {codigo: '1TI', nombre: '1 Timoteo'}, '2 timoteo': {codigo: '2TI', nombre: '2 Timoteo'},
  'tito': {codigo: 'TIT', nombre: 'Tito'}, 'filemon': {codigo: 'PHM', nombre: 'Filemón'}, 'hebreos': {codigo: 'HEB', nombre: 'Hebreos'},
  'santiago': {codigo: 'JAS', nombre: 'Santiago'}, '1 pedro': {codigo: '1PE', nombre: '1 Pedro'}, '2 pedro': {codigo: '2PE', nombre: '2 Pedro'},
  '1 juan': {codigo: '1JN', nombre: '1 Juan'}, '2 juan': {codigo: '2JN', nombre: '2 Juan'}, '3 juan': {codigo: '3JN', nombre: '3 Juan'},
  'judas': {codigo: 'JUD', nombre: 'Judas'}, 'apocalipsis': {codigo: 'REV', nombre: 'Apocalipsis'},
};

function parsearPedido(texto: string){
  const norm = (s:string)=> s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const t = norm(texto);
  const m = t.match(/(salmo|salmos|genesis|exodo|levitico|numeros|deuteronomio|josue|jueces|rut|1 samuel|2 samuel|1 reyes|2 reyes|1 cronicas|2 cronicas|esdras|nehemias|ester|job|proverbios|eclesiastes|cantares|isaias|jeremias|lamentaciones|ezequiel|daniel|oseas|joel|amos|abdias|jonas|miqueas|nahum|habacuc|sofonias|hageo|zacarias|malaquias|mateo|marcos|lucas|juan|hechos|romanos|1 corintios|2 corintios|galatas|efesios|filipenses|colosenses|1 tesalonicenses|2 tesalonicenses|1 timoteo|2 timoteo|tito|filemon|hebreos|santiago|1 pedro|2 pedro|1 juan|2 juan|3 juan|judas|apocalipsis)\s*(\d+)(?::(\d+))?/);
  if(!m) return null;
  let key = m[1]; if(key==='salmo') key='salmos';
  const info = LIBROS[key]; if(!info) return null;
  return { libro: info.nombre, codigo: info.codigo, cap: parseInt(m[2]), verso: m[3] ? parseInt(m[3]) : null };
}

function buscarLocal(libro: string, cap: number, verso: number | null){
  try{
    const filePath = path.join(process.cwd(), 'data', 'biblia.txt');
    const contenido = fs.readFileSync(filePath, 'utf-8');
    const encontradas: string[] = [];
    for(const linea of contenido.split('\n')){
      const lt = linea.trim();
      if(!lt || lt.startsWith('#')) continue;
      if(verso){
        if(lt.startsWith(`${libro} ${cap}:${verso} `)) encontradas.push(lt);
      } else {
        if(lt.startsWith(`${libro} ${cap}:`)) encontradas.push(lt);
      }
    }
    return encontradas.length ? encontradas : null;
  }catch{ return null; }
}

// Buscar en eBible.org - RVR 1909 dominio público - TODA LA BIBLIA
async function buscarEnEBible(libro: string, codigo: string, cap: number, verso: number | null){
  try{
    // eBible: https://ebible.org/spaRV1909/GEN01.htm , 1CH01.htm, PSA050.htm, etc.
    const capStr = String(cap).padStart(2, '0');
    const url = `https://ebible.org/spaRV1909/${codigo}${capStr}.htm`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if(!res.ok) return null;
    let html = await res.text();
    // Quitar scripts, estilos, navegación
    html = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
    // Buscar versículos: eBible pone <span class="v">1</span> texto o <b>1</b> texto
    // Estrategia simple: quitar tags, quedarnos con texto plano y buscar líneas con número
    // Mejor: buscar todos los <p> que contienen versículos
    const versiculos: string[] = [];
    // Intentar con formato: <span class="verse" ...> o data-verse
    // Fallback: extraer texto plano y dividir por patrones " 1 ", " 2 ", etc.
    // Sacar solo el cuerpo del capítulo: entre <div class="chapter" y fin
    let cuerpo = html;
    const mBody = html.match(/<body[\s\S]*?<\/body>/i);
    if(mBody) cuerpo = mBody[0];
    // Quitar tags pero dejar saltos
    let texto = cuerpo.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<\/div>/gi, '\n').replace(/<[^>]+>/g, ' ');
    texto = texto.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
    // eBible pone los versículos como "1 ADAM, Seth..." - buscamos secuencias número + texto
    // Dividir por " N " donde N es número de versículo
    // Primero, quitar encabezado "1 Crónicas 1" etc.
    // Buscar el primer versículo
    const regex = /(\d+)\s+([^0-9]+?)(?=\s+\d+\s+[^0-9]|$)/g;
    let match;
    const temp: {n:number, t:string}[] = [];
    while((match = regex.exec(texto)) !== null){
      const n = parseInt(match[1]);
      const t = match[2].trim();
      if(n>=1 && n<=200 && t.length>2 && t.length<2000){
        temp.push({n, t});
      }
      if(temp.length>200) break;
    }
    // Filtrar: solo si tenemos al menos 3 versículos y los números son consecutivos desde 1
    if(temp.length>=3 && temp[0].n===1){
      // Ordenar y quitar duplicados
      const vistos = new Set<number>();
      for(const v of temp){
        if(!vistos.has(v.n)){
          vistos.add(v.n);
          if(verso){
            if(v.n===verso) versiculos.push(`${libro} ${cap}:${v.n} ${v.t}`);
          } else {
            versiculos.push(`${libro} ${cap}:${v.n} ${v.t}`);
          }
        }
      }
      if(versiculos.length>0) return versiculos;
    }
    return null;
  }catch(e){ return null; }
}

export async function POST(req: Request){
  try{
    const { messages } = await req.json();
    if(!process.env.GROQ_API_KEY) return Response.json({ error: 'Falta GROQ_API_KEY en Vercel' }, { status: 500 });
    const lastUser = [...messages].reverse().find((m:any)=>m.role==='user')?.content || '';
    const pedido = parsearPedido(lastUser);

    if(pedido){
      // 1) Primero local biblia.txt
      const local = buscarLocal(pedido.libro, pedido.cap, pedido.verso);
      if(local){
        let texto = `**${pedido.libro} ${pedido.cap}${pedido.verso ? ':'+pedido.verso : ''} - Reina-Valera 1909 (dominio público)**\n\n`;
        local.forEach((v:string)=>{ texto += v + '\n'; });
        texto += `\n*(Texto REAL de biblia.txt RVR 1909 - No inventado por IA.)*\n`;
        return Response.json({ message: texto });
      }
      // 2) Si no está local, buscar TODA LA BIBLIA en eBible.org
      const ebible = await buscarEnEBible(pedido.libro, pedido.codigo, pedido.cap, pedido.verso);
      if(ebible){
        let texto = `**${pedido.libro} ${pedido.cap}${pedido.verso ? ':'+pedido.verso : ''} - Reina-Valera 1909 (dominio público - eBible.org)**\n\n`;
        ebible.forEach((v:string)=>{ texto += v + '\n'; });
        texto += `\n*(Texto REAL de eBible.org RVR 1909 - No inventado por IA. Fuente: https://ebible.org/spaRV1909/ )*\n`;
        texto += `\n🔗 Verificar: https://www.biblegateway.com/passage/?search=${encodeURIComponent(pedido.libro+' '+pedido.cap)}&version=RVR1960\n`;
        return Response.json({ message: texto });
      }
      // 3) Si ni local ni eBible lo tiene -> NO INVENTAR
      const nombre = `${pedido.libro} ${pedido.cap}${pedido.verso ? ':'+pedido.verso : ''}`;
      return Response.json({ message: `⚠️ **${nombre} no se pudo cargar desde eBible.org en este momento.**\n\nPara no inventar versículos, no te doy un texto inventado.\n\nPuedes verlo aquí:\n🔗 https://www.biblegateway.com/passage/?search=${encodeURIComponent(nombre)}&version=RVR1960\n\nIntenta de nuevo en un momento.` });
    }

    // Pregunta general -> Groq
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        temperature: 0.2,
        max_tokens: 2000,
        messages: [
          { role: 'system', content: 'Eres Asistente el Camino, asistente bíblico de www.elcaminojuan146.lat - Juan 14:6. Si te preguntan como te llamas, di: Soy Asistente el Camino. Si te saludan, saluda con Bendiciones. NUNCA inventes versículos ni capítulos de la Biblia. Para preguntas generales, estudios, oraciones, explicaciones, responde claro y cálido en español. Usa Jehová, no Señor.' },
          ...messages.slice(-5).map((m:any)=>({ role: m.role, content: m.content })),
        ]
      })
    });
    const data = await res.json();
    if(!res.ok) return Response.json({ error: data?.error?.message || 'Error en Groq' }, { status: 500 });
    return Response.json({ message: data.choices?.[0]?.message?.content || 'Sin respuesta' });
  }catch(e:any){
    console.error(e);
    return Response.json({ error: e.message || 'Error en Groq' }, { status: 500 });
  }
}
