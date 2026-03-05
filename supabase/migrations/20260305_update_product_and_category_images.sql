update public.categories
set image_url = case slug
  when 'ai-tools' then '/products/category-ai-tools.svg'
  when 'streaming' then '/products/category-streaming.svg'
  when 'design' then '/products/category-design.svg'
  when 'virtual-cards' then '/products/category-vcc.svg'
  when 'gift-cards' then '/products/category-gift.svg'
  else image_url
end
where slug in ('ai-tools', 'streaming', 'design', 'virtual-cards', 'gift-cards');

update public.products
set image_url = case slug
  when 'chatgpt-account' then '/products/chatgpt-account.svg'
  when 'chatgpt-plus-your-account' then '/products/chatgpt-plus.svg'
  when 'netflix' then '/products/netflix.svg'
  when 'spotify-premium' then '/products/spotify.svg'
  when 'canva-pro' then '/products/canva.svg'
  when 'vcc-5' then '/products/vcc.svg'
  when 'vcc-10' then '/products/vcc.svg'
  when 'vcc-20' then '/products/vcc.svg'
  when 'gift-card-10' then '/products/gift-card.svg'
  else image_url
end
where slug in (
  'chatgpt-account',
  'chatgpt-plus-your-account',
  'netflix',
  'spotify-premium',
  'canva-pro',
  'vcc-5',
  'vcc-10',
  'vcc-20',
  'gift-card-10'
);
