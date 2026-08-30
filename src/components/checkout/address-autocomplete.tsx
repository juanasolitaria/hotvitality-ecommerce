"use client";

import { useEffect, useRef } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface ParsedAddress {
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface AddressAutocompleteProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (address: ParsedAddress) => void;
  className?: string;
  required?: boolean;
}

// The Maps JS API script only needs to load once per page, even across
// multiple instances of this component (there's only one on checkout, but
// this guards React StrictMode's double-effect in dev too).
let mapsLoaderPromise: Promise<typeof google> | null = null;

// <gmp-place-autocomplete> attaches a CLOSED shadow root by default, which
// even blocks DevTools from showing its contents unless you dig into
// Settings > Preferences > "Show user agent shadow DOM" or click "reveal
// closed shadow roots" — this forces it open instead so the real markup is
// just there in the Elements panel like anything else. Scoped to just this
// one custom element by tag name, so every other element's attachShadow
// (Shadow DOM elsewhere on the page, shadcn/Base UI components, etc.)
// behaves exactly as before. Most of this widget's look is now handled
// from OUTSIDE the shadow root (globals.css, styling the host element and
// the parts it explicitly exposes via `::part()`) rather than reaching in
// here — that's what actually fixed the black background/border two
// earlier JS-based attempts at restyling the inside couldn't (see
// globals.css for why), and the second of those attempts broke the
// suggestions dropdown outright. This patch stays because it's what makes
// the shadow root inspectable in DevTools in the first place, and because
// hideClearButton below still needs it to reach the "X" button, which
// has no exposed `part`.
let shadowOpenPatchApplied = false;

function patchAutocompleteShadowOpen() {
  if (shadowOpenPatchApplied) return;
  shadowOpenPatchApplied = true;

  const originalAttachShadow = Element.prototype.attachShadow;

  Element.prototype.attachShadow = function (
    this: Element,
    init: ShadowRootInit
  ): ShadowRoot {
    if (this.localName !== "gmp-place-autocomplete") {
      return originalAttachShadow.call(this, init);
    }
    return originalAttachShadow.call(this, { ...init, mode: "open" });
  };
}

// The "X" clear-input button has no `part` attribute exposing it (unlike
// the input and the focus ring, styled from globals.css instead), and its
// gray :hover background turned out to come from an internal rule we
// couldn't pin down without more back-and-forth than it's worth for a
// button that isn't needed anyway (retyping the address does the same
// job) — simplest fix is just hiding it outright.
function hideClearButton(host: google.maps.places.PlaceAutocompleteElement) {
  const apply = () => {
    const button = host.shadowRoot?.querySelector<HTMLElement>(".clear-button");
    if (!button) return false;
    button.style.setProperty("display", "none", "important");
    return true;
  };

  if (apply()) return;

  const observer = new MutationObserver(() => {
    if (apply()) observer.disconnect();
  });
  observer.observe(host.shadowRoot ?? host, { childList: true, subtree: true });
}

