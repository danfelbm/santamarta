-- Santa & Beyond — tabla de gastos para "The Crew"
-- Pega y ejecuta TODO esto en Supabase → SQL Editor (es idempotente, puedes correrlo varias veces).

create table if not exists public.gastos (
  id         uuid primary key default gen_random_uuid(),
  person     text not null,                 -- id de la viajera: helen / melanie / natalia / aleja / malena
  category   text not null,                 -- bolsa: hospedaje / vuelos / tayrona / transporte / mercado
  amount     bigint not null check (amount >= 0),
  concept    text not null default '',
  created_at timestamptz not null default now()
);

-- Acceso abierto (sitio privado compartido entre las 5). Lo controla RLS.
alter table public.gastos enable row level security;

drop policy if exists "gastos_select" on public.gastos;
drop policy if exists "gastos_insert" on public.gastos;
drop policy if exists "gastos_update" on public.gastos;
drop policy if exists "gastos_delete" on public.gastos;

create policy "gastos_select" on public.gastos for select using (true);
create policy "gastos_insert" on public.gastos for insert with check (true);
create policy "gastos_update" on public.gastos for update using (true) with check (true);
create policy "gastos_delete" on public.gastos for delete using (true);

-- Saldos en vivo entre dispositivos (Realtime). Ignora el error si ya estaba.
do $$
begin
  alter publication supabase_realtime add table public.gastos;
exception when duplicate_object then null;
end $$;


-- ============================================================
-- Checklist de mercado (sección "Mercado & snacks")
-- ============================================================
create table if not exists public.mercado (
  item_id    text primary key,             -- id del ítem (ej. m-huevos) o c-<uuid> si es personalizado
  bought     boolean not null default false,
  name       text,                         -- solo para ítems personalizados
  price      bigint,                        -- solo para ítems personalizados
  grp        text,                          -- grupo del ítem personalizado
  custom     boolean not null default false,
  updated_at timestamptz not null default now()
);

-- por si la tabla ya existía sin estas columnas:
alter table public.mercado add column if not exists name   text;
alter table public.mercado add column if not exists price  bigint;
alter table public.mercado add column if not exists grp    text;
alter table public.mercado add column if not exists custom boolean not null default false;

alter table public.mercado enable row level security;

drop policy if exists "mercado_select" on public.mercado;
drop policy if exists "mercado_insert" on public.mercado;
drop policy if exists "mercado_update" on public.mercado;
drop policy if exists "mercado_delete" on public.mercado;

create policy "mercado_select" on public.mercado for select using (true);
create policy "mercado_insert" on public.mercado for insert with check (true);
create policy "mercado_update" on public.mercado for update using (true) with check (true);
create policy "mercado_delete" on public.mercado for delete using (true);

do $$
begin
  alter publication supabase_realtime add table public.mercado;
exception when duplicate_object then null;
end $$;
