import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function POST() {
  // Await the cookies promise to access the ReadonlyRequestCookies object
  const cookieStore = await cookies();

  // Remove the admin_jwt cookie
  cookieStore.set("admin_jwt", "", { path: "/", maxAge: 0 });

  // Redirect to the home page
  redirect("/");
}
