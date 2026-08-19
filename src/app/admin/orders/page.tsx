import type { Metadata } from "next";
import Link from "next/link";

import { getOrders } from "@/lib/supabase/orders";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  title: "Orders | HotVitality Admin",
};

// The operational view of orders: who ordered what and where it needs to
// go, for packing and shipping. `/admin/payments` covers the financial
// side (revenue) — this is the same underlying data, just for fulfillment.
export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {orders.length} orders. Click one to see the shipping address, phone,
        and items.
      </p>

      <Card className="mt-6">
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4">Order</TableHead>
                <TableHead className="px-4">Customer</TableHead>
                <TableHead className="px-4">Date</TableHead>
                <TableHead className="px-4">Items</TableHead>
                <TableHead className="px-4">Status</TableHead>
                <TableHead className="px-4">Shipping Status</TableHead>
                <TableHead className="px-4 text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const shippingStatus = getShippingStatus(
                  order.status,
                  order.trackingNumber
                );
                return (
                <TableRow key={order.id} className="cursor-pointer">
                  <TableCell className="p-0 font-medium">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="block px-4 py-3"
                    >
                      {order.id.slice(0, 8)}
                    </Link>
                  </TableCell>
                  <TableCell className="p-0">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="block px-4 py-3"
                    >
                      <p className="text-foreground">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.customerEmail}
                      </p>
                    </Link>
                  </TableCell>
                  <TableCell className="p-0">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="block px-4 py-3 text-muted-foreground"
                    >
                      {order.date}
                    </Link>
                  </TableCell>
                  <TableCell className="p-0">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="block px-4 py-3 text-muted-foreground"
                    >
                      {order.itemCount}
                    </Link>
                  </TableCell>
                  <TableCell className="p-0">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="block px-4 py-3"
                    >
                      <Badge
                        variant="outline"
                        className={ORDER_STATUS_STYLES[order.status]}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell className="p-0">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="block px-4 py-3"
                    >
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
                  <TableCell className="p-0 text-right font-medium">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="block px-4 py-3"
                    >
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
