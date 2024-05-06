CREATE TABLE contract_clauses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id),
  clause_id UUID NOT NULL REFERENCES clauses(id),
  clause_order INT NOT NULL
);
