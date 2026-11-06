
import fs from 'fs';
import path from 'path';

function buscarEnBiblia(texto: string){
  try{
    const filePath = path.join(process.cwd(), 'data', 'biblia.txt');
    const contenido = fs.readFileSync(filePath, 'utf-8');
    const lineas = contenido.split('\n');
    const norm = (s:string)=> s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    const t = norm(texto);
    const m = t.match(/(salmo|salmos|genesis|exodo|levitico|numeros|deuteronomio|josue|jueces|rut|1 samuel|2 samuel|1 reyes|2 reyes|1 cronicas|2 cronicas|esdras|nehemias|ester|job|proverbios|eclesiastes|cantares|isaias|jeremias|lamentaciones|ezequiel|daniel|oseas|joel|amos|abdias|jonas|miqueas|nahum|habacuc|sofonias|hageo|zacarias|malaquias|mateo|marcos|lucas|juan|hechos|romanos|1 corintios|2 corintios|galatas|efesios|filipenses|colosenses|1 tesalonicenses|2 tesalonicenses|1 timoteo|2 timoteo|tito|filemon|hebreos|santiago|1 pedro|2 pedro|1 juan|2 juan|3 juan|judas|apocalipsis)\s*(\d+)(?::(\d+))?/);
    if(!m) return null;
    let libro = m[1];
    if(libro==='salmo') libro='salmos';
    const mapa: Record<string,string> = {salmos:'Salmos', genesis:'Génesis', exodo:'Éxodo', levitico:'Levítico', numeros:'Números', deuteronomio:'Deuteronomio', josue:'Josué', jueces:'Jueces', rut:'Rut', '1 samuel':'1 Samuel', '2 samuel':'2 Samuel', '1 reyes':'1 Reyes', '2 reyes':'2 Reyes', '1 cronicas':'1 Crónicas', '2 cronicas':'2 Crónicas', esdras:'Esdras', nehemias:'Nehemías', ester:'Ester', job:'Job', proverbios:'Proverbios', eclesiastes:'Eclesiastés', cantares:'Cantares', isaias:'Isaías', jeremias:'Jeremías', lamentaciones:'Lamentaciones', ezequiel:'Ezequiel', daniel:'Daniel', oseas:'Oseas', joel:'Joel', amos:'Amós', abdias:'Abdías', jonas:'Jonás', miqueas:'Miqueas', nahum:'Nahúm', habacuc:'Habacuc', sofonias:'Sofonías', hageo:'Hageo', zacarias:'Zacarías', malaquias:'Malaquías', mateo:'Mateo', marcos:'Marcos', lucas:'Lucas', juan:'Juan', hechos:'Hechos', romanos:'Romanos', '1 corintios':'1 Corintios', '2 corintios':'2 Corintios', galatas:'Gálatas', efesios:'Efesios', filipenses:'Filipenses', colosenses:'Colosenses', '1 tesalonicenses':'1 Tesalonicenses', '2 tesalonicenses':'2 Tesalonicenses', '1 timoteo':'1 Timoteo', '2 timoteo':'2 Timoteo', tito:'Tito', filemon:'Filemón', hebreos:'Hebreos', santiago:'Santiago', '1 pedro':'1 Pedro', '2 pedro':'2 Pedro', '1 juan':'1 Juan', '2 juan':'2 Juan', '3 juan':'3 Juan', judas:'Judas', apocalipsis:'Apocalipsis'};
    const libroArchivo = mapa[libro] || libro;
    const cap = parseInt(m[2]);
    const verso = m[3] ? parseInt(m[3]) : null;
    const encontradas: string[] = [];
    for(const linea of lineas){
      const lt = linea.trim();
      if(!lt || lt.startsWith('#')) continue;
      if(verso){
        if(lt.startsWith(`${libroArchivo} ${cap}:${verso} `) || lt.startsWith(`${libroArchivo} ${cap}:${verso}\t`)) encontradas.push(lt);
      } else {
        if(lt.startsWith(`${libroArchivo} ${cap}:`)) encontradas.push(lt);
      }
    }
    if(encontradas.length===0) return null;
    return {libro: libroArchivo, cap, verso, versiculos: encontradas};
  }catch(e){ return null; }
}

export async function POST(req: Request){
  try{
    const { messages } = await req.json();
    if(!process.env.GROQ_API_KEY) return Response.json({ error: 'Falta GROQ_API_KEY en Vercel > Settings > Environment Variables' }, { status: 500 });
    const lastUser = [...messages].reverse().find((m:any)=>m.role==='user')?.content || '';
    const resultado = buscarEnBiblia(lastUser);
    if(resultado){
      let texto = `**${resultado.libro} ${resultado.cap}${resultado.verso ? ':'+resultado.verso : ''} - Reina-Valera 1909 (dominio público)**\n\n`;
      resultado.versiculos.forEach((v:string)=>{ texto += v + '\n'; });
      texto += `\n*(Texto REAL de biblia.txt RVR 1909 - No inventado por IA.)*\n`;
      texto += `\n🔗 Verificar en BibleGateway RVR1960: https://www.biblegateway.com/passage/?search=${encodeURIComponent(resultado.libro+' '+resultado.cap)}&version=RVR1960\n`;
      return Response.json({ message: texto });
    }
    // GROQ por fetch directo - SIN librería groq-sdk, así no falla el build
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        temperature: 0.2,
        max_tokens: 2000,
        messages: [
          { role: 'system', content: 'Eres El Camino, asistente bíblico de www.elcaminojuan146.lat - Juan 14:6. Para consultas bíblicas RVR 1909. Usa Reina-Valera 1909 dominio público. Si no estás seguro del texto exacto, dilo y explica el significado, NO inventes ni repitas la misma frase. Para información general, estudios, oraciones, explicaciones, responde claro y cálido en español. Usa Jehová, no Señor.' },
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
