CREATE TABLE organizations_clauses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  clause_id UUID NOT NULL REFERENCES clauses(id)
);
