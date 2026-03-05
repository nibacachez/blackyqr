-- Supabase schema for BlackyQR

-- Table: profiles (optional, supabase auth maps users -> profiles)
create table if not exists profiles (
  id uuid primary key,
  email text,
  role text default 'user',
  created_at timestamptz default now()
);

-- Table: mascotas
create table if not exists mascotas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  raza text,
  caracteristicas text,
  qr_url text,
  foto_url text,
  owner_contact_encrypted text not null,
  created_at timestamptz default now()
);

-- Table: rescate_reports (temporal storage with ttl)
create table if not exists rescate_reports (
  id uuid primary key default gen_random_uuid(),
  mascota_id uuid references mascotas(id) on delete cascade,
  lat double precision not null,
  lon double precision not null,
  reporter_meta jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '1 hour')
);

-- Index to help cleanup
create index if not exists idx_rescate_reports_expires_at on rescate_reports(expires_at);

-- Cleanup function using PL/pgSQL
-- Nota: `pg_cron` debe estar instalado/enabled en la instancia de Postgres/Supabase.
-- Si no está disponible, usar Supabase Scheduled Functions o programar una llamada externa al endpoint de limpieza.

create or replace function cleanup_rescate_reports() returns void language plpgsql as $$
begin
  delete from rescate_reports where expires_at < now();
end;
$$;

-- Intento de programar con pg_cron: ejecutar la función cada hora.
-- Requiere permisos y la extensión pg_cron instalada.
-- Ejecutar manualmente si pg_cron no está disponible.

-- create extension if not exists pg_cron; -- ejecutar si tienes permisos
-- select cron.schedule('cleanup_rescate_reports_hourly', '0 * * * *', $$select cleanup_rescate_reports();$$);

