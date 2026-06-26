// GA4 일별 '외부 방문자' 추정 — 최근 7일
// 외부 추정 = 한국(country=South Korea) + 신규(new) 사용자  (봇=해외 데이터센터 제외, 본인=한국 재방문 대부분 제외)
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSign } from 'node:crypto';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
function loadEnv(){try{for(const l of readFileSync(join(ROOT,'.env'),'utf8').split('\n')){const t=l.trim();if(!t||t.startsWith('#'))continue;const e=t.indexOf('=');if(e<0)continue;const k=t.slice(0,e).trim(),v=t.slice(e+1).trim().replace(/^["']|["']$/g,'');if(!(k in process.env))process.env[k]=v;}}catch{}}
const b64=s=>Buffer.from(s).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
async function token(sa){const now=Math.floor(Date.now()/1000);const h=b64(JSON.stringify({alg:'RS256',typ:'JWT'}));const c=b64(JSON.stringify({iss:sa.client_email,scope:'https://www.googleapis.com/auth/analytics.readonly',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600}));const si=`${h}.${c}`;const s=createSign('RSA-SHA256');s.update(si);const jwt=`${si}.${b64(s.sign(sa.private_key))}`;const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:jwt})});const d=await r.json();if(!d.access_token)throw new Error(JSON.stringify(d));return d.access_token;}
async function rep(tok,pid,dims,filt){const r=await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${pid}:runReport`,{method:'POST',headers:{Authorization:`Bearer ${tok}`,'Content-Type':'application/json'},body:JSON.stringify({dateRanges:[{startDate:'6daysAgo',endDate:'today'}],dimensions:dims.map(n=>({name:n})),metrics:[{name:'totalUsers'},{name:'screenPageViews'}],...(filt?{dimensionFilter:filt}:{}),orderBys:[{dimension:{dimensionName:'date'}}],limit:200})});const d=await r.json();if(!r.ok)throw new Error(JSON.stringify(d.error||d));return d.rows||[];}
function ymd(s){return `${s.slice(4,6)}/${s.slice(6)}`;}
async function main(){
  loadEnv();const pid=process.env.GA4_PROPERTY_ID;const kf=process.env.GA_SA_KEY_FILE;
  const p=kf.startsWith('~')?join(process.env.HOME,kf.slice(1)):kf;const sa=JSON.parse(readFileSync(p,'utf8'));const tok=await token(sa);
  // 일별 × 국가 × 신규/재방문
  const rows=await rep(tok,pid,['date','country','newVsReturning']);
  const days={};
  for(const r of rows){const[d,country,nvr]=r.dimensionValues.map(x=>x.value);const u=+r.metricValues[0].value,v=+r.metricValues[1].value;
    days[d]=days[d]||{krNew:0,krRet:0,krNewViews:0,foreign:0};
    const isKR=country==='South Korea';
    if(isKR&&nvr==='new'){days[d].krNew+=u;days[d].krNewViews+=v;}
    else if(isKR&&nvr==='returning'){days[d].krRet+=u;}
    else {days[d].foreign+=u;}
  }
  console.log('\n=== 일별 방문자 분해 (최근 7일) ===');
  console.log('날짜  | 외부추정(한국 신규) | 본인추정(한국 재방문) | 해외/봇 | 외부조회수');
  let tot=0;
  for(const d of Object.keys(days).sort()){const x=days[d];tot+=x.krNew;
    console.log(`${ymd(d)} |        ${String(x.krNew).padStart(2)}명          |         ${String(x.krRet).padStart(2)}명          |  ${String(x.foreign).padStart(2)}명   |  ${x.krNewViews}`);}
  console.log(`\n7일 합계 외부추정(한국 신규 사용자): ${tot}명`);
  console.log('※ 외부추정=한국 신규 방문자(봇·본인 재방문 제외). 단 본인이 시크릿창/새기기로 들어오면 신규로 잡힐 수 있어 상한 추정치.');
}
main().catch(e=>{console.error('오류:',e.message);process.exit(1);});
