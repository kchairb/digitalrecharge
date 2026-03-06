alter table public.products
add column if not exists is_pack boolean not null default false;

create table if not exists public.product_pack_items (
  pack_product_id bigint not null references public.products(id) on delete cascade,
  included_product_id bigint not null references public.products(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (pack_product_id, included_product_id),
  check (pack_product_id <> included_product_id)
);

create index if not exists idx_product_pack_items_pack on public.product_pack_items(pack_product_id);
create index if not exists idx_product_pack_items_included on public.product_pack_items(included_product_id);

alter table public.product_pack_items enable row level security;

drop policy if exists "product_pack_items_public_read" on public.product_pack_items;
create policy "product_pack_items_public_read" on public.product_pack_items
for select using (true);

drop policy if exists "product_pack_items_admin_write" on public.product_pack_items;
create policy "product_pack_items_admin_write" on public.product_pack_items
for all using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create table if not exists public.site_visits (
  id bigint generated always as identity primary key,
  visitor_id text not null,
  path text not null,
  referrer text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists idx_site_visits_created_at on public.site_visits(created_at desc);
create index if not exists idx_site_visits_path on public.site_visits(path);
create index if not exists idx_site_visits_visitor_id on public.site_visits(visitor_id);

alter table public.site_visits enable row level security;

drop policy if exists "site_visits_insert_public" on public.site_visits;
create policy "site_visits_insert_public" on public.site_visits
for insert with check (true);

drop policy if exists "site_visits_admin_read" on public.site_visits;
create policy "site_visits_admin_read" on public.site_visits
for select using (public.is_admin(auth.uid()));

with category_ai as (
  select id from public.categories where slug = 'ai-tools' limit 1
)
insert into public.products (
  name,
  slug,
  category_id,
  price_dt,
  short_description,
  long_description,
  delivery_time,
  requirements,
  refund_policy,
  is_featured,
  image_url,
  is_pack
)
values (
  'Student Pack',
  'student-pack',
  (select id from category_ai),
  60,
  'Student essentials: Cursor Pro + ChatGPT + Canva Pro.',
  'Includes the most requested student tools in one discounted pack: Cursor Pro, ChatGPT, and Canva Pro.',
  'Instant / 5-20 min',
  'Share your contact details so we can complete all activations.',
  'Refund applies only if one or more included services cannot be delivered.',
  true,
  '/products/cursor-pro.svg',
  true
)
on conflict (slug) do update
set
  name = excluded.name,
  category_id = excluded.category_id,
  price_dt = excluded.price_dt,
  short_description = excluded.short_description,
  long_description = excluded.long_description,
  delivery_time = excluded.delivery_time,
  requirements = excluded.requirements,
  refund_policy = excluded.refund_policy,
  is_featured = excluded.is_featured,
  image_url = excluded.image_url,
  is_pack = true;

delete from public.product_pack_items
where pack_product_id = (select id from public.products where slug = 'student-pack' limit 1);

insert into public.product_pack_items (pack_product_id, included_product_id)
select
  (select id from public.products where slug = 'student-pack' limit 1),
  p.id
from public.products p
where p.slug in ('cursor-pro', 'chatgpt-account', 'canva-pro')
on conflict do nothing;
