CREATE TABLE shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid REFERENCES payments(id) ON DELETE CASCADE NOT NULL,
  member_id uuid NOT NULL,
  amount numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- RLSを有効化
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

-- 匿名ユーザーがsharesテーブルの全てを読み取れるようにするポリシー
CREATE POLICY "Allow anon select on all shares" ON shares
  FOR SELECT TO anon
  USING (true);

-- 匿名ユーザーがsharesテーブルの全てに挿入できるようにするポリシー
CREATE POLICY "Allow anon insert on all shares" ON shares
  FOR INSERT TO anon
  WITH CHECK (true);