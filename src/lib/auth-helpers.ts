import { auth } from "../auth";
import { redirect } from "next/navigation";

/**
 * Ensures the user is authenticated and has an admin role.
 * Throws a redirect to the login page if not authenticated.
 * Returns the session user if successful.
 */
export async function requireAdmin() {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect("/admin/login");
  }

  // Support for custom role checks if needed later
  const user = session.user as any;
  if (user.role !== "admin") {
    redirect("/admin/login?error=unauthorized");
  }

  return session.user;
}
