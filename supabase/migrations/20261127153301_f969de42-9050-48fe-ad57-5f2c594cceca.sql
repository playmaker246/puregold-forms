ALTER TABLE public."TagOnPost" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published post tag links"
ON public."TagOnPost"
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public."Post" AS p
    WHERE p.id = "TagOnPost"."postId"
      AND p.published = true
  )
);

ALTER TABLE public."Tag" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read tags used by published posts"
ON public."Tag"
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public."TagOnPost" AS tp
    JOIN public."Post" AS p ON p.id = tp."postId"
    WHERE tp."tagId" = "Tag".id
      AND p.published = true
  )
);

ALTER TABLE public."Project" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view projects"
ON public."Project"
FOR SELECT
TO anon, authenticated
USING (true);

ALTER TABLE public."Post" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published posts"
ON public."Post"
FOR SELECT
TO anon, authenticated
USING (published = true);

ALTER TABLE public."Setting" ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;