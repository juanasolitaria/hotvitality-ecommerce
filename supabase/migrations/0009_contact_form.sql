-- Backs the contact form (src/app/(storefront)/contact/actions.ts). The
-- message itself is only ever emailed to hotvitality@gmail.com via
-- Resend, never stored — this table exists purely so
-- checkIpRateLimit (src/lib/rate-limit.ts) has something to count against
-- per IP, same pattern as orders.client_ip for checkout.
create table public.contact_rate_limits (
  id uuid primary key default gen_random_uuid(),
  client_ip inet,
  created_at timestamptz not null default now()
);

create index contact_rate_limits_ip_idx on public.contact_rate_limits (client_ip, created_at);

-- No public policies — only the service-role client (used by
-- sendContactMessage) ever reads or writes this table.
alter table public.contact_rate_limits enable row level security;
