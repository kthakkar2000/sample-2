/* ---------- script.js (CLIENT-ONLY) ---------- */

const { jsx } = require("react/jsx-runtime");

/* ========== CONFIG ========== */
/* USE_BACKEND_AI must stay false since you don't want a backend now */
const USE_BACKEND_AI = false;

/* ========== CANNED RESPONSES (English + Gujarati) ==========
   You can edit the text below anytime. Keep 'a' for English and 'gu' for Gujarati. */
const canned = [
  { q: /price|cost|₹|rupee/i,
    a: 'The price of this model is sixty five thousand rupees only.',
    gu: 'આ મોડેલની કિંમત રૂ. 65,000 છે. સ્ટોરમાં EMI અને એક્સચેન્જ ઉપલબ્ધ છે.' },

  { q: /stock|available/i,
    a: 'This model has only 4 pieces left in stock. We also offer EMI and exchange options in-store.',
    gu: 'આ મોડેલના સ્ટોકમાં ફક્ત 4 પીસ બાકી છે. અમે સ્ટોરમાં EMI અને એક્સચેન્જ વિકલ્પો પણ પ્રદાન કરીએ છીએ.' },

  { q: /warrant(?:y|ies)|guarantee/i,
    a: 'This product comes with a two year manufacturer warranty covering defects and parts.',
    gu: 'આ ઉત્પાદન સાથે 2 વર્ષની વોરંટી મળે છે જે ખામી અને ભાગોને ઢકે છે.' },

  { q: /capacity|kg|weight/i,
    a: 'The machine has a 12 kilogram capacity — suitable for small families.',
    gu: 'આ મશીનની ક્ષમતા 12 કિગ્રા છે — નાનાં પરિવાર માટે પૂરતી.' },

  { q: /rpm|spin|speed/i,
    a: 'Maximum spin speed is 1200 RPM which helps remove more water and reduce drying time.',
    gu: 'મહત્તમ સ્પિન સ્પીડ 1200 RPM છે જે વધુ પાણી દૂર કરવામાં અને સૂકવાને ટૂંકાવમાં મદદ કરે છે.' },

  { q: /energy|star/i,
    a: 'This is a 5-star energy rated appliance — very efficient on power consumption.',
    gu: 'આ એક 5-સ્ટાર એનર્જી રેટેડ ઉપકરણ છે — પાવર ખર્ચમાં ખૂબ અસરકારક.' },

  { q: /how to clean|clean|care/i,
    a: 'Use a mild detergent, run monthly drum clean cycle and wipe the door seal to avoid residue.',
    gu: 'હળવો ડિટર્જેન્ટ વાપરો, માસિક ડ્રમ ક્લીન સાઈકલ ચલાવો અને ડોર સીલ સાફ કરો.' },

  { q: /brand|company|model/i,
    a: 'This model is from ABC Electronics, known for durability and advanced features.',
    gu: 'આ મોડેલ ABC ઇલેક્ટ્રોનિક્સનું છે, જે ટકાઉપણું અને અદ્યતન સુવિધાઓ માટે જાણીતું છે.' },

  { q: /size|dimension|height|width|depth/i,
    a: 'The machine measures 85 cm in height, 60 cm in width and 55 cm in depth.',
    gu: 'આ મશીનની ઊંચાઈ 85 સેમી, પહોળાઈ 60 સેમી અને ઊંડાઈ 55 સેમી છે.' },

  { q: /water|litre|consumption/i,
    a: 'This model consumes approximately 60 liters of water per full wash cycle.',
    gu: 'આ મોડેલ દરેક પૂર્ણ વોશ સાયકલમાં અંદાજે 60 લિટર પાણી વાપરે છે.' },

  { q: /noise|sound|db|decibel/i,
    a: 'The machine operates at 52 dB during wash and 72 dB during spin — relatively quiet.',
    gu: 'આ મશીન ધોવાની પ્રક્રિયામાં 52 dB અને સ્પિન દરમિયાન 72 dB પર કાર્ય કરે છે — તુલનાત્મક રીતે શાંત છે.' },

  { q: /delivery|install|setup/i,
    a: 'Free delivery and installation are provided within city limits.',
    gu: 'શહેરની અંદર મફત ડિલિવરી અને ઇન્સ્ટોલેશન આપવામાં આવે છે.' },

  { q: /offer|discount|deal|sale/i,
    a: 'We currently have a festive discount available. Please check in-store for final price.',
    gu: 'હાલમાં તહેવારોમાં ડિસ્કાઉન્ટ ઉપલબ્ધ છે. અંતિમ કિંમત માટે સ્ટોરમાં તપાસો.' },

  { q: /service|repair|support|help/i,
    a: 'We provide doorstep service and free checkups during warranty period.',
    gu: 'અમે વોરંટી સમયગાળા દરમિયાન ડોરસ્ટેપ સર્વિસ અને મફત ચેકઅપ્સ પ્રદાન કરીએ છીએ.' },

  { q: /exchange|old machine|return/i,
    a: 'You can exchange your old appliance and get up to ₹5,000 off.',
    gu: 'તમે તમારું જૂનું ઉપકરણ એક્સચેન્જ કરી શકો છો અને ₹5,000 સુધીની છૂટ મેળવી શકો છો.' },

  // Default fallback (must be last)
  { q: /.*/,
    a: 'Sorry, I do not have that exact information. You can ask about price, capacity, warranty or cleaning.',
    gu: 'માફ કરશો, મારા પાસે તે ચોક્કસ માહિતી નથી. તમે કિંમત, ક્ષમતા, વોરંટી અથવા સફાઈ વિશે પૂછો.' }
];


