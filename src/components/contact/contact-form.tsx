"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { sendContactMessage } from "@/app/(storefront)/contact/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ContactFormProps {
  initialName: string;
  initialEmail: string;
}

export function ContactForm({ initialName, initialEmail }: ContactFormProps) {
  const [form, setForm] = useState({
    name: initialName,
    email: initialEmail,
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  function update(field: "name" | "email" | "phone" | "message", value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      await sendContactMessage(form);
      toast.success("Message sent — we'll get back to you soon.");
      // Keep name/email as they were (prefilled for a logged-in customer)
      // — only the message itself needs clearing out for a fresh send.
      setForm((prev) => ({ ...prev, phone: "", message: "" }));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Couldn't send your message."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-name">
          Name <span className="text-primary">*</span>
        </Label>
        <Input
          id="contact-name"
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-email">
          Email <span className="text-primary">*</span>
        </Label>
        <Input
          id="contact-email"
          type="email"
          required
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-phone">Phone Number</Label>
        <Input
          id="contact-phone"
          type="tel"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-message">
          Message <span className="text-primary">*</span>
        </Label>
        <Textarea
          id="contact-message"
          required
          rows={6}
          maxLength={2000}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
        />
      </div>

      <Button type="submit" size="lg" disabled={submitting} className="mt-2 w-full">
        {submitting ? "Sending..." : "Send"}
      </Button>
    </form>
  );
}
