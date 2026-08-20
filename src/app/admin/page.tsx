import type { Metadata } from "next";
import Link from "next/link";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

import { getProducts } from "@/lib/supabase/products";
import { getOrders } from "@/lib/supabase/orders";
import { getUsers } from "@/lib/supabase/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
  getShippingStatus,
} from "@/components/admin/order-status-badge";

export const metadata: Metadata = {
  title: "Admin Dashboard | HotVitality",
};

export default async function AdminDashboardPage() {
  const products = await getProducts();
  const orders = await getOrders();
  const users = await getUsers();
  // Only orders that were actually paid for and not since refunded count
  // as revenue — `pending` never got charged, and `cancelled` never will.
  // `awaiting_shipping_label` is included: that's still collected money,
  // just not shipped yet.
  const revenue = orders.reduce(
    (total, order) =>
      total +
      (order.status === "paid" ||
      order.status === "awaiting_shipping_label" ||
      order.status === "shipped"
        ? order.total
        : 0),
    0
  );
  const recentOrders = orders.slice(0, 5);

  const stats = [
    {
      label: "Total Revenue",
      value: `$${revenue.toFixed(2)}`,
      icon: DollarSign,
    },
    { label: "Orders", value: orders.length, icon: ShoppingCart },
    { label: "Products", value: products.length, icon: Package },
    { label: "Users", value: users.length, icon: Users },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        A quick overview of the store.
      </p>

      {/* 2 columns on mobile, 4 from `lg` up. */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
              <div className="flex size-9 items-center justify-center rounded-full bg-accent text-primary">
                <stat.icon className="size-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <CardTitle>Recent Orders</CardTitle>
          <Link
            href="/admin/payments"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4">Order</TableHead>
                <TableHead className="px-4">Customer</TableHead>
                <TableHead className="px-4">Status</TableHead>
                <TableHead className="px-4">Shipping Status</TableHead>
                <TableHead className="px-4 text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => {
                const shippingStatus = getShippingStatus(
                  order.status,
                  order.trackingNumber
                );
                return (
                <TableRow key={order.id} className="cursor-pointer">
                  <TableCell className="p-0 font-medium">
                    <Link href={`/admin/orders/${order.id}`} className="block px-4 py-3">
                      {order.id.slice(0, 8)}
                    </Link>
                  </TableCell>
                  <TableCell className="p-0">
                    <Link href={`/admin/orders/${order.id}`} className="block px-4 py-3">
                      {order.customerName}
                    </Link>
                  </TableCell>
                  <TableCell className="p-0">
                    <Link href={`/admin/orders/${order.id}`} className="block px-4 py-3">
                      <Badge
                        variant="outline"
                        className={ORDER_STATUS_STYLES[order.status]}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell className="p-0">
                    <Link href={`/admin/orders/${order.id}`} className="block px-4 py-3">
                      {shippingStatus.style ? (
                        <Badge variant="outline" className={shippingStatus.style}>
                          {shippingStatus.label}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">
                          {shippingStatus.label}
                        </span>
                      )}
                    </Link>
                  </TableCell>
                  <TableCell className="p-0 text-right">
                    <Link href={`/admin/orders/${order.id}`} className="block px-4 py-3">
                      ${order.total.toFixed(2)}
                    </Link>
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
