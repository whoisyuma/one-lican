CREATE POLICY "Allow anon delete on all payments" ON payments
  FOR DELETE TO anon
  USING (true);
