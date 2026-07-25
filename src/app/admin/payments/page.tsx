import type { Metadata } from "next";

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
import { ORDER_STATUS_STYLES } from "@/components/admin/order-status-badge";

export const metadata: Metadata = {
  title: "Payments | Hot Vitality Admin",
};

export default async function AdminPaymentsPage() {
  const orders = await getOrders();
  const revenue = orders.reduce(
    (total, order) => total + (order.status !== "refunded" ? order.total : 0),
    0
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Payments</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {orders.length} orders &middot; ${revenue.toFixed(2)} in collected
        revenue
      </p>

      <Card className="mt-6">
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-foreground">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.customerEmail}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {order.date}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {order.itemCount}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={ORDER_STATUS_STYLES[order.status]}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
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
