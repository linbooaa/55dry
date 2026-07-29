// 請依照 README.md 的步驟,把下面兩個值換成你自己 Supabase 專案的資訊
// Supabase Dashboard -> Project Settings -> API
const SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";

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
