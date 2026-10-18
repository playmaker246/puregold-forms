REVOKE ALL ON public.form_events FROM anon, authenticated;
GRANT INSERT ON public.form_events TO anon, authenticated;
GRANT ALL ON public.form_events TO service_role;
CREATE OR REPLACE FUNCTION public.validate_form_event() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE token text;
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
 FOREACH token IN ARRAY ARRAY[NEW.utm_source,NEW.utm_medium,NEW.utm_campaign,NEW.fbclid] LOOP
  IF token IS NOT NULL AND (token !~ '^[a-zA-Z0-9_-]+$' OR token ~ '[0-9]{7,}') THEN
   RAISE EXCEPTION 'Invalid campaign token' USING ERRCODE = '23514';
  END IF;
 END LOOP;
 RETURN NEW;
END;
$$;