// =============================
// 登場人物
// =============================
const SPEAKERS = {
  ojisan1: { key:"ojisan1", who:"おじさん", name:"いいこと言いそうなおじさん", hint:"ボタンを押すとしゃべる。", img:"assets/ojisan1.png" },
  ojisan2: { key:"ojisan2", who:"おじさん", name:"いいこと言いそうなおじさん（別）", hint:"ボタンを押すとしゃべる。", img:"assets/ojisan2.png" },
  baby:    { key:"baby",   who:"赤ちゃん", name:"腹立つこと言いそうな赤ちゃん", hint:"ボタンを押すとしゃべる。", img:"assets/baby.png" },
};
const OJISANS = [SPEAKERS.ojisan1, SPEAKERS.ojisan2];

// =============================
// 初期セリフ（localStorageで編集可）
// =============================
const DEFAULT_GOOD = [
  "結果が出る日って、努力した日のすぐ後じゃなくて、忘れたころに来るんだよ。",
  "ちゃんと休むのも、前に進むための仕事だよ。",
  "うまくいかない日があるのは、挑戦してる証拠だね。",
  "遠回りに見える道が、いちばん景色をくれることもある。",
  "急がなくていい。やめなければ、進んでる。",
  "小さな達成を、ちゃんと祝える人が強い。",
  "迷ってる時点で、ちゃんと考えてるってことだよ。",
  "今日は100点じゃなくていい。続ければ、後で100点になる。"
];

// “腹立つ”はミックス（煽り／ド正論／小馬鹿／マウント／淡々）
const DEFAULT_BABY = [
  "へぇ〜それ、まだ終わってないんだ？（にや）",
  "“今からやる”って、何回目？",
  "やる気があるなら、まず5分だけ手を動かしてみたら？",
  "時間がないなら、優先順位つけるしかなくない？",
  "その計画、気持ちだけは立派だね。",
  "その説明、ちょっと長くない？要点どこ？",
  "それ、昨日できたけど？（笑顔）",
  "へー…それが“ベスト”なんだ？",
  "事実として、進捗は0だよ。",
  "やらない理由は増えてる。やった量は増えてない。"
];

// =============================
// おみくじ（運勢だけ）
// =============================
const LUCKS = ["大吉","中吉","吉","末吉","小吉","凶","大凶"];
const P_SHOW_LUCK = 0.65;     // おみくじ表示する確率（表示しない回は ---）
const P_BABY = 0.12;          // 赤ちゃん登場確率（たまに）
const P_DAIKYO_BONUS = 0.06;  // 大凶を少し出やすくする（好みで調整OK）

// =============================
// localStorage
// =============================
const LS_GOOD = "ojisan_good_quotes_v2";
const LS_BABY = "ojisan_baby_quotes_v2";

function loadLines(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    if(!raw) return [...fallback];
    const arr = JSON.parse(raw);
    if(!Array.isArray(arr)) return [...fallback];
    const cleaned = arr.map(s => String(s).trim()).filter(Boolean);
    return cleaned.length ? cleaned : [...fallback];
  }catch{
    return [...fallback];
  }
}

function saveLines(key, lines){
  const cleaned = lines.map(s => String(s).trim()).filter(Boolean);
  localStorage.setItem(key, JSON.stringify(cleaned));
}

let goodQuotes = loadLines(LS_GOOD, DEFAULT_GOOD);
let babyQuotes = loadLines(LS_BABY, DEFAULT_BABY);

// =============================
// UI
// =============================
const speakerImg  = document.getElementById("speakerImg");
const speakerName = document.getElementById("speakerName");
const speakerHint = document.getElementById("speakerHint");

const msgEl = document.getElementById("msg");
const btn = document.getElementById("btn");
const btnEdit = document.getElementById("btnEdit");
const btnCopy = document.getElementById("btnCopy");

const whoLabel = document.getElementById("whoLabel");
const luckLabel = document.getElementById("luckLabel");

const dot = document.getElementById("dot");
const statusText = document.getElementById("statusText");

const fxLux = document.getElementById("fxLux");
const fxSad = document.getElementById("fxSad");

