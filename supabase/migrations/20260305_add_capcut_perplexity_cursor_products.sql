with category_ids as (
  select id, slug from public.categories
)
insert into public.products (
  name, slug, category_id, price_dt, short_description, long_description,
  delivery_time, requirements, refund_policy, is_featured, image_url
)
values
  (
    'CapCut Pro',
    'capcut-pro',
    (select id from category_ids where slug = 'design'),
    1,
    'CapCut Pro subscription setup.',
    'Get premium CapCut features for advanced video editing and export tools.',
    '5-20 min',
    'Provide account email for activation or invite.',
    'Refund only if activation is not completed.',
    false,
    '/products/capcut-pro.svg'
  ),
  (
    'Perplexity Pro',
    'perplexity-pro',
    (select id from category_ids where slug = 'ai-tools'),
    1,
    'Perplexity Pro account upgrade.',
    'Access advanced research features, higher limits, and faster answers.',
    '5-20 min',
    'Account email is required for activation.',
    'Refund only if activation fails.',
    false,
    '/products/perplexity-pro.svg'
  ),
  (
    'Cursor Pro',
    'cursor-pro',
    (select id from category_ids where slug = 'ai-tools'),
    1,
    'Cursor Pro subscription activation.',
    'Upgrade your coding workflow with premium Cursor AI features.',
    '5-20 min',
    'Account email is required for activation.',
    'Refund only if activation fails.',
    false,
    '/products/cursor-pro.svg'
  )
on conflict (slug) do update
set
  name = excluded.name,
  category_id = excluded.category_id,
  short_description = excluded.short_description,
  long_description = excluded.long_description,
  delivery_time = excluded.delivery_time,
  requirements = excluded.requirements,
  refund_policy = excluded.refund_policy,
  is_featured = excluded.is_featured,
  image_url = excluded.image_url;
