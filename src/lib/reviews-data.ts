// Real eBay buyer feedback, copied verbatim (typos and all) from our actual
// listings — see "Pending reminders" project memory for where the
// screenshots came from. Hardcoded on purpose: this is a handful of
// reviews that rarely change, not worth a database table + admin UI for.
// If that ever stops being true (reviews start coming from multiple
// platforms, or need frequent updates), move this to a `reviews` table
// instead.
export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  source: "eBay";
  /** Short label for the badge — the real listing titles are long
      ("BIQ-FEL Original Multivitamin for Men & Women 500mL + Free Gift"),
      this is a shortened version just for display. */
  product: string;
  /** Bottles bought — the eBay feedback screenshots don't show quantity,
      so this defaults to 1 (the typical order) unless we actually know
      otherwise. */
  quantity: number;
  /** Shown in the homepage's 4-up preview, not just /reviews. */
  featured: boolean;
}

export const REVIEWS: Review[] = [
  {
    id: "rob_74323",
    name: "rob_74323",
    rating: 5,
    text: "I got the product really quick and quality is great",
    source: "eBay",
    product: "VITAFER 500mL",
    quantity: 1,
    featured: true,
  },
  {
    id: "andresaguilar05141969",
    name: "andresaguilar05141969",
    rating: 5,
    text: "Super Quality, good condition and apperance",
    source: "eBay",
    product: "VITAFER 500mL",
    quantity: 2,
    featured: true,
  },
  {
    id: "isuantor_23",
    name: "isuantor_23",
    rating: 4,
    text: "Gracias el artículo a tiempo",
    source: "eBay",
    product: "BIQ-FEL Multivitamin",
    quantity: 1,
    featured: true,
  },
  {
    id: "nwk7587",
    name: "nwk7587",
    rating: 4,
    text: "Muy conforme contodo",
    source: "eBay",
    product: "VITAFER 500mL",
    quantity: 1,
    featured: true,
  },
  {
    id: "rleo9964",
    name: "rleo9964",
    rating: 5,
    text: "excellent product, fast delivery",
    source: "eBay",
    product: "BIQ-FEL Multivitamin",
    quantity: 2,
    featured: false,
  },
  {
    id: "opus1743",
    name: "opus1743",
    rating: 5,
    text: "As described, fast delivery. Thank you!",
    source: "eBay",
    product: "BIQ-FEL Multivitamin",
    quantity: 1,
    featured: false,
  },
  {
    id: "trotman7301",
    name: "trotman7301",
    rating: 4,
    text: "Good product",
    source: "eBay",
    product: "Original Vita",
    quantity: 1,
    featured: false,
  },
  {
    id: "jecarr_4336",
    name: "jecarr_4336",
    rating: 4,
    text: "Excelente",
    source: "eBay",
    product: "VITAFER 500mL",
    quantity: 1,
    featured: false,
  },
  {
    id: "2014_nohe",
    name: "2014_nohe",
    rating: 5,
    text: "excelente",
    source: "eBay",
    product: "Mega Vit Advanced",
    quantity: 3,
    featured: false,
  },
];

export const FEATURED_REVIEWS = REVIEWS.filter((review) => review.featured);
