"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tag } from "lucide-react";
import { toast } from "sonner";

import { setTrackingNumber } from "@/app/admin/orders/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Shown on an order that's paid but not yet shipped — lets the admin
// paste in the tracking number PirateShip gave them, which marks the
// order "shipped" and emails it to the customer (see
// admin/orders/actions.ts).
export function TrackingNumberDialog({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [trackingNumber, setTrackingNumberValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      await setTrackingNumber(orderId, trackingNumber);
      toast.success("Order marked as shipped");
      setOpen(false);
      setTrackingNumberValue("");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save tracking number"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Tag />
            Insert Tracking Number
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Insert tracking number</DialogTitle>
            <DialogDescription>
              Marks this order as shipped and emails the tracking number to
              the customer.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-1.5">
            <Label htmlFor="trackingNumber">Tracking number</Label>
            <Input
              id="trackingNumber"
              required
              autoFocus
              value={trackingNumber}
              onChange={(e) => setTrackingNumberValue(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Mark as shipped"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
