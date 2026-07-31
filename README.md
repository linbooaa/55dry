# 55號洗衣店 · 營收記帳

給媽媽在店裡輸入每次收零錢/紙鈔的數量,並可以在任何裝置上查看營收分析的小網站。

純 HTML/CSS/JS,不需要 Node.js 或任何建置工具,資料存放在免費的 Supabase 雲端資料庫。

## 功能

- `login.html`:登入頁(帳號密碼保護,避免外人看到營收)
- `entry.html`:輸入當次收款的 10 元硬幣、50 元硬幣、100/500/1000 元紙鈔數量,自動算總額
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

## 幣值說明

目前只計算:10 元硬幣、50 元硬幣、100 / 500 / 1000 元紙鈔。如果之後要增加其他面額,需要同時修改 `entry.html`、`dashboard.html` 和 `supabase-schema.sql` 三個檔案裡的欄位。

## 舊資料補登(只有總金額,沒有面額明細)

在「批次補登」頁,機台選「總收入(舊資料,無機台明細)」時,會多一個「總金額(舊資料)」欄位,可以直接填當天總收入,不用硬拆成幾個 10 元、幾張 100 元。這個總額存在資料庫的 `manual_total` 欄位,分析頁會優先使用這個數字當作那筆紀錄的總計。
