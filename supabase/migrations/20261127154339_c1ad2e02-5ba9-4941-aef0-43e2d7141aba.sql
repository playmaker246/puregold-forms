CREATE POLICY "Visitors cannot access settings"
ON public."Setting"
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Visitors cannot access user records"
ON public."User"
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);