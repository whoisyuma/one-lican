-- 匿名ユーザーがsharesテーブルの全てを削除できるようにするポリシー
CREATE POLICY "Allow anon delete on all shares" ON shares
  FOR DELETE TO anon
  USING (true);

-- 匿名ユーザーがsharesテーブルの全てを更新できるようにするポリシー
CREATE POLICY "Allow anon update on all shares" ON shares
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);
