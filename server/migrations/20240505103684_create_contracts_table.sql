CREATE TABLE contracts (
  id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  contract_type_id UUID NOT NULL REFERENCES contract_types(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  counterparty_id UUID NOT NULL REFERENCES counterparties(id),
  definite_term BOOLEAN NOT NULL,
  effective_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  renewable BOOLEAN NOT NULL,
  status TEXT NOT NULL
);
