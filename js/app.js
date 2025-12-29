// =============================
// 登場人物
// =============================
const SPEAKERS = {
  ojisan1: { key:"ojisan1", who:"おじさん", name:"いいこと言いそうなおじさん", hint:"なんかそれっぽいことを言う。", img:"assets/ojisan1.png" },
  ojisan2: { key:"ojisan2", who:"おじさん", name:"いいこと言いそうなおじさん（別）", hint:"別の角度でそれっぽいことを言う。", img:"assets/ojisan2.png" },
  baby:   { key:"baby",   who:"赤ちゃん", name:"腹立つこと言いそうな赤ちゃん", hint:"たまに出てきて、ちょい腹立つことを言う。", img:"assets/baby.png" },
};
const OJISANS = [SPEAKERS.ojisan1, SPEAKERS.ojisan2];

// =============================
// 初期セリフ（localStorageで上書き可能）
// =============================
const DEFAULT_GOOD = [
  "夢はでっかく根はふかく",
  "誰かの為に生きてこそ、人生には価値がある",
  "創作は常に冒険である。所詮は人力を尽した後、天命にまかせるより仕方はない",
  "知識は、すべての進歩と改良の真の源泉である。",
  "あなたが始めるべきだ。他の人が協力的であるかどうかなど考えることなく",
  "すべての者は生まれながらに知恵を求める。",
  "未来には、誰でも15分間は世界的な有名人になれるだろう。",
  "すべての人間の一生は、神の手によって書かれた童話にすぎない。",
  "可能性を超えたものが、人の心に残る。",
  "チャンスに出会わない人間は、一人もいない。それをチャンスにできなかっただけである。",
  "希望があるところに人生もある。希望が新しい勇気をもたらし、再び強い気持ちにしてくれる。",
  "歩け、歩け。続ける事の大切さ。",
  "夢見ることができれば、それは実現できる。",
  "どんな関係においても大切なことは、何を受け取ったかではなく、何を与えたかです。",
  "何より大事なのは、人生を楽しむこと。幸せを感じること、それだけです。",
  "芸術は爆発だ！",
  "最後に息を引き取るまで、夕暮れは暗闇にはなりません",
  "自己自身を選ぶための戦い、その獲得の行為を表す言葉、これが悔い改めである。",
  "希望とは、我々を成功に導く信仰です",
  "一生懸命に作ったものは、一生懸命見てもらえる。",
  "目の前の仕事に専念せよ。太陽光も一点に集めなければ発火しない",
  "本当の自由な心とは『認める』ということである。",
  "中間管理職と真のリーダーシップとの微妙な半歩の違いは、プレッシャーの下で優雅さを保てるかどうかだろう。",
  "小さなことこそ大切だというのが、ずっと私の信条だ。",
  "生きるべきか、死ぬべきか、それが問題だ。",
  "理想を持ったときに、一番大切なことは自分に約束をすること",
  "本当に幸福になれる者は、人に奉仕する道を探し求め、ついにそれを見出した者。これが私の確信である",
  "人を感動させるのは理性よりも感情です。あなたは感情に訴える方法を学びなさい。",
  "自分一人のものが夢。みんなで共有できる夢が志だ",
  "大きな夢を持って、その夢を持ち続けるんだ。その夢はきっと、君を他の人とは違う、特別な存在にしてくれる。",
  "感情や直感、望みに従い、ハッピーになれることをしなさい。",
  "人を信じよ、しかし、その百倍も自らを信じよ。",
  "何事も成功するまでは不可能に思えるものである。",
  "“どうするか“を考えない人に、“どうなるか“は見えない。",
  "できることから始めるのではなく、正しいことから始めるのです。",
  "愛のない選択は、決して良い結果にはならない。",
  "言葉で諦める者は、現実でも諦める。",
  "私が人生で学んだことは、自分が今もっている力を全部使えということです。"
];


const DEFAULT_BABY = [
  // 煽り
  "へぇ〜それ、まだ終わってないんだ？（にや）",
  "“今からやる”って、何回目？",
  // ド正論
  "やる気があるなら、まず5分だけ手を動かしてみたら？",
  "時間がないなら、優先順位つけるしかなくない？",
  // 小馬鹿
  "その計画、気持ちだけは立派だね。",
  "その説明、ちょっと長くない？要点どこ？",
  // マウント
  "それ、昨日できたけど？（笑顔）",
  "へー…それが“ベスト”なんだ？",
  // 淡々と刺す
  "事実として、進捗は0だよ。",
  "やらない理由は増えてる。やった量は増えてない。"
];

// =============================
// おみくじ（運勢だけ）
// =============================
const LUCKS = ["大吉","中吉","吉","末吉","小吉","凶","大凶"];

// =============================
// 状態（荒れ度システム）
// =============================
// chaos: 0.0〜1.0  連打で上がり、放置で下がる
let chaos = 0.0;
let lastPressAt = 0;

// base rates
const BASE_BABY = 0.07;   // 赤ちゃん基本
const BASE_LUCK = 0.35;   // おみくじが出る確率（毎回出すと飽きるので、出ない回も作る）
const BASE_DAIKYO = 0.06; // 大凶のベース（大凶演出の頻度）

// =============================
// 読み上げ（TTS）
// =============================
let ttsEnabled = false;
let ttsVoice = null;

// =============================
// localStorage
// =============================
const LS_GOOD = "ojisan_good_quotes_v1";
const LS_BABY = "ojisan_baby_quotes_v1";

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

// in-memory quotes
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
const btnTts = document.getElementById("btnTts");
const btnEdit = document.getElementById("btnEdit");
const btnCopy = document.getElementById("btnCopy");

