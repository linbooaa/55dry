// 請依照 README.md 的步驟,把下面兩個值換成你自己 Supabase 專案的資訊
// Supabase Dashboard -> Project Settings -> API
const SUPABASE_URL = "https://fntqzkkenepnfotwehwi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZudHF6a2tlbmVwbmZvdHdlaHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMTU4MjAsImV4cCI6MjEwMDg5MTgyMH0.4JWeo37AQdx1_ZHC5oIKwqH3av8gN6Fqw0G9d5kEaao";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 確認登入狀態,沒登入就導回登入頁。回傳目前的 session。
async function requireSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = "login.html";
    return null;
  }
  return session;
}

async function signOut() {
  await supabaseClient.auth.signOut();
  window.location.href = "login.html";
}

// 用本地日期組件格式化,避免 toISOString() 轉 UTC 造成時區位移(台灣是 UTC+8)
function formatLocalDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// 機台清單:洗衣機、烘衣機、投幣機購買收的是硬幣;投幣機現鈔收的是紙鈔
const MACHINES = [
  { key: "wash_1", label: "洗衣機 1", type: "coin" },
  { key: "wash_2", label: "洗衣機 2", type: "coin" },
  { key: "wash_3", label: "洗衣機 3", type: "coin" },
  { key: "wash_4", label: "洗衣機 4", type: "coin" },
  { key: "dry_1", label: "烘衣機 1", type: "coin" },
  { key: "dry_2", label: "烘衣機 2", type: "coin" },
  { key: "dry_3", label: "烘衣機 3", type: "coin" },
  { key: "exchange", label: "投幣機現鈔", type: "bill" },
  { key: "purchase", label: "投幣機購買", type: "coin" },
];

// 補登舊資料用:當時沒有分機台記錄,只有一筆總額(硬幣、紙鈔都可能有)
const TOTAL_MACHINE = { key: "total", label: "總收入(舊資料,無機台明細)", type: "mixed" };

// 補登舊資料用:當時有分洗衣機/烘衣機,但沒有分是第幾台
const WASH_TOTAL_MACHINE = { key: "wash_total", label: "洗衣機總收入(舊資料,無機台明細)", type: "mixed" };
const DRY_TOTAL_MACHINE = { key: "dry_total", label: "烘衣機總收入(舊資料,無機台明細)", type: "mixed" };

// 機台下拉選單用的完整清單(含「總收入」選項),批次補登、分析頁會用到
const MACHINE_OPTIONS = [...MACHINES, WASH_TOTAL_MACHINE, DRY_TOTAL_MACHINE, TOTAL_MACHINE];

const MACHINE_LABELS = Object.fromEntries(MACHINE_OPTIONS.map((m) => [m.key, m.label]));
