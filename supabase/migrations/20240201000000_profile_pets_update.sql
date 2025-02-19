-- Backup existing profiles data
CREATE TABLE profiles_backup AS SELECT * FROM profiles;

-- Modify profiles table
ALTER TABLE profiles 
  DROP COLUMN company_name,
  DROP COLUMN website,
  DROP COLUMN full_name,
  ADD COLUMN first_name text NOT NULL DEFAULT '',
  ADD COLUMN last_name text NOT NULL DEFAULT '',
  ADD COLUMN home_phone text,
  ADD COLUMN mobile_phone text NOT NULL DEFAULT '',
  ADD COLUMN email text NOT NULL DEFAULT '',
  ADD COLUMN country text NOT NULL DEFAULT '',
  ADD COLUMN address text NOT NULL DEFAULT '';

-- Update existing profiles with data from auth.users
UPDATE profiles p
SET 
  first_name = COALESCE(SPLIT_PART(b.full_name, ' ', 1), ''),
  last_name = COALESCE(SPLIT_PART(b.full_name, ' ', 2), ''),
  email = (SELECT email FROM auth.users WHERE id = p.id),
  mobile_phone = '',  -- Set default as empty string
  country = '',      -- Set default as empty string
  address = ''       -- Set default as empty string
FROM profiles_backup b
WHERE p.id = b.id;

-- Create pets table
CREATE TABLE pets (
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

-- Keep profiles_backup table for 30 days as safety
COMMENT ON TABLE profiles_backup IS 'Backup of profiles table before restructure. Can be deleted after 30 days. Created on ' || CURRENT_TIMESTAMP;