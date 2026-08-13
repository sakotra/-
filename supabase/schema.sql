-- 軽貨物 請求書作成システム — Supabase スキーマ
-- Supabase ダッシュボード → SQL Editor に貼り付けて実行してください。

-- 請求書テーブル
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  invoice_no text,
  client_name text,
  issue_date date,
  total integer not null default 0,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists invoices_user_id_created_idx
  on public.invoices (user_id, created_at desc);

-- 行レベルセキュリティ（自分のデータonly）
alter table public.invoices enable row level security;

drop policy if exists "invoices_select_own" on public.invoices;
create policy "invoices_select_own"
  on public.invoices for select
  using (auth.uid() = user_id);

drop policy if exists "invoices_insert_own" on public.invoices;
create policy "invoices_insert_own"
  on public.invoices for insert
  with check (auth.uid() = user_id);

drop policy if exists "invoices_update_own" on public.invoices;
create policy "invoices_update_own"
  on public.invoices for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "invoices_delete_own" on public.invoices;
create policy "invoices_delete_own"
  on public.invoices for delete
  using (auth.uid() = user_id);

-- updated_at 自動更新
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists invoices_set_updated_at on public.invoices;
create trigger invoices_set_updated_at
  before update on public.invoices
  for each row execute function public.set_updated_at();
