import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

export const hero = import.meta.env.BASE_URL + "images/hero.jpg";

const FORMATS = { portrait: "Portrait", paysage: "Paysage", carre: "Carré" };
const EMPTY = { products: [], categories: [], loading: true, error: null };
const CatalogContext = createContext(EMPTY);

/** Visual style of a frame, derived from its (French or English) label. */
export function frameStyleFor(label = "") {
  const l = label.toLowerCase();
  const mk = (background, dot, inset = 12) => ({ background, dot, inset });
  if (!l || /sans|none|aucun/.test(l)) return mk("transparent", "#fff", 0);
  if (/noir|black/.test(l)) return mk("linear-gradient(135deg,#2b2b2b 0%,#050505 50%,#262626 100%)", "linear-gradient(135deg,#444,#000)");
  if (/blanc|white/.test(l)) return mk("linear-gradient(135deg,#fff,#e8e4dc)", "#fff");
  if (/dor|gold/.test(l)) return mk("linear-gradient(135deg,#e6c25a,#a67c1a 50%,#d9b24a)", "linear-gradient(135deg,#e6c25a,#a67c1a)");
  if (/argent|silver|gris|metal/.test(l)) return mk("linear-gradient(135deg,#d9d9d9,#8c8c8c 50%,#cfcfcf)", "linear-gradient(135deg,#d9d9d9,#8c8c8c)");
  return mk("linear-gradient(135deg,#c28a4d 0%,#8a5a2b 45%,#b57b3f 70%,#6e4520 100%)", "linear-gradient(135deg,#c28a4d,#6e4520)", 16);
}

/** Unit price = base price + size modifier + frame price for that size (same rule as the original site). */
export function getPrice(product, sizeId, frameId) {
  const size = product.sizes.find((s) => s.id === sizeId);
  const framePrice = frameId === "none" ? 0 : product.framePrice(sizeId, frameId) ?? 0;
  return product.basePrice + Number(size?.price_modifier || 0) + framePrice;
}

function buildProducts(artworks, sizes, frames, prices, categories) {
  const catLabel = Object.fromEntries(categories.map((c) => [c.id, c.label]));
  const priceMap = new Map(prices.map((p) => [`${p.size_id}:${p.frame_id}`, Number(p.price)]));
  return artworks.map((a) => ({
    id: a.id,
    name: a.title,
    reference: a.reference,
    category: a.category,
    format: a.format,
    colors: a.colors || [],
    featured: !!a.featured,
    basePrice: Number(a.base_price),
    image: a.image_url || a.mockup_image_url,
    mockupImage: a.mockup_image_url || a.image_url,
    // card display fields
    subtitle: a.reference,
    tag: a.featured ? "En vedette" : catLabel[a.category] || "",
    year: FORMATS[a.format] || "",
    sizes: sizes.filter((s) => s.artwork_id === a.id),
    frames: frames.filter((f) => f.artwork_id === a.id),
    // price of a frame for a given size, or null when that combination is not offered
    framePrice: (sizeId, frameId) => priceMap.get(`${sizeId}:${frameId}`) ?? null,
  }));
}

export function CatalogProvider({ children }) {
  const [state, setState] = useState(EMPTY);
  const timer = useRef(0);

  const load = useCallback(async () => {
    try {
      // The API returns at most 1000 rows per request, so every table is read page by page.
      const fetchAll = async (makeQuery) => {
        const PAGE = 1000;
        const rows = [];
        for (let from = 0; ; from += PAGE) {
          const { data, error } = await makeQuery().range(from, from + PAGE - 1);
          if (error) throw error;
          rows.push(...data);
          if (data.length < PAGE) break;
        }
        return rows;
      };
      const [cats, arts, sizes, frames, prices] = await Promise.all([
        fetchAll(() => supabase.from("categories").select("id, label").order("sort_order", { ascending: true }).order("id")),
        fetchAll(() => supabase.from("artworks").select("*").eq("is_active", true).order("sort_order", { ascending: true }).order("id")),
        fetchAll(() => supabase.from("artwork_sizes").select("*").eq("is_active", true).order("sort_order", { ascending: true }).order("id")),
        fetchAll(() => supabase.from("artwork_frames").select("*").eq("is_active", true).order("sort_order", { ascending: true }).order("id")),
        fetchAll(() => supabase.from("artwork_frame_prices").select("*").order("size_id").order("frame_id")),
      ]);
      const products = buildProducts(arts, sizes, frames, prices, cats);
      setState({ products, categories: cats, loading: false, error: null });
    } catch (err) {
      console.error("Supabase load failed:", err.message || err);
      setState((s) => ({ ...s, loading: false, error: err }));
    }
  }, []);

  useEffect(() => {
    load();
    // Live updates: any admin edit refreshes the catalogue (debounced)
    const refresh = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(load, 400);
    };
    const channel = supabase.channel(`catalog-${Math.random().toString(36).slice(2)}`);
    ["artworks", "categories", "artwork_sizes", "artwork_frames", "artwork_frame_prices"].forEach((table) =>
      channel.on("postgres_changes", { event: "*", schema: "public", table }, refresh)
    );
    channel.subscribe();
    return () => {
      clearTimeout(timer.current);
      supabase.removeChannel(channel);
    };
  }, [load]);

  const value = useMemo(() => state, [state]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export const useCatalog = () => useContext(CatalogContext);
