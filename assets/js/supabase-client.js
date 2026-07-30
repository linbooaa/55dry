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
