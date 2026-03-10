-- Convert gaming/app store cards into one configurable base product per card family

-- Steam
update public.products
set
  name = 'Steam Gift Card',
  slug = 'steam-gift-card',
  short_description = 'Choose Steam gift card value instantly.',
  long_description = 'Pick your Steam card value and receive a secure digital code to top up your Steam wallet.',
  price_dt = 20,
  is_featured = true
where slug in ('steam-gift-5', 'steam-gift-card');

delete from public.products
where slug in ('steam-gift-10', 'steam-gift-20', 'steam-gift-30', 'steam-gift-50', 'steam-gift-100');

-- PlayStation Network
update public.products
set
  name = 'PlayStation Network Card',
  slug = 'psn-card',
  short_description = 'Choose PSN card value instantly.',
  long_description = 'Pick your PlayStation Network card value and receive a secure digital code for your PS wallet.',
  price_dt = 42,
  is_featured = true
where slug in ('psn-card-10', 'psn-card');

delete from public.products
where slug in ('psn-card-20', 'psn-card-50', 'psn-card-100');

-- Xbox
update public.products
set
  name = 'Xbox Gift Card',
  slug = 'xbox-gift-card',
  short_description = 'Choose Xbox gift card value instantly.',
  long_description = 'Pick your Xbox card value and receive a secure digital code for games and subscriptions.',
  price_dt = 50,
  is_featured = true
where slug in ('xbox-gift-10', 'xbox-gift-card');

delete from public.products
where slug in ('xbox-gift-25', 'xbox-gift-50');

-- Google Play
update public.products
set
  name = 'Google Play Gift Card',
  slug = 'googleplay-gift-card',
  short_description = 'Choose Google Play card value instantly.',
  long_description = 'Pick your Google Play card value and receive a secure digital code for apps, games and subscriptions.',
  price_dt = 40,
  is_featured = true
where slug in ('googleplay-gift-10', 'googleplay-gift-card');

delete from public.products
where slug in ('googleplay-gift-20', 'googleplay-gift-50');

-- Apple iTunes
update public.products
set
  name = 'Apple iTunes Gift Card',
  slug = 'itunes-gift-card',
  short_description = 'Choose Apple iTunes card value instantly.',
  long_description = 'Pick your iTunes card value and receive a secure digital code for apps, games and Apple media.',
  price_dt = 40,
  is_featured = true
where slug in ('itunes-gift-10', 'itunes-gift-card');

delete from public.products
where slug in ('itunes-gift-25', 'itunes-gift-50', 'itunes-gift-100');

