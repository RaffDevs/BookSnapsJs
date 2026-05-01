create extension if not exists pgcrypto;

do $$ begin
  create type public.highlight_ocr_status as enum ('processing', 'ready', 'failed');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  author text,
  publisher text,
  isbn text,
  cover_url text,
  total_pages integer,
  created_at timestamptz not null default now()
);

create index if not exists books_user_id_title_idx on public.books (user_id, title);

create table if not exists public.book_highlights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  book_id uuid not null references public.books (id) on delete cascade,
  page_number integer not null,
  raw_ocr_text text,
  edited_text text,
  user_note text,
  image_path text,
  ocr_status public.highlight_ocr_status not null default 'processing',
  ocr_language text not null default 'pt,en',
  ocr_blocks jsonb not null default '[]'::jsonb,
  captured_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists book_highlights_book_id_page_number_idx
  on public.book_highlights (book_id, page_number);

create index if not exists book_highlights_text_search_idx
  on public.book_highlights
  using gin (
    to_tsvector(
      'simple',
      coalesce(edited_text, '') || ' ' || coalesce(user_note, '')
    )
  );

alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.book_highlights enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "books_select_own"
  on public.books for select
  using (auth.uid() = user_id);

create policy "books_insert_own"
  on public.books for insert
  with check (auth.uid() = user_id);

create policy "books_update_own"
  on public.books for update
  using (auth.uid() = user_id);

create policy "books_delete_own"
  on public.books for delete
  using (auth.uid() = user_id);

create policy "highlights_select_own"
  on public.book_highlights for select
  using (auth.uid() = user_id);

create policy "highlights_insert_own"
  on public.book_highlights for insert
  with check (auth.uid() = user_id);

create policy "highlights_update_own"
  on public.book_highlights for update
  using (auth.uid() = user_id);

create policy "highlights_delete_own"
  on public.book_highlights for delete
  using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('highlight-images', 'highlight-images', false)
on conflict (id) do nothing;

create policy "highlight_images_select_own"
  on storage.objects for select
  using (
    bucket_id = 'highlight-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "highlight_images_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'highlight-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "highlight_images_update_own"
  on storage.objects for update
  using (
    bucket_id = 'highlight-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
