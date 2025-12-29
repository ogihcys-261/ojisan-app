// =============================
// 登場人物
// =============================
const SPEAKERS = {
  ojisan1: { key: "ojisan1", who: "おじさん", name: "いいこと言いそうなおじさん", hint: "ボタンを押すとしゃべる。", img: "assets/ojisan1.png" },
  ojisan2: { key: "ojisan2", who: "おじさん", name: "いいこと言いそうなおじさん（別）", hint: "ボタンを押すとしゃべる。", img: "assets/ojisan2.png" },
  baby:    { key: "baby",   who: "赤ちゃん", name: "腹立つこと言いそうな赤ちゃん", hint: "ボタンを押すとしゃべる。", img: "assets/baby.png" },
};
const OJISANS = [SPEAKERS.ojisan1, SPEAKERS.ojisan2];

// =============================
// 初期セリフ（localStorageで編集可）
// =============================
const DEFAULT_GOOD = [
  // もともとのやつ
  "結果が出る日って、努力した日のすぐ後じゃなくて、忘れたころに来るんだよ。",
  "ちゃんと休むのも、前に進むための仕事だよ。",
  "うまくいかない日があるのは、挑戦してる証拠だね。",
  "遠回りに見える道が、いちばん景色をくれることもある。",
  "急がなくていい。やめなければ、進んでる。",
  "小さな達成を、ちゃんと祝える人が強い。",
  "迷ってる時点で、ちゃんと考えてるってことだよ。",
  "今日は100点じゃなくていい。続ければ、後で100点になる。",

  // 追加名言
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
  "「どうするか」を考えない人に、「どうなるか」は見えない。",
  "できることから始めるのではなく、正しいことから始めるのです。",
  "愛のない選択は、決して良い結果にはならない。",
  "言葉で諦める者は、現実でも諦める。",
  "私が人生で学んだことは、自分が今もっている力を全部使えということです。"
];

const DEFAULT_BABY = [
  "へぇ〜それ、まだ終わってないんだ？（にや）",
  "「今からやる」って、何回目？",
  "やる気があるなら、まず5分だけ手を動かしてみたら？",
  "時間がないなら、優先順位つけるしかなくない？",
  "その計画、気持ちだけは立派だね。",
  "その説明、ちょっと長くない？要点どこ？",
  "それ、昨日できたけど？（笑顔）",
  "へー…それが「ベスト」なんだ？",
  "事実として、進捗は0だよ。",
  "やらない理由は増えてる。やった量は増えてない。"
];

// =============================
// 確率
// =============================
const P_BABY = 0.12;          // 赤ちゃん登場確率
const P_OMIKUJI_EVENT = 0.18; // 名言の後に「たまに」おみくじが出る確率
const P_DAIKYO_BONUS = 0.06;  // 大凶ちょい増し

// =============================
// おみくじ
// =============================
const LUCKS = ["大吉", "中吉", "吉", "末吉", "小吉", "凶", "大凶"];

// =============================
// localStorage（編集保存）
// =============================
const LS_GOOD = "ojisan_good_quotes_v4";
const LS_BABY = "ojisan_baby_quotes_v4";

function loadLines(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [...fallback];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [...fallback];
    const cleaned = arr.map(s => String(s).trim()).filter(Boolean);
    return cleaned.length ? cleaned : [...fallback];
  } catch {
    return [...fallback];
  }
}

function saveLines(key, lines) {
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

const dot = document.getElementById("dot");
const statusText = document.getElementById("statusText");

// 演出
const fxLux = document.getElementById("fxLux");
const fxSad = document.getElementById("fxSad");
const fxParty = document.getElementById("fxParty");

// セリフ編集モーダル
const modal = document.getElementById("modal");
const btnClose = document.getElementById("btnClose");
const btnSave = document.getElementById("btnSave");
const btnReset = document.getElementById("btnReset");
const taGood = document.getElementById("taGood");
const taBaby = document.getElementById("taBaby");
const tabs = [...document.querySelectorAll(".tab")];
const panels = [...document.querySelectorAll(".panel")];

// おみくじ（全画面）
const omikuji = document.getElementById("omikuji");
const omikujiLuckEl = document.getElementById("omikujiLuck");
const btnOmikujiClose = document.getElementById("btnOmikujiClose");

// =============================
// util
// =============================
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function typeText(text) {
  msgEl.textContent = "";
  for (const c of String(text)) {
    msgEl.textContent += c;
    await sleep(14 + Math.random() * 22);
  }
}

function setSpeaking(on) {
  btn.disabled = on;
  dot.className = "dot" + (on ? " speaking" : "");
  statusText.textContent = on ? "考えてる…" : "待機中";
}

function setSpeaker(s) {
  speakerImg.src = s.img;
  speakerName.textContent = s.name;
  speakerHint.textContent = s.hint;
  whoLabel.textContent = s.who;
}

function clearFX() {
  fxLux?.classList.remove("on");
  fxSad?.classList.remove("on");
  fxParty?.classList.remove("on");
}

// =============================
// おみくじ表示
// =============================
function pickLuck() {
  const pDaikyo = Math.min(0.30, (1 / LUCKS.length) + P_DAIKYO_BONUS);
  if (Math.random() < pDaikyo) return "大凶";
  return pick(LUCKS.filter(x => x !== "大凶"));
}

function showOmikuji(luck) {
  if (!omikuji) return;
  omikujiLuckEl.textContent = luck;

  omikuji.classList.remove("good", "bad");
  if (luck === "大吉") omikuji.classList.add("good");
  if (luck === "大凶") omikuji.classList.add("bad");

  omikuji.classList.add("show");
  omikuji.setAttribute("aria-hidden", "false");
}

function hideOmikuji() {
  if (!omikuji) return;
  omikuji.classList.remove("show", "good", "bad");
  omikuji.setAttribute("aria-hidden", "true");
  // 何事もなかったように（演出も戻す）
  clearFX();
}

btnOmikujiClose?.addEventListener("click", hideOmikuji);
// 背景クリックでも閉じたいならON（任意）
// omikuji?.addEventListener("click", (e) => { if (e.target === omikuji) hideOmikuji(); });

// =============================
// main
// =============================
async function talk() {
  if (btn.disabled) return;

  // おみくじが出てる
