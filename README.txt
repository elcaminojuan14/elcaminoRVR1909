FIX DEFINITIVO - Sin groq-sdk
1. En GitHub, borra todo lo de elcaminoRVR1909 y sube esto: app, data, package.json, next.config.js
2. Este package.json YA NO tiene groq-sdk, así no falla el build
3. El route.ts usa fetch directo a Groq, no necesita librería
4. GROQ_API_KEY ya existe en Vercel, no la toques
5. Espera a que diga Ready y prueba Salmo 50 completo
