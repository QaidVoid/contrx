CREATE TABLE counterparties(
  id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT
);