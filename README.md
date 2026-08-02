# 55號洗衣店 · 營收記帳

給媽媽在店裡輸入每次收零錢/紙鈔的數量,並可以在任何裝置上查看營收分析的小網站。

純 HTML/CSS/JS,不需要 Node.js 或任何建置工具,資料存放在免費的 Supabase 雲端資料庫。

## 功能

- `login.html`:登入頁(帳號密碼保護,避免外人看到營收)
- `entry.html`:每台機器直接輸入當次收款總金額(不拆硬幣/紙鈔),洗衣機會自動算出洗了幾次
- `bulk-entry.html`:一次補登多筆過去的舊資料,每列直接填總金額(不拆硬幣/紙鈔)
- `expense.html`:記錄支出(日期、項目、金額),可刪除
- `dashboard.html`:本週/本月/累計營收、近 12 週與近 6 個月趨勢圖、歷史紀錄列表(可刪除)

## 第一次設定步驟

### 1. 建立 Supabase 專案(免費)

1. 到 https://supabase.com 註冊並登入
2. 建立一個新 Project(名稱隨意,例如 `laundry-cashbook`),記下設定的資料庫密碼
3. 專案建立完成後,左側選單找 **SQL Editor**,貼上 `supabase-schema.sql` 這個檔案的全部內容,執行(Run)
4. 左側選單找 **Project Settings → API**,複製:
   - `Project URL`
   - `anon public` key
5. 打開 `assets/js/supabase-client.js`,把 `SUPABASE_URL` 和 `SUPABASE_ANON_KEY` 換成剛剛複製的值

### 2. 建立登入帳號(給媽媽和你共用)

1. 在 Supabase 左側選單找 **Authentication → Users**
2. 點 **Add user → Create new user**
3. 輸入一組 email 和密碼(登入頁只需要輸入密碼,email 寫死在 `login.html` 的 `FAMILY_EMAIL` 常數裡)
4. 記下這組帳密,之後你和媽媽登入網站都用這組密碼

> 之後如果想換密碼或帳號,刪除舊的 user 重新建立一個同樣可以,別忘了同步更新 `login.html` 裡的 `FAMILY_EMAIL`。

### 3. 本機預覽

因為是純靜態網頁,直接用瀏覽器打開 `login.html` 就能測試(部分瀏覽器對 `file://` 開啟 fetch 有限制,建議用 VS Code 的 Live Server 擴充功能,或任何簡易本機伺服器)。

### 4. 部署上網(免費,不需要安裝 Node.js)

推薦用 **Vercel** 或 **Netlify**,兩者都支援直接串接 GitHub repo、不需要任何 build 指令:

1. 把這個資料夾推到 GitHub(建一個新 repo,例如 `laundry-cashbook`)
2. 到 https://vercel.com (或 https://netlify.com) 用 GitHub 帳號登入
3. 選擇「Import」剛剛的 repo,Framework 選 **Other / No build command**,直接部署
4. 部署完成後會拿到一個網址(例如 `laundry-cashbook.vercel.app`),之後每次 `git push` 都會自動更新網站
5. 把這個網址加到媽媽手機的主畫面(瀏覽器分享 →「加入主畫面」),看起來就像一個 App

## 洗衣機自動換算次數

`entry.html` 裡洗衣機 1-3 每次 $60、第 4 台每次 $100,填總金額後會自動算出「洗了幾次」。2026-03-01 之後的日期,送出時這個次數會自動加進該台機器的備注欄。價格要改的話直接改 `entry.html` 裡的 `PRICE_PER_WASH`。

## 舊資料補登(只有總金額,沒有面額明細)

「批次補登」頁每一列都是「日期 + 機台 + 總金額 + 備註」,不會再拆硬幣/紙鈔。如果舊資料沒有分機台,機台選「總收入(舊資料,無機台明細)」;有分洗衣機/烘衣機但不知道是第幾台,選「洗衣機總收入」或「烘衣機總收入」。總金額存在資料庫的 `manual_total` 欄位,分析頁會優先用這個數字當那筆紀錄的總計。

> 如果 Supabase 專案是在這次改動之前建立的,要先到 SQL Editor 執行 `supabase-schema.sql` 最下面那段 `alter table ... add constraint` 的 migration,資料庫才會接受 `wash_total` / `dry_total` 這兩個新機台值。

## 投幣機現鈔:總金額 + 1000/500 元張數

「投幣機現鈔」不算進店裡營收(看分析頁的統計和趨勢圖都會自動排除它,但另外有一張自己的趨勢圖)。`entry.html` 和「批次補登」選這台機器時,除了總金額,都會多兩個欄位可以填 1000 元、500 元各幾張,填了會自動組成「1000元 X張、500元 Y張」寫進備注欄(`entry.html` 只在 2026-06-01 之後的日期才會自動寫;批次補登不限日期,只要有填就會寫)。

## 支出記錄

在「支出」頁可以記錄每一筆支出:日期、項目(例如水電費、修機台)、金額,列表可刪除。資料存在獨立的 `expenses` 資料表,跟收款紀錄分開,不會混在營收分析裡。

> 同樣如果 Supabase 專案是舊的,要到 SQL Editor 執行 `supabase-schema.sql` 裡新增的 `create table if not exists expenses ...` 那一整段(建表 + RLS policy),才能開始使用支出頁。
