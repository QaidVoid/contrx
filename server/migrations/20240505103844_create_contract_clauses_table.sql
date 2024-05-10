CREATE TABLE contract_clauses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_type_id UUID NOT NULL REFERENCES contract_types(id),
  clause_id UUID NOT NULL REFERENCES clauses(id),
  clause_order INT NOT NULL
);
