-- 匿名ユーザーがgroupsテーブルに全て挿入できるようにするポリシー
CREATE POLICY "Allow anon insert on all groups" ON groups
  FOR INSERT TO anon
  WITH CHECK (true);