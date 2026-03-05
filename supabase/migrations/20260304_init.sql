create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'payment_method') then
    create type public.payment_method as enum ('flouci', 'd17', 'bank_transfer');
  end if;
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type public.order_status as enum ('pending_payment', 'paid', 'delivered', 'refunded', 'cancelled');
  end if;
end $$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  whatsapp_phone text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id bigint generated always as identity primary key,
  name text not null unique,
  slug text not null unique,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  category_id bigint not null references public.categories(id) on delete restrict,
  price_dt integer not null check (price_dt > 0),
  short_description text not null,
  long_description text not null,
  delivery_time text not null,
  requirements text not null,
  refund_policy text not null,
  is_featured boolean not null default false,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  whatsapp_phone text not null,
  email text,
  payment_method public.payment_method not null,
  status public.order_status not null default 'pending_payment',
  total_dt integer not null check (total_dt > 0),
  proof_image_url text,
  public_token text not null unique default encode(gen_random_bytes(16), 'hex'),
  delivery_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id bigint not null references public.products(id) on delete restrict,
  product_name text not null,
  unit_price_dt integer not null check (unit_price_dt > 0),
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.feedbacks (
  id bigint generated always as identity primary key,
  customer_name text not null,
  product_label text,
  comment text not null,
  rating integer not null default 5 check (rating >= 1 and rating <= 5),
  screenshot_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists feedbacks_set_updated_at on public.feedbacks;
create trigger feedbacks_set_updated_at before update on public.feedbacks
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, is_admin)
  values (new.id, false)
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
as $$
  select coalesce((select is_admin from public.profiles where user_id = uid), false);
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.feedbacks enable row level security;

drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles
for select using (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
for update using (auth.uid() = user_id or public.is_admin(auth.uid()))
with check (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
for select using (true);

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write" on public.categories
for all using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
for select using (true);

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write" on public.products
for all using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "orders_insert_public" on public.orders;
create policy "orders_insert_public" on public.orders
for insert with check (true);

drop policy if exists "orders_user_or_admin_read" on public.orders;
create policy "orders_user_or_admin_read" on public.orders
for select using (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update" on public.orders
for update using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "order_items_insert_public" on public.order_items;
create policy "order_items_insert_public" on public.order_items
for insert with check (true);

drop policy if exists "order_items_user_or_admin_read" on public.order_items;
create policy "order_items_user_or_admin_read" on public.order_items
for select using (
  exists (
    select 1 from public.orders o
    where o.id = order_items.order_id
    and (o.user_id = auth.uid() or public.is_admin(auth.uid()))
  )
);

drop policy if exists "feedbacks_public_read_published" on public.feedbacks;
create policy "feedbacks_public_read_published" on public.feedbacks
for select using (is_published = true or public.is_admin(auth.uid()));

drop policy if exists "feedbacks_admin_write" on public.feedbacks;
create policy "feedbacks_admin_write" on public.feedbacks
for all using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', true)
on conflict (id) do nothing;

drop policy if exists "payment_proofs_public_read" on storage.objects;
create policy "payment_proofs_public_read" on storage.objects
for select using (bucket_id = 'payment-proofs');

drop policy if exists "payment_proofs_admin_insert" on storage.objects;
create policy "payment_proofs_admin_insert" on storage.objects
for insert with check (bucket_id = 'payment-proofs' and public.is_admin(auth.uid()));
