CREATE TABLE groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  members jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- RLSの有効化
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

-- 匿名ユーザーがgroupsテーブルを全て読み取れるようにするポリシー
CREATE POLICY "Allow anon select on all groups" ON groups
  FOR SELECT USING (true);

-- 匿名ユーザーがgroupsテーブルに全て挿入できるようにするポリシー
CREATE POLICY "Allow anon insert on all groups" ON groups
  FOR INSERT TO anon
  WITH CHECK (true);