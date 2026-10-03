const linksRoot=document.querySelector("#links"),empty=document.querySelector("#empty");
const safeUrl=v=>{try{const u=new URL(v,location.origin);if(["http:","https:","mailto:","tel:"].includes(u.protocol))return v}catch{}return null};
const initials=(l="Link")=>l.trim().slice(0,2).toUpperCase();
(async()=>{try{
const [lr,tr]=await Promise.all([fetch("config/links.json",{cache:"no-store"}),fetch("config/theme.json",{cache:"no-store"})]);
const links=await lr.json(),theme=await tr.json();
Object.entries(theme.tokens||{}).forEach(([k,v])=>document.documentElement.style.setProperty("--"+k,v));
const active=(links.items||[]).filter(x=>x.enabled&&safeUrl(x.url)).sort((a,b)=>(a.order||0)-(b.order||0));
if(!active.length){empty.hidden=false;return}
for(const item of active){const a=document.createElement("a");a.className="card"+(item.featured?" featured":"");a.href=safeUrl(item.url);if(/^https?:/.test(a.href)){a.target="_blank";a.rel="noopener noreferrer"}a.innerHTML=`<span class="icon" aria-hidden="true">${item.iconText||initials(item.label)}</span><span class="copy"><span class="label"></span><span class="desc"></span></span><span class="arrow" aria-hidden="true">›</span>`;a.querySelector(".label").textContent=item.label||"Link";const d=a.querySelector(".desc");d.textContent=item.subtitle||"";if(!item.subtitle)d.hidden=true;linksRoot.append(a)}
}catch(e){console.error(e);empty.textContent="Hub temporaneamente non disponibile.";empty.hidden=false}})();