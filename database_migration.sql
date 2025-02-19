-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  first_name text NOT NULL,
  last_name text NOT NULL,
  home_phone text,
  mobile_phone text NOT NULL,
  email text NOT NULL,
  country text NOT NULL,
  address text NOT NULL,
  avatar_url text,
  unsubscribed boolean NOT NULL DEFAULT false
);
-- Set up Row Level Security (RLS)
alter table profiles
  enable row level security;

create policy "Profiles are viewable by self." on profiles
  for select using (auth.uid() = id);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create Pets Table
create table pets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    second_name text,
    date_of_birth date NOT NULL,
    gender text NOT NULL,
    pet_type text NOT NULL,
    temperament text,
    food text,
    favourite_treats text,
    allergies text,
    breed text NOT NULL,
    profile_url text,
    bio text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);

-- Enable RLS on pets table
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Create policies for pets table
CREATE POLICY "Pets are viewable by owner" ON pets
    FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own pets" ON pets
    FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own pets" ON pets
    FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own pets" ON pets
    FOR DELETE USING (auth.uid() = profile_id);

-- Create Stripe Customer Table
create table stripe_customers (
  user_id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  stripe_customer_id text unique
);
alter table stripe_customers enable row level security;

-- Create a table for "Contact Us" form submissions
create table contact_requests (
  id uuid primary key default gen_random_uuid(),
  updated_at timestamp with time zone,
  first_name text,
  last_name text,
  email text,
  phone text,
  company_name text,
  message_body text
);
alter table contact_requests enable row level security;

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    first_name,
    last_name,
    email,
    mobile_phone,
    country,
    address,
    avatar_url
  )
  values (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    new.email,
    COALESCE(new.raw_user_meta_data->>'mobile_phone', ''),
    COALESCE(new.raw_user_meta_data->>'country', ''),
    COALESCE(new.raw_user_meta_data->>'address', ''),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- Set up access controls for storage.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');