-- 匿名ユーザーがsharesテーブルの全てを更新できるようにするポリシー
CREATE POLICY "Allow anon update on all shares" ON payments
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);
