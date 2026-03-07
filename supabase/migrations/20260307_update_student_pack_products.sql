-- Update Student Pack to include CapCut Pro, ChatGPT Plus, and Canva Pro
update public.products
set
  short_description = 'Student essentials: CapCut Pro + ChatGPT Plus + Canva Pro.',
  long_description = 'Includes the most requested student tools in one discounted pack: CapCut Pro, ChatGPT Plus, and Canva Pro.',
  image_url = '/products/capcut-pro.svg'
where slug = 'student-pack';

-- Replace pack items: remove old, add new
delete from public.product_pack_items
where pack_product_id = (select id from public.products where slug = 'student-pack' limit 1);

insert into public.product_pack_items (pack_product_id, included_product_id)
select
  (select id from public.products where slug = 'student-pack' limit 1),
  p.id
from public.products p
where p.slug in ('capcut-pro', 'chatgpt-plus-your-account', 'canva-pro')
on conflict do nothing;