function loadGoogleMaps(apiKey: string): Promise<typeof google> {
  if (mapsLoaderPromise) return mapsLoaderPromise;

  mapsLoaderPromise = new Promise((resolve, reject) => {
    // @types/google.maps declares `google` as an always-present ambient
    // global, but it genuinely isn't until this script has loaded once —
    // re-typing it as optional here keeps that real runtime check honest.
    const existing = (window as unknown as { google?: typeof google }).google;
    if (existing?.maps?.importLibrary) {
      resolve(existing);
      return;
    }

    const callbackName = "__hotvitalityGoogleMapsLoaded";
    (window as unknown as Record<string, () => void>)[callbackName] = () =>
      resolve(window.google);

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async&callback=${callbackName}`;
    script.async = true;
    script.onerror = () => reject(new Error("Failed to load Google Maps JS API"));
    document.head.appendChild(script);
  });

  return mapsLoaderPromise;
}

// Google splits a selected place into a flat list of {longText, shortText,
// types[]} components instead of a ready-made shipping-address shape —
// this picks out the pieces our form actually has fields for.
function parseAddressComponents(
  components: google.maps.places.AddressComponent[]
): ParsedAddress {
  const find = (type: string) =>
    components.find((component) => component.types.includes(type));

  const streetNumber = find("street_number")?.longText ?? "";
  const route = find("route")?.longText ?? "";

  return {
    line1: [streetNumber, route].filter(Boolean).join(" "),
    city:
      find("locality")?.longText ??
      find("postal_town")?.longText ??
      find("sublocality")?.longText ??
      "",
    state: find("administrative_area_level_1")?.shortText ?? "",
    postalCode: find("postal_code")?.longText ?? "",
    country: find("country")?.longText ?? "",
  };
}

// Address autocomplete for the checkout form's "Address" field, backed by
// the Google Maps Places API (the only autocomplete widget still available
// to new Google Cloud projects — the older, simpler `Autocomplete` widget
// was cut off for new customers in March 2025). Falls back to a plain text
// input with no suggestions if NEXT_PUBLIC_GOOGLE_PLACES_API_KEY isn't set
// — same fail-open pattern as Telegram/Radar when their keys are missing,
// a missing key should never block checkout.
export function AddressAutocomplete({
  id,
  value,
  onChange,
  onSelect,
  className,
  required,
}: AddressAutocompleteProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  // Refs so the effect below (which only needs to run once, on mount)
  // always calls the latest onChange/onSelect without needing them in its
  // dependency array — checkout-form.tsx passes new closures every render.
  const onChangeRef = useRef(onChange);
  const onSelectRef = useRef(onSelect);
  onChangeRef.current = onChange;
  onSelectRef.current = onSelect;

  useEffect(() => {
    if (!apiKey || !containerRef.current) return;

    let cancelled = false;
    let element: google.maps.places.PlaceAutocompleteElement | null = null;

    loadGoogleMaps(apiKey)
      .then(async (googleNamespace) => {
        if (cancelled || !containerRef.current) return;

        const { PlaceAutocompleteElement } = (await googleNamespace.maps.importLibrary(
          "places"
        )) as google.maps.PlacesLibrary;

        patchAutocompleteShadowOpen();
        element = new PlaceAutocompleteElement({ includedRegionCodes: ["us"] });
        containerRef.current.appendChild(element);
        hideClearButton(element);

        element.addEventListener("gmp-select", async (event) => {
          try {
            const prediction = (
              event as unknown as {
                placePrediction: google.maps.places.PlacePrediction;
              }
            ).placePrediction;
            const place = prediction.toPlace();
            const { place: fullPlace } = await place.fetchFields({
              fields: ["addressComponents"],
            });
            const parsed = parseAddressComponents(fullPlace.addressComponents ?? []);
            onChangeRef.current(parsed.line1);
            onSelectRef.current(parsed);

            // After a pick, Google's own widget fills its displayed text
            // with the FULL formatted address ("901 Hillcrest Drive,
            // Hollywood, FL, USA") — city/state/country the customer
            // already sees repeated in their own fields below. Our state
            // (set above) already holds just the street part; this makes
            // the widget's own visible text match that, by writing
            // directly to the real <input> inside its shadow root (safe to
            // do here, after the `await` above, since Google's own render
            // from picking the suggestion has already finished by now).
            const shadowInput = element?.shadowRoot?.querySelector("input");
            if (shadowInput) shadowInput.value = parsed.line1;
          } catch (error) {
            console.error("Google Places fetchFields failed:", error);
          }
        });

        // Best-effort: keeps our form state in sync with manually typed
        // text too, not just picked suggestions — the input lives in this
        // element's shadow DOM, so we listen on the host for the bubbled
        // native `input` event instead of controlling its value directly.
        element.addEventListener("input", (event) => {
          const target = event.target as HTMLInputElement | null;
          if (target) onChangeRef.current(target.value);
        });
      })
      .catch((error) => {
        console.error("Failed to load Google Maps Places library:", error);
      });

    return () => {
      cancelled = true;
      element?.remove();
    };
  }, [apiKey]);

  if (!apiKey) {
    return (
      <Input
        id={id}
        className={className}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      id={id}
      className={cn(
        // Same box classes as ui/input.tsx's <Input>, so this container —
        // not anything inside Google's shadow DOM — is what actually
        // draws the border/background/radius/focus ring every other
        // field has. (This was the real bug behind the ugly square black
        // border: this div was only ever getting FIELD_CLASS's *extra*
        // overrides from checkout-form.tsx, never Input's own base
        // classes it was meant to layer on top of.) `focus-within`
        // instead of `focus-visible` since the actual <input> that gets
        // focused lives inside the shadow root, not on this div itself.
        "address-autocomplete flex h-8 w-full min-w-0 items-center rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 md:text-sm",
        className
      )}
    />
  );
}
