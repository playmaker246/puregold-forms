<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep funnel payload construction in a pure, tested module and browser writes in an event-handler utility; this separates privacy validation from browser-only storage and networking.
- Express Printing uses explicit screen groups in the shared form configuration and shared client/server validation; conditional fields must not change its screen count or leak hidden answers into saved submissions.
- Each form saves to its own spreadsheet before calling the shared team notifier, and Express has its own confirmation route to preserve the other forms' copy.
- Funnel writes use the generated publishable Supabase client with insert-only RLS, never a service-role client or returning rows; public visitors must not read analytics.
- Funnel metadata remains empty and attribution accepts only bounded campaign tokens; never pass contact details or form answers into analytics.