/* ========== PRODUCT DATA
   Edit/add products here. For each product add English and Gujarati fields where indicated.
   Use the product.id as the query string: product.html?id=washing-machine-001&lang=en */
const products = {
  "washing-machine-001": {
    id: "washing-machine-001",
    title: "SuperClean 7 kg Front Load",
    title_gu: "સોપરક્લીન 7 કિગ્રા ફ્રન્ટ લોડ",
    price: 65000, // used by canned fallback if you want dynamic price in future
    sku: "WM-7000",
    images: ["assets/wm1.avif","assets/wm2.avif"],

    description: "This 7 kg front-load washing machine provides powerful cleaning with inverter technology and multiple wash programs.",
    description_gu: "આ 7 કિગ્રા ફ્રન્ટ-લોડ વોશિંગ મશીન ઇન્વર્ટર ટેક્નોલોજી અને મલ્ટિ-વોશ પ્રોગ્રામ સાથે શક્તિશાળી સફાઈ આપે છે.",

    specs: { "Capacity":"7 kg", "Spin":"1200 RPM", "Energy":"5 Star", "Warranty":"2 years", "Delivery":"3-5 days" },
    specs_gu: { "ક્ષમતા":"7 કિગ્રા", "સ્પિન":"1200 RPM", "એનર્જી":"5 સ્ટાર", "વોરંટી":"2 વર્ષ", "વિતરણ":"3-5 દિવસ" },

    features: ["Inverter motor","QuickWash 30min","Child lock"],
    features_gu: ["ઇન્વર્ટર મોટર","ફાસ્ટ વોશ 30 મિનિટ","બાળકો માટે લોક"]
  }
};

/* ========== UTILS ========== */
function getQueryParam(name){ return new URL(location.href).searchParams.get(name); }
function isGujaratiText(s){ return /[\u0A80-\u0AFF]/.test(s); }

/* ========== INIT ========== */
const id = getQueryParam('id') || 'washing-machine-001';
let LANG = getQueryParam('lang') || 'en';
const product = products[id] || products['washing-machine-001'];

