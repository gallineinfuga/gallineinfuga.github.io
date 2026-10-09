// HUB-MAP-001: opt-in map. No unverified business pin is displayed.
const address = "Corso Alberto Amedeo 184, 90138 Palermo";
const translations = {
  it: {title:"Dove siamo",load:"Mostra mappa",google:"Apri in Google Maps",copy:"Copia indirizzo",copied:"Indirizzo copiato",ready:"Mappa indicativa della zona Tribunale. Il civico esatto non è ancora verificato.",error:"Mappa non disponibile. Puoi utilizzare Google Maps.",initial:"La mappa si carica solo quando lo richiedi."},
  en: {title:"Find us",load:"Show map",google:"Open in Google Maps",copy:"Copy address",copied:"Address copied",ready:"Approximate map of the Tribunale area. The exact street number has not yet been verified.",error:"Map unavailable. You can use Google Maps.",initial:"The map loads only when you request it."}
};
const $ = id => document.getElementById(id);
let loaded = false;
let locale = "it";
function language() {
  locale = document.querySelector('[data-locale][aria-pressed="true"]')?.dataset.locale || (document.documentElement.lang === "en" ? "en" : "it");
  const t = translations[locale];
  $("location-title").textContent=t.title;
  $("location-google").textContent=t.google;
  $("location-copy").textContent=t.copy;
  $("location-load").textContent=t.load;
  if (!loaded) $("location-status").textContent=t.initial;
}
function inject(tag, attrs) {
  return new Promise((resolve,reject)=>{
    const element=document.createElement(tag);
    Object.entries(attrs).forEach(([key,value])=>element[key]=value);
    element.onload=resolve; element.onerror=reject;
    document.head.append(element);
  });
}
$("location-load").addEventListener("click", async ()=>{
  const button=$("location-load");
  button.disabled=true;
  try {
    if (!window.L) {
      await inject("link",{rel:"stylesheet",href:"https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"});
      await inject("script",{src:"https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"});
    }
    $("location-map").hidden=false;
    const map=L.map("location-map",{scrollWheelZoom:false}).setView([38.119,13.356],15);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{
      maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);
    // Coordinates above represent a general Palermo view, NOT the shop.
    loaded=true;
    $("location-status").textContent=translations[locale].ready;
    button.hidden=true;
    setTimeout(()=>map.invalidateSize(),50);
  } catch(error) {
    console.error("Location map unavailable",error);
    $("location-status").textContent=translations[locale].error;
    button.disabled=false;
  }
});
$("location-copy").addEventListener("click",async()=>{
  try {
    await navigator.clipboard.writeText(address);
    $("location-copy").textContent=translations[locale].copied;
  } catch {
    const input=document.createElement("textarea");
    input.value=address; document.body.append(input);input.select();
    const success=document.execCommand("copy");input.remove();
    if(success) $("location-copy").textContent=translations[locale].copied;
  }
});
document.querySelectorAll("[data-locale]").forEach(b=>b.addEventListener("click",()=>setTimeout(language,0)));
language();
