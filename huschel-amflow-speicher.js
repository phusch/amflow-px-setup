/* Huschel App Speicher für Amflow PX Setup – separates Speichermodul.
   Verwendet ausschließlich das existierende Amflow-Datenmodell über die Brücke. */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const URL = 'https://qijordwpbwwbizfcslrv.supabase.co';
const UID = '9be7d1bc-4d69-4cb8-bb42-cb2d3c705f75';
const APP_ID = 'amflow-px-setup';
const PUBLISHABLE_KEY = 'huschel-amflow-publishable-v1';
const EMAIL_KEY = 'huschel-amflow-email-v1';
const AUTH_STORAGE_KEY = 'huschel-amflow-auth-session-v1';
const $ = id => document.getElementById(id);
const bridge = window.HuschelAmflowBridge;
let client = null, clientKey = null, authenticated = false, busy = false;
let cloudSha = undefined, cloudRevision = 0, cloudTime = null, cloudData = null, cloudExists = false;
let originalScroll = 0;

function lamp(message, mode='warning') {
  $('amLamp').className = 'am-storage-lamp' + (mode==='ok'?' ok':mode==='error'?' error':'');
  $('amLamp').textContent = (mode==='ok'?'🟢 ':mode==='error'?'🔴 ':'🟡 ') + message;
}
function note(message) { $('amMessage').textContent = String(message); }
function metadata() {
  let date = '–';
  if (cloudTime && !Number.isNaN(Date.parse(cloudTime))) date = new Date(cloudTime).toLocaleString('de-DE');
  $('amMeta').textContent = 'Privater GitHub-Speicher · Revision: ' +
    (cloudSha === undefined ? 'nicht geprüft' : cloudRevision) + ' · Letzte Speicherung: ' + date;
}
function logged(yes, email='', message='') {
  authenticated = yes;
  $('amAuthFields').hidden = yes;
  $('amSignedIn').hidden = !yes;
  $('amAuthPanel').classList.toggle('signed-in',yes);
  $('amAuthStatus').className = 'am-storage-auth-status' + (yes?' ok':message.startsWith('🔴')?' error':'');
  $('amAuthStatus').textContent = yes?'🟢 Angemeldet · Supabase-Zugang aktiv':message || '⚪ Nicht angemeldet · für GitHub bitte anmelden';
  $('amEmailDisplay').textContent = yes?'Angemeldet als '+email:'';
}
function meaningful(data) {
  if (!data || data.schemaVersion !== 1 || !data.profiles || !Array.isArray(data.rides)) throw Error('Ungültige Amflow-Daten.');
  return JSON.stringify({
    schemaVersion:data.schemaVersion, model:data.model, riderWeight:data.riderWeight,
    tireType:data.tireType, profiles:data.profiles, rides:data.rides
  });
}
function same(a,b) { try { return meaningful(a)===meaningful(b); } catch {return false;} }
function refreshLamp() {
  if (busy) return;
  if (cloudSha === undefined) lamp('GitHub-Speicherstand noch nicht geprüft – zuerst GitHub Laden');
  else if (!cloudExists) lamp('Noch keine Amflow-Daten auf GitHub – erste Speicherung möglich');
  else if (same(bridge.read(),cloudData)) lamp('Aktuelle Bike-Daten sicher auf GitHub gespeichert','ok');
  else lamp('Bike-Daten wurden geändert – noch nicht auf GitHub gespeichert');
}
function setRemote(result) {
  cloudSha = result.sha ?? null;
  cloudRevision = Number(result.revision || 0);
  cloudTime = result.savedAt || null;
  cloudExists = Boolean(result.exists);
  cloudData = cloudExists ? result.data : null;
  metadata();
}
function cancelled(action) {
  lamp(action+' von dir abgebrochen – Bike-Daten unverändert');
  note('Der Ladevorgang wurde von dir abgebrochen. Weder die aktuell angezeigten Profile/Testfahrten noch der private GitHub-Datensatz wurden verändert.');
}
async function task(action, fn) {
  if (busy) return;
  busy = true;
  document.querySelectorAll('#amStorageView button').forEach(btn => btn.disabled = true);
  try { await fn(); }
  catch (err) {
    const detail = String(err?.message || err || 'Unbekannter Fehler');
    if (action==='Anmeldung') { logged(false,'','🔴 Anmeldung fehlgeschlagen · bitte Zugangsdaten prüfen'); $('amPass').value=''; }
    lamp(action + ' fehlgeschlagen','error');
    note(action + ' fehlgeschlagen: '+detail+'\nDeine bestehenden Bike-Daten wurden durch diesen Vorgang nicht automatisch überschrieben.');
  }
  finally {
    busy = false;
    document.querySelectorAll('#amStorageView button').forEach(btn => btn.disabled = false);
    if (action==='Anmeldung' && authenticated) refreshLamp();
  }
}
function makeClient(key) {
  if (client && clientKey===key) return client;
  const previous = client;
  const current = createClient(URL,key,{
    auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,storageKey:AUTH_STORAGE_KEY}
  });
  client=current; clientKey=key;
  if (previous && previous!==current) void previous.auth.stopAutoRefresh();
  current.auth.onAuthStateChange(event=>{
    if (client !== current) return;
    if (event==='SIGNED_OUT') logged(false);
  });
  return current;
}
async function restore() {
  const key=$('amKey').value.trim();
  if (!key.startsWith('sb_publishable_')) return;
  const current=makeClient(key);
  $('amAuthStatus').textContent='🟡 Gespeicherte Anmeldung wird geprüft…';
  try {
    const {data:session,error:sessionError}=await current.auth.getSession();
    if (current!==client) return;
    if (sessionError) throw sessionError;
    if (!session.session) {logged(false);return;}
    const {data,error}=await current.auth.getUser();
    if (current!==client) return;
    if (error || data.user?.id!==UID) {
      await current.auth.signOut({scope:'local'});
      throw error||Error('Dieses Konto ist für den Speicher nicht freigeschaltet.');
    }
    logged(true,data.user.email||$('amEmail').value.trim());
    note('Anmeldung automatisch wiederhergestellt. Du kannst GitHub laden oder speichern.');
  } catch(err) {
    if (current!==client) return;
    logged(false,'','🔴 Anmeldung nicht wiederherstellbar · bitte erneut anmelden');
    note('Supabase-Sitzung nicht wiederherstellbar: '+(err?.message||err));
  }
}
async function invoke(payload) {
  if (!authenticated || !client) throw Error('Bitte zuerst bei Supabase anmelden.');
  const {data,error}=await client.functions.invoke('github-app-storage',{body:payload});
  if (error) {
    let message=error.message||'Verbindungsproblem';
    if (error.context instanceof Response) {
      message+=' (HTTP '+error.context.status+')';
      try {const detail=await error.context.json();message+=': '+(detail.error||JSON.stringify(detail));}catch{}
    }
    throw Error(message);
  }
  if (!data?.ok) throw Error(data?.error||'Ungültige Antwort der GitHub-Speicherfunktion.');
  return data;
}
function validate(value) { return bridge.validate(value); }
$('amLogin').addEventListener('click',()=>task('Anmeldung',async()=>{
  const key=$('amKey').value.trim();
  if (!key.startsWith('sb_publishable_')) throw Error('Bitte den Supabase Publishable Key eintragen, keinen Secret Key.');
  const current=makeClient(key);
  const email=$('amEmail').value.trim();
  try {
    const {data,error}=await current.auth.signInWithPassword({email,password:$('amPass').value});
    if (error) throw error;
    if (data.user?.id!==UID) {await current.auth.signOut();throw Error('Dieses Konto ist nicht freigegeben.');}
    logged(true,data.user.email||email);
    try {localStorage.setItem(PUBLISHABLE_KEY,key);localStorage.setItem(EMAIL_KEY,email);}catch{}
    note('Supabase-Anmeldung erfolgreich. Jetzt GitHub Laden wählen, damit der Versionsstand geprüft wird.');
  } finally {$('amPass').value='';}
}));
$('amLogout').addEventListener('click',()=>task('Abmeldung',async()=>{
  if (client) await client.auth.signOut();
  cloudSha=undefined;cloudRevision=0;cloudTime=null;cloudData=null;cloudExists=false;
  metadata();logged(false);
  lamp('Abgemeldet · GitHub-Speicherstand nicht geprüft');
  note('Abgemeldet. Deine Bike-Profile und die lokalen Daten wurden nicht verändert.');
}));
$('amGithubLoad').addEventListener('click',()=>task('GitHub Laden',async()=>{
  const remote=await invoke({action:'load',app:APP_ID});
  if (remote.exists) validate(remote.data); // Erst validieren, niemals ungültige Daten übernehmen.
  setRemote(remote);
  if (!remote.exists) {
    lamp('Noch keine Amflow-Daten im privaten GitHub-Speicher');
    note('Im privaten Repository existiert amflow-px-setup/data.json noch nicht. Deine aktuellen Profile und Testfahrten bleiben unverändert. Du kannst sie jetzt mit „GitHub Speichern“ anlegen.');return;
  }
  if (same(bridge.read(),remote.data)) {
    lamp('Bike-Daten entsprechen bereits dem GitHub-Speicherstand','ok');
    note('GitHub-Revision '+cloudRevision+' geprüft. Alle Bike-Daten sind bereits identisch, es wurde nichts überschrieben.');return;
  }
  if (!confirm('GitHub Laden ersetzt die aktuell geöffneten Bike-Profile UND Testfahrten durch die private Sicherung.\n\nBitte bei Bedarf vorher JSON-Backup erstellen.\n\nDaten von GitHub übernehmen?')) {cancelled('GitHub Laden');return;}
  bridge.apply(remote.data);
  lamp('Bike-Daten von GitHub geladen','ok');
  note('GitHub-Revision '+cloudRevision+' geladen und im bisherigen lokalen Browserspeicher übernommen. Der private GitHub-Datensatz wurde dabei nicht geändert.');
}));
$('amGithubSave').addEventListener('click',()=>task('GitHub Speichern',async()=>{
  if (cloudSha===undefined) throw Error('Bitte zuerst GitHub Laden wählen, um die letzte Dateiversion zu prüfen.');
  const current=validate(bridge.read());
  if (cloudExists && same(current,cloudData)) {
    lamp('Keine neuen Änderungen – GitHub bereits aktuell','ok');
    note('Bike-Daten sind mit der zuletzt geprüften GitHub-Revision '+cloudRevision+' identisch. Keine zusätzliche Revision erstellt.');return;
  }
  if (cloudExists && !confirm('Du speicherst deinen aktuellen Bike-Datenstand über die zuvor geladene GitHub-Revision '+cloudRevision+'.\n\nDer bisherige GitHub-Stand bleibt in der Git-Versionshistorie, wird aber als aktuelle Datei ersetzt.\n\nJetzt wirklich speichern?')) {cancelled('GitHub Speichern');return;}
  const result=await invoke({action:'save',app:APP_ID,sha:cloudSha,revision:cloudRevision,data:current});
  setRemote({...result,exists:true,data:current});
  lamp('Bike-Daten sicher auf GitHub gespeichert','ok');
  note('Erfolgreich in amflow-px-setup/data.json als Revision '+cloudRevision+' gespeichert. Andere Apps und das öffentliche Amflow-Repository wurden nicht verändert.');
}));
$('amLocalSave').addEventListener('click',()=>task('Lokal Speichern',async()=>{
  if (!bridge.localSave()) throw Error('Der Browser erlaubt keine lokale Speicherung. Bitte stattdessen ein JSON-Backup erstellen.');
  note('Aktuelle Bike-Profile und Testfahrten in der bisherigen lokalen App-Speicherung gesichert. GitHub wurde nicht verändert.');
  refreshLamp();
}));
$('amLocalLoad').addEventListener('click',()=>task('Lokal Laden',async()=>{
  const raw=bridge.localRaw();
  if (!raw) throw Error('Es wurde noch kein lokaler Speicherstand gefunden.');
  const data=validate(JSON.parse(raw));
  if (same(bridge.read(),data)) {
    note('Der lokale Browserspeicher ist bereits identisch mit den geöffneten Bike-Daten. Kein Austausch erforderlich.');return;
  }
  if (!confirm('Den lokalen Speicherstand laden?\n\nDie geöffneten Bike-Profile und Testfahrten werden ersetzt. GitHub bleibt unverändert.')) {cancelled('Lokal Laden');return;}
  bridge.apply(data);
  lamp('Lokalen Speicherstand übernommen – GitHub-Status prüfen');
  note('Bike-Daten aus dem lokalen Speicher übernommen. GitHub wurde nicht verändert.');
}));
$('amExport').addEventListener('click',()=>task('JSON-Backup',async()=>{
  bridge.exportJson();
  note('JSON-Backup der Bike-Profile und aller Testfahrten zum Download erstellt. GitHub blieb unverändert.');
}));
$('amImport').addEventListener('click',()=>$('amFile').click());
$('amFile').addEventListener('change',async event=>{
  const file=event.target.files?.[0];if (!file) return;
  await task('JSON Laden',async()=>{
    if (file.size>3_000_000) throw Error('Backup größer als 3 MB – bitte Datei prüfen.');
    const data=validate(JSON.parse(await file.text()));
    if (same(bridge.read(),data)) {note('Das gewählte JSON-Backup enthält bereits dieselben Bike-Daten. Kein Austausch notwendig.');return;}
    if (!confirm('JSON-Backup laden? Die aktuell geöffneten Profile und Testfahrten werden ersetzt und lokal gespeichert. GitHub bleibt unverändert.')) {cancelled('JSON Laden');return;}
    bridge.apply(data);
    lamp('JSON-Backup übernommen – GitHub noch nicht aktualisiert');
    note('JSON-Backup übernommen und lokal gespeichert. GitHub wurde nicht verändert.');
  });
  event.target.value='';
});
$('amOpenStorage').addEventListener('click',()=>{
  originalScroll=window.scrollY;
  $('amStorageView').hidden=false;
  document.body.classList.add('am-storage-open');
  metadata();refreshLamp();window.scrollTo(0,0);
});
$('amStorageBack').addEventListener('click',()=>{
  document.body.classList.remove('am-storage-open');
  $('amStorageView').hidden=true;window.scrollTo(0,originalScroll);
});
window.addEventListener('huschel:amflow-geaendert',()=>{
  if (!$('amStorageView').hidden && !busy) refreshLamp();
});
try {
  $('amKey').value=localStorage.getItem(PUBLISHABLE_KEY)
    || localStorage.getItem('huschel-routen-navigator-publishable-v1')
    || localStorage.getItem('huschel-supabase-publishable-key-v1') || '';
  $('amEmail').value=localStorage.getItem(EMAIL_KEY) || $('amEmail').value;
} catch {}
metadata();
if (!bridge) {
  lamp('Fehler: App-Datenanbindung fehlt','error');
  note('Die Anbindung an das originale Amflow-Datenmodell ist nicht verfügbar. Bitte alle Dateien der Testversion gemeinsam veröffentlichen.');
} else {void restore();}
