import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Truck } from "lucide-react";

import { getOrderById } from "@/lib/supabase/orders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
} from "@/components/admin/order-status-badge";
import { CopyField } from "@/components/admin/copy-field";
import { TrackingNumberDialog } from "@/components/admin/tracking-number-dialog";

export const metadata: Metadata = {
  title: "Order | HotVitality Admin",
};

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) notFound();

  const address = order.shippingAddress;

  return (
    <div>
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to orders
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Order {order.id.slice(0, 8)}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{order.date}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={ORDER_STATUS_STYLES[order.status]}>
            {ORDER_STATUS_LABELS[order.status]}
          </Badge>
          {/* PirateShip has no way to prefill a shipment from a URL, so
              this just gets the admin there fast — the address and items
              below are laid out to be easy to copy into it by hand. */}
          <Button
            nativeButton={false}
            render={
              <a
                href="https://ship.pirateship.com/"
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            <Truck />
            Ship on PirateShip
          </Button>
          {!order.trackingNumber &&
            (order.status === "paid" ||
              order.status === "awaiting_shipping_label") && (
              <TrackingNumberDialog orderId={order.id} />
            )}
          {order.trackingNumber && (
            <CopyField label="Tracking number" value={order.trackingNumber} />
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.quantity} &times; {item.productName}
                  </span>
                  <span className="text-foreground">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Shipping</span>
              <span>${(order.total - order.subtotal).toFixed(2)}</span>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between text-base font-semibold text-foreground">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              <p className="text-foreground">
                <CopyField label="Name" value={order.customerName} />
              </p>
              <p className="text-muted-foreground">
                <CopyField label="Email" value={order.customerEmail} />
              </p>
              {address?.phone && (
                <p className="text-muted-foreground">
                  <CopyField label="Phone" value={address.phone} />
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle>Shipping address</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {address ? (
                <address className="not-italic">
                  <div>
                    <CopyField label="Address line 1" value={address.line1} />
                  </div>
                  {address.line2 && (
                    <div>
                      <CopyField label="Address line 2" value={address.line2} />
                    </div>
                  )}
                  <div>
                    <CopyField label="City" value={address.city} />
                  </div>
                  <div>
                    <CopyField label="State" value={address.state} />
                  </div>
                  <div>
                    <CopyField label="Postal code" value={address.postalCode} />
                  </div>
                  <div>
                    <CopyField label="Country" value={address.country} />
                  </div>
                </address>
              ) : (
                <p>No shipping address on file.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
