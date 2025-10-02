CREATE TABLE shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid REFERENCES payments(id) ON DELETE CASCADE NOT NULL,
  member_id uuid NOT NULL,
  amount numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- RLSを有効化
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

