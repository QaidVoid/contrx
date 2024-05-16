CREATE TABLE contract_approvers (
  id UUID PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES contracts(id),
  approver_id UUID NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'Pending', -- "Pending", "Viewed", "Approved", "Rejected"
  last_modified_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
