-- Convert gaming top-ups into one configurable base product per game

-- Fortnite
update public.products
set
  name = 'Fortnite V-Bucks',
  slug = 'fortnite-vbucks',
  short_description = 'Recharge Fortnite V-Bucks instantly.',
  long_description = 'Choose your V-Bucks amount and get instant top-up for skins, battle passes and in-game items.',
  price_dt = 59,
  is_featured = true
where slug in ('fortnite-vbucks-1000', 'fortnite-vbucks');

delete from public.products
where slug in ('fortnite-vbucks-2800', 'fortnite-vbucks-5000', 'fortnite-vbucks-13500');

-- Roblox
update public.products
set
  name = 'Roblox Robux',
  slug = 'roblox-robux',
  short_description = 'Recharge Roblox Robux instantly.',
  long_description = 'Choose your Robux amount and top up your Roblox account for items, accessories and upgrades.',
  price_dt = 22,
  is_featured = true
where slug in ('roblox-robux-400', 'roblox-robux');

delete from public.products
where slug in ('roblox-robux-800', 'roblox-robux-1700', 'roblox-robux-2000', 'roblox-robux-4500', 'roblox-robux-10000');

-- PUBG
update public.products
set
  name = 'PUBG Mobile UC',
  slug = 'pubg-mobile-uc',
  short_description = 'Recharge PUBG Mobile UC instantly.',
  long_description = 'Choose your UC amount and unlock premium skins, weapon upgrades and Royale Pass content.',
  price_dt = 6,
  is_featured = true
where slug in ('pubg-uc-60', 'pubg-mobile-uc');

delete from public.products
where slug in ('pubg-uc-325', 'pubg-uc-660', 'pubg-uc-1800', 'pubg-uc-3850', 'pubg-uc-8100');

-- Free Fire
update public.products
set
  name = 'Free Fire Diamonds',
  slug = 'free-fire-diamonds',
  short_description = 'Recharge Free Fire diamonds instantly.',
  long_description = 'Choose your diamond amount to unlock skins, characters and premium Free Fire items.',
  price_dt = 6,
  is_featured = true
where slug in ('freefire-diamonds-100', 'free-fire-diamonds');

delete from public.products
where slug in ('freefire-diamonds-310', 'freefire-diamonds-520', 'freefire-diamonds-1060', 'freefire-diamonds-2180');

-- Valorant
update public.products
set
  name = 'Valorant Points',
  slug = 'valorant-points',
  short_description = 'Recharge Valorant Points instantly.',
  long_description = 'Choose your VP amount to purchase bundles, skins and battle pass upgrades in Valorant.',
  price_dt = 19,
  is_featured = true
where slug in ('valorant-points-475', 'valorant-points');

delete from public.products
where slug in ('valorant-points-1000', 'valorant-points-2050', 'valorant-points-3650', 'valorant-points-5350');