const whoLabel = document.getElementById("whoLabel");
const luckLabel = document.getElementById("luckLabel");
const ttsLabel = document.getElementById("ttsLabel");

const dot = document.getElementById("dot");
const statusText = document.getElementById("statusText");

const fxLux = document.getElementById("fxLux");
const fxSad = document.getElementById("fxSad");

const chaosLabel = document.getElementById("chaosLabel");
const chaosBar = document.getElementById("chaosBar");

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
  const chars = [...text];
  for (const c of chars){
    msgEl.textContent += c;
    await sleep(16 + Math.random() * 24);
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

function setChaos(newVal){
  chaos = Math.max(0, Math.min(1, newVal));
  const pct = Math.round(chaos * 100);
  chaosLabel.textContent = `${pct}%`;
  chaosBar.style.width = `${pct}%`;
}

// 放置で落ち着く（毎フレームでやるほどでもないので、押すたびに計算）
function decayChaos(){
  const now = Date.now();
  if(!lastPressAt) return;
  const dt = Math.max(0, now - lastPressAt); // ms
  // 3秒ごとに少し落ちる。60秒でほぼ0に近づくくらい。
  const dec = dt / 60000; // 1分で1.0減るイメージ
  setChaos(chaos - dec);
}

function speak(text){
  if(!ttsEnabled) return;
  if(!("speechSynthesis" in window)) return;
  try{
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ja-JP";
    if(ttsVoice) u.voice = ttsVoice;
    u.rate = 1.0;
    u.pitch = 1.0;
    window.speechSynthesis.speak(u);
  }catch{}
}

function refreshTTSLabel(){
  ttsLabel.textContent = ttsEnabled ? "ON" : "OFF";
}

// voice取得（あれば日本語寄りを優先）
function initVoices(){
  if(!("speechSynthesis" in window)) return;
  const voices = window.speechSynthesis.getVoices?.() || [];
  if(!voices.length) return;
  const jp = voices.find(v => /ja|JP/i.test(v.lang));
  ttsVoice = jp || voices[0] || null;
}
if("speechSynthesis" in window){
  window.speechSynthesis.onvoiceschanged = () => initVoices();
  initVoices();
}

// =============================
// おみくじ（運勢だけ） + 演出
// =============================
function rollLuck(){
  // 毎回出すと重いので、一定確率で「---」
  const pShow = BASE_LUCK + chaos * 0.25; // 荒れると“妙に運勢気になる”みたいな頻度上げる
  if(Math.random() > Math.min(0.95, pShow)){
    luckLabel.textContent = "---";
    clearFX();
    return null;
  }

  // 大凶を荒れ度で増やす（他は均等気味）
  const pDaikyo = Math.min(0.35, BASE_DAIKYO + chaos * 0.25);
  let luck;
  if(Math.random() < pDaikyo){
    luck = "大凶";
  }else{
    luck = pick(LUCKS.filter(x => x !== "大凶"));
  }

  luckLabel.textContent = luck;

  // 演出：大吉は豪華、大凶は悲しい（コメントは出さない）
  clearFX();
  if(luck === "大吉") fxLux.classList.add("on");
  if(luck === "大凶") fxSad.classList.add("on");

  return luck;
}

// =============================
// main
// =============================
async function talk(){
  if(btn.disabled) return;

  // 放置分だけ荒れ度を下げてから、今回分を上げる
  decayChaos();

  const now = Date.now();
  const dt = now - lastPressAt;
  lastPressAt = now;

  // 連打ほど荒れる：押下間隔が短いほど増える
  const bump = dt < 1200 ? 0.10 : dt < 2500 ? 0.06 : 0.03;
  setChaos(chaos + bump);

  setSpeaking(true);
  clearFX();

  // 先に運勢だけ決めて表示（コメントなし）
  rollLuck();

  // 少し間
  await sleep(220 + Math.random() * 260);

  // 赤ちゃん率：荒れ度で増やす
  const babyRate = Math.min(0.55, BASE_BABY + chaos * 0.35);
  const isBaby = Math.random() < babyRate;

  if(isBaby){
    setSpeaker(SPEAKERS.baby);
    const line = pick(babyQuotes);
    await typeText(line);
    speak(line);
    setSpeaking(false);
    return;
  }

  // おじさん2種ランダム
  setSpeaker(pick(OJISANS));
  const line = pick(goodQuotes);
  await typeText(line);
  speak(line);

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

btnTts.addEventListener("click", () => {
  ttsEnabled = !ttsEnabled;
  refreshTTSLabel();
  if(!ttsEnabled && "speechSynthesis" in window) window.speechSynthesis.cancel();
});

btnCopy.addEventListener("click", async () => {
  const text = msgEl.textContent.trim();
  if(!text) return;
  try{
    await navigator.clipboard.writeText(text);
  }catch{
    alert("コピーできなかった（ブラウザの制限かも）");
  }
});

btnEdit.addEventListener("click", openModal);
btnClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if(e.target === modal) closeModal();
});

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
  if(!confirm("初期セリフに戻す？（保存済みの編集は消える）")) return;
  goodQuotes = [...DEFAULT_GOOD];
  babyQuotes = [...DEFAULT_BABY];
  taGood.value = goodQuotes.join("\n");
  taBaby.value = babyQuotes.join("\n");
  saveLines(LS_GOOD, goodQuotes);
  saveLines(LS_BABY, babyQuotes);
});

// 初期
setSpeaker(SPEAKERS.ojisan1);
setChaos(0);
refreshTTSLabel();
setActiveTab("good");
