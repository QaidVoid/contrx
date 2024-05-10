CREATE TABLE contract_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  intent TEXT NOT NULL,
  party_a_is_self BOOLEAN NOT NULL DEFAULT true,
  party_b_is_self BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL
);
