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

drop trigger if exists feedbacks_set_updated_at on public.feedbacks;
create trigger feedbacks_set_updated_at before update on public.feedbacks
for each row execute function public.set_updated_at();

alter table public.feedbacks enable row level security;

drop policy if exists "feedbacks_public_read_published" on public.feedbacks;
create policy "feedbacks_public_read_published" on public.feedbacks
for select using (is_published = true or public.is_admin(auth.uid()));

drop policy if exists "feedbacks_admin_write" on public.feedbacks;
create policy "feedbacks_admin_write" on public.feedbacks
for all using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));
