import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isAuthPage = createRouteMatcher(["/login", "/register"]);
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/courses(.*)",
  "/sessions(.*)",
  "/locations(.*)",
]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  // Redirect logged-in users away from auth pages
  if (isAuthPage(request) && (await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/dashboard");
  }
  // Redirect unauthenticated users to login
  if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/login");
  }
});

export const config = {
  // Run middleware on all routes except static assets
  matcher: ["/((?!.*\\..*|_next).*)"],
};
