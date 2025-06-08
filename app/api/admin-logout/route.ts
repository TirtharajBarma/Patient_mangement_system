import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function POST() {
  // Remove the admin_jwt cookie
  cookies().set("admin_jwt", "", { path: "/", maxAge: 0 });

  redirect("/");
}
