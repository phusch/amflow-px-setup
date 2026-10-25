'use strict';
/* Amflow PX Setup Cockpit V1.1 · bestehendes Datenmodell, automatische lokale Speicherung */
const STORAGE_KEY='amflow-px-setup-data-v1';
const SCHEMA_VERSION=1;
const batteryCapacityWh=700;

// Jede Zeile: [Schlüssel, Beschriftung, Einheit/Hinweis, Waldtrail, Allgäu Berge].
// Die Vorschläge stammen aus der gemeinsam erarbeiteten Gegenüberstellung.
const GROUPS=[
 {id:'eco',category:'motor',title:'ECO · sparsam & entspannt',description:'Flache Wege und ruhige Anfahrten',rows:[
  ['eco_support','Unterstützung','Stufe 1–15','4','4'],
  ['eco_torque','Maximales Drehmoment','Nm','50','50'],
  ['eco_power','Maximale Motorleistung','W','250','250'],
  ['eco_start','Anfahrunterstützung','Stufe 1–5','2','2'],
  ['eco_cont','Kontinuierliche Unterstützung','Stufe 1–5','2','2'],
  ['eco_overrun','Motor-Nachlauf','Stufe 1–5','1','1']
 ]},
 {id:'auto',category:'motor',title:'AUTO · Hauptmodus für Touren',description:'Progressive Unterstützung für wechselnde Belastung',rows:[
  ['auto_support','Unterstützung','Bereich auf Stufe 1–15','4–8','4–9'],
  ['auto_torque','Maximales Drehmoment','Nm','85','90'],
  ['auto_power','Maximale Motorleistung','W','500','550'],
  ['auto_start','Anfahrunterstützung','Stufe 1–5','3','2'],
  ['auto_cont','Kontinuierliche Unterstützung','Stufe 1–5','3','3'],
  ['auto_overrun','Motor-Nachlauf','Stufe 1–5','1','1'],
  ['auto_accel','Maximale Beschleunigung','Stufe 1–5','3','2']
 ]},
 {id:'trail',category:'motor',title:'TRAIL · technisch bergauf',description:'Wurzeln, lose Passagen und steilere Rampen',rows:[
  ['trail_support','Unterstützung','Bereich auf Stufe 1–15','7–11','7–12'],
  ['trail_torque','Maximales Drehmoment','Nm','100','105'],
  ['trail_power','Maximale Motorleistung','W','700','750'],
  ['trail_start','Anfahrunterstützung','Stufe 1–5','3','2'],
  ['trail_cont','Kontinuierliche Unterstützung','Stufe 1–5','3','3'],
  ['trail_overrun','Motor-Nachlauf','Stufe 1–5','2','2']
 ]},
 {id:'turbo',category:'motor',title:'TURBO · Leistungsreserve',description:'Sehr steile, griffige Anstiege',rows:[
  ['turbo_support','Unterstützung','Stufe 1–15','12','12'],
  ['turbo_torque','Maximales Drehmoment','Nm','120','120'],
  ['turbo_power','Maximale Motorleistung','W','900','950'],
  ['turbo_start','Anfahrunterstützung','Stufe 1–5','3','2'],
  ['turbo_cont','Kontinuierliche Unterstützung','Stufe 1–5','4','4'],
  ['turbo_overrun','Motor-Nachlauf','Stufe 1–5','1','1']
 ]},
 {id:'boost',category:'motor',title:'BOOST · kurzzeitige Zusatzleistung',description:'Bewusst unveränderte Werkseinstellung',rows:[
  ['boost_mode','BOOST-Abstimmung','Text / Werksprofil','Werksprofil','Werksprofil'],
  ['boost_local','BOOST Local Enhancement','Ein / Aus','Aus','Aus']
 ]},
 {id:'fork',category:'fork',title:'FOX 36 Factory GRIP X2 · Federgabel',description:'160 mm Federweg · Klickzahlen jeweils von geschlossen aus öffnen',rows:[
  ['fork_psi','Luftdruck','psi · nur Startdruck','102','100–102'],
  ['fork_sag','SAG','mm · Ziel bei Ausrüstung','28','28–30'],
  ['fork_hsc','HSC · schnelle Druckstufe','Klicks offen ab geschlossen','5','5'],
  ['fork_lsc','LSC · langsame Druckstufe','Klicks offen ab geschlossen','10','11'],
  ['fork_hsr','HSR · schnelle Zugstufe','Klicks offen ab geschlossen','3','3'],
  ['fork_lsr','LSR · langsame Zugstufe','Klicks offen ab geschlossen','4','4']
 ]},
 {id:'shock',category:'fork',title:'FOX Float X Factory · Dämpfer',description:'55 mm Hub · Druck über tatsächlichen SAG festlegen',rows:[
  ['shock_psi','Luftdruck','psi · 230 nur Teststart','230 (Start)','nach SAG'],
  ['shock_sag','SAG','mm','15','15–16'],
  ['shock_lever','Dämpferhebel','OPEN / FIRM','OPEN','OPEN'],
  ['shock_lsc','LSC · langsame Druckstufe','Klicks von ganz offen Richtung geschlossen','2','1'],
  ['shock_lsr','LSR · Zugstufe','Klicks offen ab geschlossen','3–4 (Start)','wie Waldtrail']
 ]},
 {id:'tires',category:'tires',title:'Schwalbe Radial · Tubeless',description:'Kalt messen; Reifen- und Felgengrenzen beachten',rows:[
  ['tire_dry_front','Vorderreifen · normal/trocken','bar','1,65','1,75'],
  ['tire_dry_rear','Hinterreifen · normal/trocken','bar','1,90','2,00'],
  ['tire_wet_front','Vorderreifen · nass/weich','bar','1,65','1,65'],
  ['tire_wet_rear','Hinterreifen · nass/weich','bar','1,90','1,90']
 ]},
 {id:'battery',category:'tires',title:'Akku & Geometrie',description:'Reichweite planen und den Serienzustand bewahren',rows:[
  ['battery_daily','Ladelimit Alltag','%','80','80'],
  ['battery_tour','Ladung vor langer Tour','%','100','100'],
  ['battery_reserve','Angestrebte Restreserve','%','nach Tour','20'],
  ['geometry','Geometrie','Position','Serie','Serie'],
  ['chainstay','Kettenstreben','Position','Serie','Serie']
 ]},
 {id:'tech',category:'tires',title:'Systemfunktionen',description:'Nur aktivieren, wenn deine Hardware und Firmware sie unterstützen',rows:[
  ['chain_protect','Chain Protection','Ein / Aus','Ein','Ein'],
  ['smoothshift','SmoothShift','Bei Kompatibilität','Ein wenn kompatibel','Ein wenn kompatibel'],
  ['heart_control','Herzfrequenzregelung','Ein / Aus','Aus','Aus'],
  ['speed_limit','Geschwindigkeitslimit','Original / Landesvorgabe','Unverändert','Unverändert']
 ]}
];
const ROWS=GROUPS.flatMap(group=>group.rows.map(row=>({key:row[0],name:row[1],unit:row[2],forest:row[3],alpine:row[4],group:group.title})));
const byId=id=>document.getElementById(id);
const stamp=()=>new Date().toISOString();
const humanStamp=date=>{if(!date)return 'Noch nicht gespeichert';try{return new Date(date).toLocaleString('de-DE',{dateStyle:'medium',timeStyle:'short'});}catch{return date;}};
const clone=value=>JSON.parse(JSON.stringify(value));
function freshState(){return {schemaVersion:SCHEMA_VERSION,model:'Amflow PX Carbon Pro 2026',riderWeight:'90–99 kg inkl. Ausrüstung',tireType:'Tubeless',profiles:{current:{},forest:Object.fromEntries(ROWS.map(r=>[r.key,r.forest])),alpine:Object.fromEntries(ROWS.map(r=>[r.key,r.alpine]))},rides:[],meta:{updatedAt:null,source:'Manuelle Erfassung'}};}
function safeText(value,max=2000){return typeof value==='string'?value.slice(0,max):typeof value==='number'&&Number.isFinite(value)?String(value).slice(0,max):'';}
function validateData(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||raw.schemaVersion!==SCHEMA_VERSION||!raw.profiles||typeof raw.profiles!=='object'||!Array.isArray(raw.rides))throw Error('Unbekanntes oder beschädigtes JSON-Format (erwartet: PX Setup Schema 1).');
 if(raw.rides.length>3000)throw Error('Zu viele Testfahrten in einer Datei.');
 const result=freshState();
 for(const profile of ['current','forest','alpine']){
  const src=raw.profiles[profile];if(src!==undefined&&(!src||typeof src!=='object'||Array.isArray(src)))throw Error('Ungültiges Profil: '+profile);
  for(const row of ROWS) if(src&&Object.prototype.hasOwnProperty.call(src,row.key))result.profiles[profile][row.key]=safeText(src[row.key],80);
 }
 result.rides=raw.rides.map((r,i)=>{
  if(!r||typeof r!=='object'||Array.isArray(r))throw Error('Ungültiger Testfahrten-Eintrag #'+(i+1));
  const clean={};for(const field of ['id','date','profile','route','km','hm','batStart','batEnd','surface','traction','comfort','drive','notes','createdAt'])clean[field]=safeText(r[field],field==='notes'?2000:field==='route'?130:100);
  if(!['current','forest','alpine'].includes(clean.profile))clean.profile='current';
  for(const snap of ['snapshot','bikeSnapshot']){
   if(r[snap]&&typeof r[snap]==='object'&&!Array.isArray(r[snap])){clean[snap]={};for(const row of ROWS)if(Object.prototype.hasOwnProperty.call(r[snap],row.key))clean[snap][row.key]=safeText(r[snap][row.key],80);}
  }
  return clean;
 });
 result.meta.updatedAt=safeText(raw.meta&&raw.meta.updatedAt,40)||null;
 result.meta.source=safeText(raw.meta&&raw.meta.source,80)||'Import';
 return result;
}
function readLocal(){try{const saved=localStorage.getItem(STORAGE_KEY);if(saved)return validateData(JSON.parse(saved));}catch(err){console.warn('Lokalen Speicher nicht lesbar:',err);}return freshState();}
let state=readLocal();
let toastTimer;
function toast(msg){const target=byId('toast');target.textContent=msg;target.classList.remove('hidden');clearTimeout(toastTimer);toastTimer=setTimeout(()=>target.classList.add('hidden'),3500);}
function persist(){state.meta.updatedAt=stamp();try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch{toast('Browser-Speicher nicht verfügbar: bitte JSON sichern.');}window.dispatchEvent(new Event('huschel:amflow-geaendert'));}
function el(tag,css='',text=''){const node=document.createElement(tag);if(css)node.className=css;if(text)node.textContent=text;return node;}

