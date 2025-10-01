CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  paid_by_member_id uuid NOT NULL,
  amount numeric NOT NULL,
  description text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- RLSを有効化
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 匿名ユーザーがpaymentsテーブルを全て読み取れるようにするポリシー
CREATE POLICY "Allow anon select on all payments" ON payments
  FOR SELECT TO anon
  USING (true);

-- 匿名ユーザーがpaymentsテーブルに全て挿入できるようにするポリシー
CREATE POLICY "Allow anon insert on all payments" ON payments
  FOR INSERT TO anon
  WITH CHECK (true);