// A thin promo strip pinned to the very top of every page, echoing the
// dark-green announcement bar from the UI reference screenshot.
export function AnnouncementBar() {
  return (
    <div className="bg-primary px-4 py-2 text-center text-xs font-medium text-primary-foreground sm:text-sm">
      &middot; Free shipping &middot; Exclusive Discounts &middot; Shop the essentials &middot;
    </div>
  );
}