function buildComparison(){
 const host=byId('comparison-tables');host.replaceChildren();
 const category=byId('group-filter').value;const onlyDiffs=byId('only-diffs').checked;
 let any=false;
 for(const group of GROUPS){
  if(category!=='all'&&group.category!==category)continue;
  const rows=group.rows.filter(r=>!onlyDiffs||state.profiles.forest[r[0]]!==state.profiles.alpine[r[0]]);
  if(!rows.length)continue;any=true;
  const wrap=el('section','compare-group');const heading=el('div','group-heading');
  const left=el('div');left.append(el('h3','',group.title),el('p','',group.description));heading.append(left,el('span','group-count',rows.length+' Werte'));wrap.append(heading);
  const scroller=el('div','table-scroll');scroller.setAttribute('tabindex','0');scroller.setAttribute('aria-label',group.title+' horizontal scrollbare Vergleichstabelle');
  const table=el('table','compare-table');const thead=el('thead');const tr=el('tr');for(const text of ['PARAMETER','MEIN BIKE · IST','WALDTRAIL','ALLGÄU BERGE']){const th=el('th','',text);th.scope='col';tr.append(th);}thead.append(tr);table.append(thead);
  const tbody=el('tbody');
  for(const r of rows){const [key,name,unit]=r;const tr=el('tr',state.profiles.forest[key]!==state.profiles.alpine[key]?'row-different':'');
   const labelTd=el('td');const lbl=el('span','parameter',name);lbl.append(el('span','unit',unit));labelTd.append(lbl);tr.append(labelTd);
   for(const profile of ['current','forest','alpine']){const td=el('td');const input=el('input','cell-input '+profile);input.type='text';input.value=state.profiles[profile][key]||'';input.placeholder=profile==='current'?'Ist-Wert …':'–';input.maxLength=80;input.dataset.key=key;input.dataset.profile=profile;input.setAttribute('aria-label',name+' '+({current:'Mein Bike',forest:'Waldtrail',alpine:'Allgäu Berge'}[profile]));input.spellcheck=false;td.append(input);tr.append(td);}tbody.append(tr);
  }table.append(tbody);scroller.append(table);wrap.append(scroller);host.append(wrap);
 }
 if(!any)host.append(el('div','empty-state','Keine unterschiedlichen Werte in dieser Auswahl.'));
}
byId('comparison-tables').addEventListener('input',event=>{const input=event.target;if(!input.matches('.cell-input'))return;state.profiles[input.dataset.profile][input.dataset.key]=input.value;persist();});
byId('comparison-tables').addEventListener('change',()=>{if(byId('only-diffs').checked)buildComparison();});
byId('group-filter').addEventListener('change',buildComparison);
byId('only-diffs').addEventListener('change',buildComparison);
byId('reset-recos').addEventListener('click',()=>{if(!confirm('Beide Empfehlungen auf die ursprünglichen Startwerte zurücksetzen? Mein Bike und Testfahrten bleiben unverändert.'))return;const defaults=freshState();state.profiles.forest=defaults.profiles.forest;state.profiles.alpine=defaults.profiles.alpine;persist();buildComparison();toast('Empfehlungen wiederhergestellt.');});