/* Populate UI with product data */
function populateUI(){
  const titleEl = document.getElementById('title');
  const descEl = document.getElementById('description');
  const priceEl = document.getElementById('price');
  const skuEl = document.getElementById('sku');
  const pageUrlEl = document.getElementById('pageUrl');

  titleEl.textContent = (LANG==='gu' ? (product.title_gu||product.title) : product.title);
  descEl.textContent = (LANG==='gu' ? (product.description_gu||product.description) : product.description);
  priceEl.textContent = '₹' + (product.price||0).toLocaleString('en-IN');
  skuEl.textContent = product.sku || '';

  // specs
  const specsWrap = document.getElementById('specs');
  specsWrap.innerHTML = '';
  const specSrc = LANG==='gu' ? (product.specs_gu || product.specs) : product.specs;
  for(const k in specSrc){
    const div = document.createElement('div');
    div.innerHTML = `<strong>${k}</strong><div style="color:var(--muted)">${specSrc[k]}</div>`;
    specsWrap.appendChild(div);
  }

  // gallery
  const mainImg = document.getElementById('mainImg');
  const thumbs = document.getElementById('thumbs');
  if(product.images && product.images.length){
    mainImg.src = product.images[0];
    if(thumbs){ thumbs.innerHTML=''; product.images.forEach((s,i)=>{ const im=document.createElement('img'); im.src=s; im.style.width='56px'; im.style.margin='6px'; im.onclick=()=>mainImg.src=s; thumbs.appendChild(im); }); }
  }

  // QR (Google Chart API quick QR)
  const qrImg = document.getElementById('qrImg');
  if(qrImg){
    const url = encodeURIComponent(location.origin + location.pathname + '?id=' + product.id + '&lang=' + LANG);
    qrImg.src = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${url}`;
  }

  // set select
  const sel = document.getElementById('langSelect');
  if(sel) sel.value = LANG;
}
populateUI();

/* ========== TTS ========== */
function speakText(text){
  if(!('speechSynthesis' in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  const chooseLang = (LANG==='gu' || isGujaratiText(text)) ? 'gu-IN' : 'en-IN';
  utter.lang = chooseLang;

  const voices = window.speechSynthesis.getVoices();
  if(voices && voices.length){
    const v = voices.find(x=> x.lang && x.lang.toLowerCase().startsWith(chooseLang.toLowerCase()));
    if(v) utter.voice = v;
  } else {
    // some browsers load voices asynchronously
    window.speechSynthesis.onvoiceschanged = ()=> {
      const v2 = window.speechSynthesis.getVoices().find(x=> x.lang && x.lang.toLowerCase().startsWith(chooseLang.toLowerCase()));
      if(v2) utter.voice = v2;
      window.speechSynthesis.speak(utter);
    };
  }

  utter.rate = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

/* ========== LOCAL ANSWER logic using canned array ==========
   Picks Gujarati if LANG==='gu' OR if user input contains Gujarati characters */
function localAnswer(q) {
  if (!q) {
    const fb = canned[canned.length - 1];
    return LANG === 'gu' ? fb.gu : fb.a;
  }
  const text = String(q).trim();
  const preferGu = (LANG === 'gu') || isGujaratiText(text);

  for (let i = 0; i < canned.length; i++) {
    try {
      if (canned[i].q.test(text)) {
        return preferGu ? (canned[i].gu || canned[i].a) : (canned[i].a || canned[i].gu);
      }
    } catch (e) {
      console.warn('Invalid canned regex at index', i, e);
    }
  }
  const fallback = canned[canned.length - 1];
  return preferGu ? fallback.gu : fallback.a;
}

/* ========== HANDLERS ========== */
async function handleQuestion(text){
  if(!text) return;
  const t = text.trim();
  document.getElementById('transcript').textContent = (LANG==='gu' ? 'You: ' : 'You: ') + t;

  // No backend: always use localAnswer
  const ans = localAnswer(t);
  document.getElementById('transcript').textContent = (LANG==='gu' ? 'સહાયક: ' : 'Assistant: ') + ans;
  speakText(ans);
}

/* Buttons wiring */
document.getElementById('askBtn').addEventListener('click', ()=> {
  const q = document.getElementById('userText').value;
  handleQuestion(q);
});

document.getElementById('readDescBtn').addEventListener('click', ()=> {
  const text = (LANG==='gu' ? (product.description_gu || product.description) : product.description);
  speakText(text);
});

/* Language select */
document.getElementById('langSelect').addEventListener('change', (e)=> {
  LANG = e.target.value;
  const u = new URL(location.href);
  u.searchParams.set('lang', LANG);
  history.replaceState(null,'',u.toString());
  populateUI();
  initRecognition(); // re-init recognition with new lang
});

/* ========== SPEECH RECOGNITION (if supported) ========== */
let recognition = null;
function initRecognition(){
  if(recognition){ try{ recognition.onresult=null; recognition.onend=null; recognition=null; } catch(e){} }
  if(window.SpeechRecognition || window.webkitSpeechRecognition){
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SR();
    recognition.lang = (LANG==='gu') ? 'gu-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (e)=> {
      const text = e.results[0][0].transcript;
      document.getElementById('userText').value = text;
      handleQuestion(text);
    };
    recognition.onerror = (ev)=> {
      document.getElementById('transcript').textContent = 'Error: ' + ev.error;
    };
    recognition.onend = ()=> {
      document.getElementById('micBtn').classList.remove('listening');
    };
  } else recognition = null;
}
initRecognition();

document.getElementById('micBtn').addEventListener('click', ()=> {
  if(!recognition){
    const q = prompt((LANG==='gu') ? 'વાક્ય લખો:' : 'Type your question:');
    if(q) { document.getElementById('userText').value = q; handleQuestion(q); }
    return;
  }
  try {
    const btn = document.getElementById('micBtn');
    if(btn.classList.contains('listening')) { recognition.stop(); btn.classList.remove('listening'); }
    else { recognition.lang = (LANG==='gu') ? 'gu-IN' : 'en-IN'; recognition.start(); btn.classList.add('listening'); document.getElementById('transcript').textContent = (LANG==='gu' ? 'Listening...' : 'Listening...'); }
  } catch(e) { console.warn(e); }
});

/* expose for debug if needed */
window._PRODUCT = product;
window._LANG = LANG;