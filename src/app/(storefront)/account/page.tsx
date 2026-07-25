import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { ChangePasswordForm } from "@/components/account/change-password-form";
import { LogoutButton } from "@/components/account/logout-button";

export const metadata: Metadata = {
  title: "My Account | Hot Vitality",
};

interface OrderRow {
  id: string;
  status: string;
  total: number;
  created_at: string;
}

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/?auth=login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, created_at")
    .eq("id", user.id)
    .single();

  // Real query against the real `orders` table — it'll just come back
  // empty until checkout actually creates orders there.
  const { data: orders } = await supabase
    .from("orders")
    .select("id, status, total, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<OrderRow[]>();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        My Account
      </h1>

      <Card className="mt-6">
        <CardContent>
          <h2 className="text-lg font-semibold text-foreground">Profile</h2>
          <dl className="mt-3 flex flex-col gap-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium text-foreground">
                {profile?.full_name || "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium text-foreground">{user.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Member since</dt>
              <dd className="font-medium text-foreground">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString()
                  : "—"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent>
          <h2 className="text-lg font-semibold text-foreground">
            Order history
          </h2>

          {!orders || orders.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              You haven&apos;t placed any orders yet.
            </p>
          ) : (
            <ul className="mt-3 flex flex-col divide-y divide-border">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-foreground">{order.id}</p>
                    <p className="text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      ${order.total.toFixed(2)}
                    </p>
                    <p className="capitalize text-muted-foreground">
                      {order.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent>
          <h2 className="text-lg font-semibold text-foreground">
            Change password
          </h2>
          <div className="mt-3">
            <ChangePasswordForm email={user.email ?? ""} />
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <LogoutButton className="bg-white hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive" />
      </div>
    </div>
  );
}
