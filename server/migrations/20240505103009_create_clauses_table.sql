CREATE TABLE clauses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  language TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  last_modified_by UUID NOT NULL REFERENCES users(id),
  last_modified_at TIMESTAMPTZ NOT NULL
);
