-- 在 Supabase 專案的 SQL Editor 貼上並執行這整份檔案

create table collections (
  id uuid primary key default gen_random_uuid(),
  collected_at date not null,
  machine text not null check (machine in (
    'wash_1', 'wash_2', 'wash_3', 'wash_4',
    'dry_1', 'dry_2', 'dry_3',
    'exchange', 'purchase',
    'wash_total', -- 補登舊資料用,當時有分洗衣機/烘衣機但沒分台數
    'dry_total',
    'total' -- 補登舊資料用,當時完全沒有分機台記錄
  )),
  coin_10 integer not null default 0,
  coin_50 integer not null default 0,
  bill_100 integer not null default 0,
  bill_500 integer not null default 0,
  bill_1000 integer not null default 0,
  manual_total integer,
  note text,
  created_at timestamptz not null default now()
);

-- 舊資料補登用:如果只知道當天總金額、沒有面額明細,直接填這欄,不用拆成硬幣/紙鈔
alter table collections add column if not exists manual_total integer;

-- 開啟 Row Level Security,預設所有人都不能存取
alter table collections enable row level security;

-- 只允許「已登入」的使用者讀寫(登入帳號在下方步驟建立,只給家人使用)
create policy "authenticated read" on collections
  for select using (auth.role() = 'authenticated');

create policy "authenticated insert" on collections
  for insert with check (auth.role() = 'authenticated');

create policy "authenticated update" on collections
  for update using (auth.role() = 'authenticated');

create policy "authenticated delete" on collections
  for delete using (auth.role() = 'authenticated');

-- 既有專案要新增「洗衣機/烘衣機分開的舊資料」機台時,在 SQL Editor 貼上並執行這一段即可
-- （新建立的專案照上面整份執行過一次的話,不需要再跑這段）
alter table collections drop constraint if exists collections_machine_check;
alter table collections add constraint collections_machine_check check (machine in (
  'wash_1', 'wash_2', 'wash_3', 'wash_4',
  'dry_1', 'dry_2', 'dry_3',
  'exchange', 'purchase',
  'wash_total', 'dry_total', 'total'
));

-- 支出紀錄(幾月幾號、項目、金額)
create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  expense_date date not null,
  item text not null,
  amount integer not null,
  created_at timestamptz not null default now()
);

alter table expenses enable row level security;

create policy "authenticated read" on expenses
  for select using (auth.role() = 'authenticated');

create policy "authenticated insert" on expenses
  for insert with check (auth.role() = 'authenticated');

create policy "authenticated update" on expenses
  for update using (auth.role() = 'authenticated');

create policy "authenticated delete" on expenses
  for delete using (auth.role() = 'authenticated');
