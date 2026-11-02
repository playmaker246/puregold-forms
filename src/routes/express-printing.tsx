import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/express-printing")({ component: ExpressLayout });

function ExpressLayout() {
  return <Outlet />;
}