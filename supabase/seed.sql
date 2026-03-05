insert into public.categories (name, slug, image_url)
values
  ('AI Tools', 'ai-tools', 'https://images.unsplash.com/photo-1677442136019-21780ecad995'),
  ('Streaming', 'streaming', 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85'),
  ('Design', 'design', 'https://images.unsplash.com/photo-1558655146-9f40138edfeb'),
  ('Virtual Cards', 'virtual-cards', 'https://images.unsplash.com/photo-1556740749-887f6717d7e4'),
  ('Gift Cards', 'gift-cards', 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a')
on conflict (slug) do update set name = excluded.name, image_url = excluded.image_url;

with category_ids as (
  select id, slug from public.categories
)
insert into public.products (
  name, slug, category_id, price_dt, short_description, long_description,
  delivery_time, requirements, refund_policy, is_featured, image_url
)
values
  (
    'ChatGPT Account',
    'chatgpt-account',
    (select id from category_ids where slug = 'ai-tools'),
    25,
    'Ready-to-use ChatGPT access.',
    'Includes a pre-configured account for quick access to ChatGPT.',
    'Instant / 5-10 min',
    'Provide contact details for secure handover.',
    'Refund if account cannot be delivered.',
    true,
    'https://images.unsplash.com/photo-1677442136019-21780ecad995'
  ),
  (
    'ChatGPT Plus (Your Account)',
    'chatgpt-plus-your-account',
    (select id from category_ids where slug = 'ai-tools'),
    85,
    'Upgrade your own account to Plus.',
    'We activate ChatGPT Plus on your account with guided steps.',
    '10-20 min',
    'You need account access details temporarily.',
    'Refund only if activation fails.',
    true,
    'https://images.unsplash.com/photo-1677442135968-6f3f80a6ab33'
  ),
  (
    'Netflix',
    'netflix',
    (select id from category_ids where slug = 'streaming'),
    28,
    'Netflix premium access.',
    'Enjoy streaming access with fast activation.',
    '5-15 min',
    'Country compatibility may be required.',
    'No refund after successful delivery.',
    true,
    'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85'
  ),
  (
    'Spotify Premium',
    'spotify-premium',
    (select id from category_ids where slug = 'streaming'),
    10,
    'Spotify premium activation.',
    'Ad-free listening with premium features.',
    '5-15 min',
    'Valid account email required.',
    'Refund if activation is not possible.',
    true,
    'https://images.unsplash.com/photo-1614680376408-81e91ffe3db7'
  ),
  (
    'Canva Pro',
    'canva-pro',
    (select id from category_ids where slug = 'design'),
    15,
    'Canva Pro subscription access.',
    'Unlock premium templates and brand tools.',
    '5-15 min',
    'Email/account invite may be required.',
    'No refund after activation.',
    true,
    'https://images.unsplash.com/photo-1558655146-9f40138edfeb'
  ),
  (
    'VCC $5',
    'vcc-5',
    (select id from category_ids where slug = 'virtual-cards'),
    45,
    'Virtual card with $5 value.',
    'Useful for online digital payments and verifications.',
    'Instant / 5-10 min',
    'Identity confirmation may be requested.',
    'Refund only if card is not issued.',
    false,
    'https://images.unsplash.com/photo-1556740749-887f6717d7e4'
  ),
  (
    'VCC $10',
    'vcc-10',
    (select id from category_ids where slug = 'virtual-cards'),
    45,
    'Virtual card with $10 value.',
    'Secure virtual payment card for online services.',
    'Instant / 5-10 min',
    'Identity confirmation may be requested.',
    'Refund only if card is not issued.',
    false,
    'https://images.unsplash.com/photo-1556740749-887f6717d7e4'
  ),
  (
    'VCC $20',
    'vcc-20',
    (select id from category_ids where slug = 'virtual-cards'),
    85,
    'Virtual card with $20 value.',
    'Higher value virtual card for multiple transactions.',
    'Instant / 5-10 min',
    'Identity confirmation may be requested.',
    'Refund only if card is not issued.',
    true,
    'https://images.unsplash.com/photo-1556740749-887f6717d7e4'
  ),
  (
    'Gift Card $10',
    'gift-card-10',
    (select id from category_ids where slug = 'gift-cards'),
    45,
    'Digital gift card with $10 value.',
    'Delivered as a secure code after payment verification.',
    'Instant / 5-10 min',
    'Specify target platform when ordering.',
    'No refund after valid code delivery.',
    true,
    'https://images.unsplash.com/photo-1513885535751-8b9238bd345a'
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
  image_url = excluded.image_url;

delete from public.feedbacks
where customer_name in ('أحمد نذير', 'Aymen', 'أمينة', 'Karim', 'مروى');

insert into public.feedbacks (
  customer_name, product_label, comment, rating, screenshot_url, is_published
)
values
  ('أحمد نذير', 'ChatGPT Plus', 'الخدمة ممتازة والتفعيل كان سريع جدا، أنصح بهم.', 5, null, true),
  ('Aymen', 'Netflix', 'Smooth transaction and very professional support.', 5, null, true),
  ('أمينة', 'Canva Pro', 'تجربة ممتازة ووصلني الطلب في وقت قياسي.', 5, null, true),
  ('Karim', 'Spotify Premium', 'Fast delivery and trusted team.', 5, null, true),
  ('مروى', 'Gift Card $10', 'طلبت البطاقة ووصلتني خلال دقائق.', 5, null, true);
