import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AdminIndex() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }
  if (session.user.mustChange) {
    redirect("/admin/change-credentials");
  }
  redirect("/admin/dashboard");
}
