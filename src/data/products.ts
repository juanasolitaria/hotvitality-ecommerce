import type { Product } from "@/lib/types";

// Mock product catalog for the UI-only phase of the store. Once Supabase
// is wired up, this hardcoded array will be replaced by a real database
// query — but every component below reads from `products`, so swapping
// the data source later won't require touching the UI code at all.
export const products: Product[] = [
  {
    id: "1",
    slug: "multivitamin-daily",
    name: "Multivitamin Daily",
    shortDescription: "A complete daily blend of essential vitamins.",
    description:
      "Multivitamin Daily covers your everyday nutritional bases with 23 essential vitamins and minerals in one easy softgel. Formulated to support energy, immunity, and overall wellness — just one capsule with breakfast.",
    price: 24.99,
    image:
      "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80",
    category: "vitamins",
  },
  {
    id: "2",
    slug: "kids-multivitamin-gummies",
    name: "Kids Multivitamin Gummies",
    shortDescription: "Fruit-flavored gummies kids actually enjoy.",
    description:
      "Getting kids to take their vitamins shouldn't be a fight. These naturally fruit-flavored gummies deliver vitamin C, D, and B12 to support growth and immunity, with no artificial dyes.",
    price: 18.5,
    image:
      "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=800&q=80",
    category: "vitamins",
  },
  {
    id: "3",
    slug: "probiotic-complex",
    name: "Probiotic Complex 50 Billion CFU",
    shortDescription: "Supports gut health with 10 live probiotic strains.",
    description:
      "A high-potency blend of 10 clinically studied probiotic strains delivering 50 billion CFU per capsule, with a delayed-release design so more of it survives your stomach acid and reaches your gut.",
    price: 32.0,
    image:
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80",
    category: "wellness",
  },
  {
    id: "4",
    slug: "omega-3-fish-oil",
    name: "Omega-3 Fish Oil",
    shortDescription: "Purified fish oil rich in EPA and DHA.",
    description:
      "Sourced from wild-caught fish and molecularly distilled for purity, each softgel delivers 1,000mg of omega-3s (EPA + DHA) to support heart, brain, and joint health.",
    price: 27.99,
    image:
      "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=800&q=80",
    category: "wellness",
  },
  {
    id: "5",
    slug: "ashwagandha-extract",
    name: "Ashwagandha Extract",
    shortDescription: "Adaptogenic herb to help manage everyday stress.",
    description:
      "Our ashwagandha extract is standardized for withanolide content, the compound behind this ancient adaptogen's calming, stress-supporting effects. Take daily to help your body adapt to everyday stress.",
    price: 21.75,
    image:
      "https://images.unsplash.com/photo-1622480916113-9000ac49b79d?auto=format&fit=crop&w=800&q=80",
    category: "herbal",
  },
  {
    id: "6",
    slug: "magnesium-glycinate",
    name: "Magnesium Glycinate",
    shortDescription: "A gentle, highly absorbable form of magnesium.",
    description:
      "Magnesium glycinate is easier on the stomach than other forms of magnesium, supporting muscle relaxation, better sleep, and healthy nerve function without the laxative effect.",
    price: 19.99,
    image:
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=800&q=80",
    category: "minerals",
  },
  {
    id: "7",
    slug: "daily-greens-superfood",
    name: "Daily Greens Superfood Powder",
    shortDescription: "A scoop of veggies, greens, and antioxidants.",
    description:
      "One scoop mixes into water or a smoothie to deliver a blend of leafy greens, superfoods, and antioxidants — an easy way to round out your plate on busy days.",
    price: 34.5,
    image:
      "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=800&q=80",
    category: "wellness",
  },
];

// Convenience lookup used by the product detail page.
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}
