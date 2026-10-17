CREATE TABLE public.form_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 session_id text NOT NULL,
 event_name text NOT NULL,
 occurred_at timestamptz NOT NULL DEFAULT now(),
 page_path text,
 utm_source text,
 utm_medium text,
 utm_campaign text,
 fbclid text,
 metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);
GRANT INSERT ON public.form_events TO anon, authenticated;
GRANT ALL ON public.form_events TO service_role;
REVOKE SELECT, UPDATE, DELETE ON public.form_events FROM anon, authenticated;
ALTER TABLE public.form_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can append funnel events" ON public.form_events FOR INSERT TO anon, authenticated WITH CHECK (
 event_name IN ('form_screen_1_complete','form_screen_2_complete','form_screen_3_complete','form_screen_4_complete','form_screen_5_complete','form_submit')
 AND metadata = '{}'::jsonb
);
CREATE FUNCTION public.validate_form_event() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
 IF NEW.event_name NOT IN ('form_screen_1_complete','form_screen_2_complete','form_screen_3_complete','form_screen_4_complete','form_screen_5_complete','form_submit') THEN
  RAISE EXCEPTION 'Unsupported funnel event' USING ERRCODE = '23514';
 END IF;
 IF NEW.metadata <> '{}'::jsonb THEN
  RAISE EXCEPTION 'Funnel metadata must be empty' USING ERRCODE = '23514';
 END IF;
 IF NEW.session_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' THEN
  RAISE EXCEPTION 'Invalid anonymous session ID' USING ERRCODE = '23514';
 END IF;
 IF NEW.page_path IS NOT NULL AND NEW.page_path NOT IN ('/printing','/packaging') THEN
  RAISE EXCEPTION 'Unsupported form page' USING ERRCODE = '23514';
 END IF;
 IF length(NEW.utm_source) > 128 OR length(NEW.utm_medium) > 128 OR length(NEW.utm_campaign) > 128 OR length(NEW.fbclid) > 512 THEN
  RAISE EXCEPTION 'Attribution value too long' USING ERRCODE = '23514';
 END IF;
 RETURN NEW;
END;
$$;
CREATE TRIGGER validate_form_event BEFORE INSERT OR UPDATE ON public.form_events FOR EACH ROW EXECUTE FUNCTION public.validate_form_event();