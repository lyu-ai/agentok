-- Step 1: Insert the user into auth.users table
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- This is a default instance ID, your actual instance ID might be different
  uuid_generate_v4(),
  'authenticated',
  'authenticated',
  'hi@agentok.ai',
  crypt('12345678', gen_salt('bf')),
  now(), -- Set email_confirmed_at to now() to confirm the email immediately
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  '', -- Empty string for confirmation_token
  '', -- Empty string for email_change
  '', -- Empty string for email_change_token_new
  ''  -- Empty string for recovery_token
) RETURNING id, email;

-- Step 2: Insert a row into auth.identities
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at,
  provider_id
)
SELECT
  id,
  id,
  json_build_object('sub', id::text, 'email', email),
  'email',
  now(),
  now(),
  now(),
  email  -- Use email as the provider_id for email provider
FROM auth.users
WHERE email = 'hi@agentok.ai';