function exportable(){return clone(state);}
function download(filename,text,format='application/json'){const blob=new Blob([text],{type:format});const url=URL.createObjectURL(blob);const a=el('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function jsonDownload(){download('Amflow_PX_Setup_'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(exportable(),null,2));toast('JSON-Backup heruntergeladen.');}
function csvEscape(value){const s=String(value??'');return '"'+s.replaceAll('"','""')+'"';}
byId('export-csv').addEventListener('click',()=>{const lines=[['Bereich','Parameter','Einheit / Hinweis','Mein Bike (Ist)','Waldtrail','Allgäu Berge']];for(const r of ROWS)lines.push([r.group,r.name,r.unit,state.profiles.current[r.key]||'',state.profiles.forest[r.key]||'',state.profiles.alpine[r.key]||'']);download('Amflow_PX_Setup_Vergleich.csv','\uFEFF'+lines.map(r=>r.map(csvEscape).join(';')).join('\r\n'),'text/csv;charset=utf-8');toast('Vergleich als CSV exportiert.');});

const rideFields={id:'ride-id',date:'ride-date',profile:'ride-profile',route:'ride-route',km:'ride-km',hm:'ride-hm',batStart:'ride-batstart',batEnd:'ride-batend',surface:'ride-surface',traction:'ride-traction',comfort:'ride-comfort',drive:'ride-drive',notes:'ride-notes'};
const names={current:'Mein Bike',forest:'Waldtrail',alpine:'Allgäu Berge'};
const today=()=>{const d=new Date();const offset=d.getTimezoneOffset()*60000;return new Date(d.getTime()-offset).toISOString().slice(0,10);};
function resetRideForm(){byId('ride-form').reset();byId('ride-id').value='';byId('ride-date').value=today();byId('save-ride').textContent='Testfahrt speichern';}
function readRide(){const r={};for(const [key,id]of Object.entries(rideFields))r[key]=byId(id).value.trim();return r;}
function validateRide(r){if(!/^\d{4}-\d{2}-\d{2}$/.test(r.date))throw Error('Bitte Datum eingeben.');if(!r.route)throw Error('Bitte Tournamen eingeben.');for(const k of ['km','hm','batStart','batEnd'])if(r[k]!==''&&!Number.isFinite(Number(r[k])))throw Error('Unzulässiger Zahlenwert: '+k);for(const k of ['batStart','batEnd'])if(r[k]!==''&&(Number(r[k])<0||Number(r[k])>100))throw Error('Akkuwerte müssen zwischen 0 und 100 liegen.');if(r.batStart!==''&&r.batEnd!==''&&Number(r.batEnd)>Number(r.batStart))throw Error('Der Akkustand am Ende ist größer als am Start. Bitte prüfen.');}
byId('ride-form').addEventListener('submit',e=>{e.preventDefault();const ride=readRide();try{validateRide(ride);}catch(err){alert(err.message);return;}if(ride.id){const old=state.rides.find(r=>r.id===ride.id);if(old)Object.assign(old,ride);}else{ride.id=String(Date.now())+'-'+Math.random().toString(36).slice(2,7);ride.createdAt=stamp();ride.snapshot=clone(state.profiles[ride.profile]);ride.bikeSnapshot=clone(state.profiles.current);state.rides.unshift(ride);}persist();renderRides();resetRideForm();toast('Testfahrt lokal gespeichert.');});
byId('cancel-ride').addEventListener('click',resetRideForm);
function formatNum(v,unit){return v!==''&&v!==undefined&&v!==null?String(v).replace('.',',')+' '+unit:'';}
function renderRides(){const host=byId('ride-list');host.replaceChildren();const sorted=[...state.rides].sort((a,b)=>b.date.localeCompare(a.date));byId('ride-count').textContent=sorted.length+' Einträge';if(!sorted.length){host.append(el('div','empty-state','Noch keine Testfahrten. Nach der nächsten Runde kannst du hier die Fahrwerks- und Motorabstimmung bewerten.'));return;}
 for(const ride of sorted){const card=el('article','ride-card');const body=el('div');body.style.flex='1';body.append(el('div','ride-meta',new Date(ride.date+'T12:00:00').toLocaleDateString('de-DE',{year:'numeric',month:'long',day:'numeric'})+'  ·  '+(names[ride.profile]||'Mein Bike')+'  ·  '+ride.surface));body.append(el('div','ride-title',ride.route));const kpis=el('div','ride-kpis');
  const tags=[formatNum(ride.km,'km'),formatNum(ride.hm,'Hm'),ride.batStart!==''&&ride.batEnd!==''?ride.batStart+' → '+ride.batEnd+' % Akku':'',ride.traction?'Traktion '+ride.traction+'/5':'',ride.comfort?'Fahrwerk '+ride.comfort+'/5':'',ride.drive?'Motor '+ride.drive+'/5':''];
  if(ride.km&&Number(ride.km)>0&&ride.batStart!==''&&ride.batEnd!==''){const whKm=(Number(ride.batStart)-Number(ride.batEnd))*batteryCapacityWh/(100*Number(ride.km));if(Number.isFinite(whKm))tags.push('ca. '+whKm.toFixed(1).replace('.',',')+' Wh/km');}
  for(const tag of tags.filter(Boolean))kpis.append(el('span','ride-kpi',tag));body.append(kpis);if(ride.notes)body.append(el('p','ride-notes',ride.notes));
  if(ride.snapshot){const details=el('details','snapshot-details');const summary=el('summary','','Setup dieser Testfahrt anzeigen (gespeicherter Schnappschuss)');details.append(summary);const scroll=el('div','snapshot-scroller');const snapTable=el('table','snapshot-table');const head=el('tr');for(const title of ['Einstellung','Getestetes Profil','Mein Bike zum Testzeitpunkt'])head.append(el('th','',title));snapTable.append(head);for(const row of ROWS){const tr=el('tr');tr.append(el('td','',row.name),el('td','',ride.snapshot[row.key]||'–'),el('td','',(ride.bikeSnapshot&&ride.bikeSnapshot[row.key])||'–'));snapTable.append(tr);}scroll.append(snapTable);details.append(scroll);body.append(details);}
  card.append(body);
  const acts=el('div','ride-actions');const edit=el('button','small-button','Bearbeiten');edit.type='button';edit.addEventListener('click',()=>{for(const [key,id]of Object.entries(rideFields))byId(id).value=ride[key]||'';byId('save-ride').textContent='Änderung speichern';byId('ride-form').scrollIntoView({behavior:'smooth',block:'start'});});const del=el('button','small-button danger','Löschen');del.type='button';del.addEventListener('click',()=>{if(!confirm('Diese Testfahrt endgültig löschen?'))return;state.rides=state.rides.filter(r=>r.id!==ride.id);persist();renderRides();toast('Testfahrt gelöscht.');});acts.append(edit,del);card.append(acts);host.append(card);
 }
}

for(const tab of document.querySelectorAll('.tab'))tab.addEventListener('click',()=>{
 const id=tab.dataset.tab;for(const item of document.querySelectorAll('.tab')){const active=item===tab;item.classList.toggle('active',active);if(active)item.setAttribute('aria-current','page');else item.removeAttribute('aria-current');}
 for(const panel of ['compare','rides','help'])byId('panel-'+panel).classList.toggle('hidden',panel!==id);
 window.scrollTo({top:0,behavior:'instant'});
});
resetRideForm();buildComparison();renderRides();
// Datenbrücke zum Huschel-Speichermodul: gleiches Schema und gleicher lokaler Speicher.
window.HuschelAmflowBridge = {
  read: () => exportable(),
  validate: value => validateData(value),
  apply: value => {
    const checked = validateData(value);
    state = checked;
    persist();
    buildComparison();
    renderRides();
    resetRideForm();
    window.dispatchEvent(new Event('huschel:amflow-geaendert'));
  },
  localRaw: () => localStorage.getItem(STORAGE_KEY),
  localSave: () => {
    persist();
    return localStorage.getItem(STORAGE_KEY) !== null;
  },
  exportJson: () => jsonDownload()
};
// Nicht mehr benötigte, potenziell gespeicherte Legacy-GitHub-Tokens aus der Sitzung entfernen.
try { sessionStorage.removeItem('amflow-px-setup-token-session'); } catch {}
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(err=>console.info('Offline-Modus nicht verfügbar:',err)));
