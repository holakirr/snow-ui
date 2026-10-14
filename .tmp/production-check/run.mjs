import {readFileSync,writeFileSync} from 'node:fs'
import {request} from '@playwright/test'
import {spawn} from 'node:child_process'
const secrets=process.env.SNOWUI_SITE_AUTOMATION_SECRET && process.env.SNOWUI_DEMO_AUTOMATION_SECRET ? {SNOWUI_SITE_AUTOMATION_SECRET:process.env.SNOWUI_SITE_AUTOMATION_SECRET,SNOWUI_DEMO_AUTOMATION_SECRET:process.env.SNOWUI_DEMO_AUTOMATION_SECRET} : JSON.parse(readFileSync(new URL('./secrets.json',import.meta.url),'utf8'))
const root=new URL('../../',import.meta.url).pathname
const origin='https://snow-ui.holakirr.com'
const bootstrap=await request.newContext()
try {
  const initial=await bootstrap.get(origin+'/',{headers:{'x-vercel-protection-bypass':secrets.SNOWUI_SITE_AUTOMATION_SECRET,'x-vercel-set-bypass-cookie':'true'},maxRedirects:0})
  console.log('Bootstrap HTTP',initial.status(),'mitigation',initial.headers()['x-vercel-mitigated']??'none','cookies',(await bootstrap.storageState()).cookies.length);
  if(initial.status()>=400)throw new Error(`Authentication HTTP ${initial.status()}`)
  const response=await bootstrap.get(origin+'/index.json',{maxRedirects:0})
  console.log('Index HTTP',response.status(),'type',response.headers()['content-type']);
  if(!response.ok())throw new Error(`Index HTTP ${response.status()}`)
  const index=await response.json()
  writeFileSync(new URL('./index.json',import.meta.url),JSON.stringify(index))
  console.log('Published docs index loaded; pages:',Object.values(index.entries).filter(e=>e.type==='docs').length)
} catch {throw new Error('Production index authentication failed; sensitive request details suppressed')}
finally{await bootstrap.dispose()}
const tasks=['docs','demo'].map(name=>new Promise(resolve=>{
  const child=spawn(process.execPath,[root+'node_modules/@playwright/test/cli.js','test','-c',root+'.tmp/production-check/'+name+'.config.ts'],{cwd:root,env:{...process.env,...secrets},stdio:['ignore','pipe','pipe']})
  const chunks=[]
  child.stdout.on('data',chunk=>chunks.push(chunk));child.stderr.on('data',chunk=>chunks.push(chunk))
  child.on('close',code=>{let log=Buffer.concat(chunks).toString();for(const secret of Object.values(secrets))log=log.replaceAll(secret,'[redacted]');writeFileSync(new URL('./'+name+'.log',import.meta.url),log);console.log(name,'exit',code);resolve(code)})
}))
const codes=await Promise.all(tasks)
process.exitCode=codes.some(x=>x!==0)?1:0