// modal
const modal = document.getElementById("modal");
const btnClose = document.getElementById("btnClose");
const btnSave = document.getElementById("btnSave");
const btnReset = document.getElementById("btnReset");
const taGood = document.getElementById("taGood");
const taBaby = document.getElementById("taBaby");
const tabs = [...document.querySelectorAll(".tab")];
const panels = [...document.querySelectorAll(".panel")];

// =============================
// util
// =============================
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function typeText(text){
  msgEl.textContent = "";
  for (const c of [...text]){
    msgEl.textContent += c;
    await sleep(14 + Math.random() * 22);
  }
}

function setSpeaking(on){
  btn.disabled = on;
  dot.className = "dot" + (on ? " speaking" : "");
  statusText.textContent = on ? "考えてる…" : "待機中";
}

function setSpeaker(s){
  speakerImg.src = s.img;
  speakerName.textContent = s.name;
  speakerHint.textContent = s.hint;
  whoLabel.textContent = s.who;
}

function clearFX(){
  fxLux.classList.remove("on");
  fxSad.classList.remove("on");
}

function rollLuck(){
  clearFX();

  if(Math.random() > P_SHOW_LUCK){
    luckLabel.textContent = "---";
    return null;
  }

  // 大凶ちょい増し（他はランダム）
  const pDaikyo = Math.min(0.30, (1 / LUCKS.length) + P_DAIKYO_BONUS);
  let luck;
  if(Math.random() < pDaikyo) luck = "大凶";
  else luck = pick(LUCKS.filter(x => x !== "大凶"));

  luckLabel.textContent = luck;

  if(luck === "大吉") fxLux.classList.add("on");
  if(luck === "大凶") fxSad.classList.add("on");

  return luck;
}

// =============================
// main
// =============================
async function talk(){
  if(btn.disabled) return;

  setSpeaking(true);
  rollLuck();
  await sleep(220 + Math.random() * 260);

  const isBaby = Math.random() < P_BABY;
  if(isBaby){
    setSpeaker(SPEAKERS.baby);
    await typeText(pick(babyQuotes));
    setSpeaking(false);
    return;
  }

  setSpeaker(pick(OJISANS));
  await typeText(pick(goodQuotes));
  setSpeaking(false);
}

// =============================
// modal（編集）
// =============================
function openModal(){
  taGood.value = goodQuotes.join("\n");
  taBaby.value = babyQuotes.join("\n");
  modal.classList.add("show");
  modal.setAttribute("aria-hidden","false");
}
function closeModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden","true");
}
function setActiveTab(tabKey){
  tabs.forEach(t => t.classList.toggle("active", t.dataset.tab === tabKey));
  panels.forEach(p => p.classList.toggle("hidden", p.dataset.panel !== tabKey));
}

// =============================
// events
// =============================
btn.addEventListener("click", talk);

btnCopy.addEventListener("click", async () => {
  const text = msgEl.textContent.trim();
  if(!text) return;
  try{ await navigator.clipboard.writeText(text); }catch{}
});

btnEdit.addEventListener("click", openModal);
btnClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if(e.target === modal) closeModal(); });

tabs.forEach(t => t.addEventListener("click", () => setActiveTab(t.dataset.tab)));

btnSave.addEventListener("click", () => {
  const g = taGood.value.split("\n").map(s => s.trim()).filter(Boolean);
  const b = taBaby.value.split("\n").map(s => s.trim()).filter(Boolean);
  goodQuotes = g.length ? g : [...DEFAULT_GOOD];
  babyQuotes = b.length ? b : [...DEFAULT_BABY];
  saveLines(LS_GOOD, goodQuotes);
  saveLines(LS_BABY, babyQuotes);
  closeModal();
});

btnReset.addEventListener("click", () => {
  goodQuotes = [...DEFAULT_GOOD];
  babyQuotes = [...DEFAULT_BABY];
  taGood.value = goodQuotes.join("\n");
  taBaby.value = babyQuotes.join("\n");
  saveLines(LS_GOOD, goodQuotes);
  saveLines(LS_BABY, babyQuotes);
});

// 初期
setSpeaker(SPEAKERS.ojisan1);
setActiveTab("good");
