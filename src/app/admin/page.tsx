import type { Metadata } from "next";
import Link from "next/link";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

import { getProducts } from "@/lib/supabase/products";
import { orders } from "@/data/orders";
import { users } from "@/data/users";
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
import { ORDER_STATUS_STYLES } from "@/components/admin/order-status-badge";

export const metadata: Metadata = {
  title: "Admin Dashboard | Hot Vitality",
};

export default async function AdminDashboardPage() {
  const products = await getProducts();
  const revenue = orders.reduce((total, order) => total + order.total, 0);
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
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={ORDER_STATUS_STYLES[order.status]}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    ${order.total.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
