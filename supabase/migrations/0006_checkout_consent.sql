-- Checkout now captures two consent-related checkboxes:
--   - Required acceptance of the Terms of Service / Privacy Policy
--     (enforced server-side too — see checkout/actions.ts).
--   - Optional opt-in to promotional SMS, unchecked by default. We only
--     ever text a customer who explicitly checked this box — see the
--     Privacy Policy's "Marketing communications" section for why: SMS
--     marketing needs clear opt-in consent, unlike marketing email (where
--     consent implied by purchase, plus an unsubscribe link, is enough).
alter table public.orders
  add column terms_accepted boolean not null default false,
  add column sms_marketing_consent boolean not null default false;
