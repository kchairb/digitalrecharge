-- Fortnite V-Bucks prices
update public.products set price_dt = 59  where slug = 'fortnite-vbucks-1000';
update public.products set price_dt = 99  where slug = 'fortnite-vbucks-2800';
update public.products set price_dt = 159 where slug = 'fortnite-vbucks-5000';
update public.products set price_dt = 359 where slug = 'fortnite-vbucks-13500';

-- Roblox Robux prices
update public.products set price_dt = 22  where slug = 'roblox-robux-400';
update public.products set price_dt = 39  where slug = 'roblox-robux-800';
update public.products set price_dt = 175 where slug = 'roblox-robux-4500';
update public.products set price_dt = 365 where slug = 'roblox-robux-10000';

-- Repurpose 2000 Robux as 1700 Robux, and remove 1200 Robux variant
update public.products
set
  name = 'Roblox 1700 Robux',
  slug = 'roblox-robux-1700',
  price_dt = 75,
  short_description = '1700 Robux top-up for Roblox.',
  long_description = 'Get 1700 Robux to purchase items, accessories and upgrades in Roblox games.'
where slug = 'roblox-robux-2000';

delete from public.products where slug = 'roblox-robux-1200';

-- PUBG Mobile UC prices
update public.products set price_dt = 6   where slug = 'pubg-uc-60';
update public.products set price_dt = 28  where slug = 'pubg-uc-325';
update public.products set price_dt = 49  where slug = 'pubg-uc-660';
update public.products set price_dt = 115 where slug = 'pubg-uc-1800';
update public.products set price_dt = 225 where slug = 'pubg-uc-3850';

-- Add 8100 UC variant if missing
insert into public.products (
  name, slug, category_id, price_dt, short_description, long_description,
  delivery_time, requirements, refund_policy, is_featured, image_url
)
select
  'PUBG Mobile 8100 UC',
  'pubg-uc-8100',
  category_id,
  435,
  '8100 UC top-up for PUBG Mobile.',
  'Recharge 8100 UC in PUBG Mobile to unlock premium skins, weapons and royale passes.',
  'Instant / 5-20 min',
  'Provide your PUBG Mobile ID for safe top-up.',
  'Refund only if top-up is not delivered.',
  true,
  image_url
from public.products
where slug = 'pubg-uc-60'
on conflict (slug) do update set price_dt = excluded.price_dt;

-- Free Fire Diamonds prices
update public.products set price_dt = 6   where slug = 'freefire-diamonds-100';
update public.products set price_dt = 16  where slug = 'freefire-diamonds-310';
update public.products set price_dt = 25  where slug = 'freefire-diamonds-520';
update public.products set price_dt = 49  where slug = 'freefire-diamonds-1060';

-- Add 2180 Diamonds variant if missing
insert into public.products (
  name, slug, category_id, price_dt, short_description, long_description,
  delivery_time, requirements, refund_policy, is_featured, image_url
)
select
  'Free Fire 2180 Diamonds',
  'freefire-diamonds-2180',
  category_id,
  95,
  '2180 diamonds top-up for Free Fire.',
  'Buy 2180 Free Fire diamonds to unlock skins, characters and special items.',
  'Instant / 5-20 min',
  'Provide your Free Fire ID for safe top-up.',
  'Refund only if top-up is not delivered.',
  true,
  image_url
from public.products
where slug = 'freefire-diamonds-100'
on conflict (slug) do update set price_dt = excluded.price_dt;

-- Valorant Points: replace previous denominations with requested ones
delete from public.products where slug like 'valorant-points-%';

insert into public.products (
  name, slug, category_id, price_dt, short_description, long_description,
  delivery_time, requirements, refund_policy, is_featured, image_url
)
select
  name,
  slug,
  (select id from public.categories where slug = 'gaming-top-ups'),
  price_dt,
  'Valorant Points top-up.',
  'Recharge Valorant Points to buy weapon skins, bundles and battle passes.',
  'Instant / 5-20 min',
  'Provide your Riot ID for safe top-up.',
  'Refund only if top-up is not delivered.',
  is_featured,
  '/products/valorant-points.svg'
from (
  values
    ('Valorant 475 VP',  'valorant-points-475',  19, false),
    ('Valorant 1000 VP', 'valorant-points-1000', 36, false),
    ('Valorant 2050 VP', 'valorant-points-2050', 69, false),
    ('Valorant 3650 VP', 'valorant-points-3650', 110, false),
    ('Valorant 5350 VP', 'valorant-points-5350', 159, true)
) as vp(name, slug, price_dt, is_featured);

-- Steam Gift Card prices (and extra denominations)
update public.products set price_dt = 20  where slug = 'steam-gift-5';
update public.products set price_dt = 39  where slug = 'steam-gift-10';
update public.products set price_dt = 75  where slug = 'steam-gift-20';
update public.products set price_dt = 185 where slug = 'steam-gift-50';

-- Add / update Steam $30 and $100 (simplified explicit insert)
insert into public.products (
  name, slug, category_id, price_dt, short_description, long_description,
  delivery_time, requirements, refund_policy, is_featured, image_url
)
values
  (
    'Steam Gift Card $30',
    'steam-gift-30',
    (select id from public.categories where slug = 'gaming-gift-cards'),
    109,
    'Steam wallet gift card $30.',
    'Add funds to your Steam wallet and purchase games, DLCs and in-game items.',
    'Instant / 5-20 min',
    'You will receive a secure digital code.',
    'No refund after a valid code is delivered.',
    false,
    '/products/steam-giftcard.svg'
  ),
  (
    'Steam Gift Card $100',
    'steam-gift-100',
    (select id from public.categories where slug = 'gaming-gift-cards'),
    365,
    'Steam wallet gift card $100.',
    'Add funds to your Steam wallet and purchase games, DLCs and in-game items.',
    'Instant / 5-20 min',
    'You will receive a secure digital code.',
    'No refund after a valid code is delivered.',
    true,
    '/products/steam-giftcard.svg'
  )
on conflict (slug) do update set price_dt = excluded.price_dt;

-- PSN prices
update public.products set price_dt = 42  where slug = 'psn-card-10';
update public.products set price_dt = 78  where slug = 'psn-card-20';
update public.products set price_dt = 189 where slug = 'psn-card-50';
update public.products set price_dt = 370 where slug = 'psn-card-100';

-- Google Play prices (10 / 20 / 50)
update public.products set price_dt = 40  where slug = 'googleplay-gift-10';
update public.products set price_dt = 78  where slug = 'googleplay-gift-20';
update public.products set price_dt = 189 where slug = 'googleplay-gift-50';

-- Apple iTunes prices
update public.products set price_dt = 40  where slug = 'itunes-gift-10';
update public.products set price_dt = 95  where slug = 'itunes-gift-25';
update public.products set price_dt = 185 where slug = 'itunes-gift-50';
update public.products set price_dt = 365 where slug = 'itunes-gift-100';

