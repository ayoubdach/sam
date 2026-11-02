import { useEffect, useMemo, useState } from "react";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Truck,
  MessageCircle,
  ShieldCheck,
  PartyPopper,
  Banknote,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  GOVERNORATES,
  WHATSAPP_NUMBER,
  formatTND,
} from "../config";

const EMPTY_FORM = { name: "", phone: "", address: "", governorate: "", notes: "" };

/** Accepts 8-digit Tunisian numbers, optionally prefixed with +216 / 00216 / 216. */
const normalizePhone = (raw) => {
  let digits = raw.replace(/[^\d+]/g, "");
  digits = digits.replace(/^\+/, "").replace(/^00/, "");
  if (digits.startsWith("216") && digits.length === 11) digits = digits.slice(3);
  return digits;
};

const validate = (form) => {
  const errors = {};
  if (form.name.trim().length < 3) errors.name = "Please enter your full name";
  if (!/^\d{8}$/.test(normalizePhone(form.phone)))
    errors.phone = "Enter a valid 8-digit Tunisian number";
  if (!form.governorate) errors.governorate = "Choose your governorate";
  if (form.address.trim().length < 6) errors.address = "Please enter your delivery address";
  return errors;
};

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.18em] text-ink/60">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs font-medium text-red-700">{error}</span>}
    </label>
  );
}

export default function CartDrawer() {
  const {
    items,
    subtotal,
    itemCount,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const [step, setStep] = useState("bag"); // bag | checkout | sent
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [waLink, setWaLink] = useState("");

  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;
  const progress = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);

  // Lock page scroll + close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  // If the bag empties while checking out, go back to the bag view
  useEffect(() => {
    if (items.length === 0 && step === "checkout") setStep("bag");
  }, [items.length, step]);

  // Reset to a fresh state shortly after closing
  useEffect(() => {
    if (isOpen) return;
    const t = setTimeout(() => {
      if (step === "sent") {
        setStep("bag");
        setWaLink("");
      }
    }, 400);
    return () => clearTimeout(t);
  }, [isOpen, step]);

  const setField = (field) => (e) => {
    const value = e.target.value;
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (submitted) setErrors(validate(next));
      return next;
    });
  };

  const message = useMemo(() => {
    const lines = items.map(
      (i, idx) =>
        `${idx + 1}. ${i.reference ? `🔖 *Ref: ${i.reference}*\n    ` : ""}${i.name}\n    ${i.sizeLabel} | ${i.frameLabel}\n    ${i.quantity} x ${i.unitPrice} TND = ${
          i.quantity * i.unitPrice
        } TND`
    );
    return [
      "🛍️ *NEW ORDER - Sam'Art Gallery*",
      "━━━━━━━━━━━━━━━━",
      "",
      "👤 *CUSTOMER*",
      `Name: ${form.name.trim()}`,
      `Phone: +216 ${normalizePhone(form.phone)}`,
      `Governorate: ${form.governorate}`,
      `Address: ${form.address.trim()}`,
      form.notes.trim() ? `Notes: ${form.notes.trim()}` : null,
      "",
      "🖼️ *ITEMS*",
      lines.join("\n"),
      "",
      "━━━━━━━━━━━━━━━━",
      `Subtotal: ${subtotal} TND`,
      `Delivery: ${delivery === 0 ? "FREE" : `${delivery} TND`}`,
      `💰 *TOTAL: ${total} TND*`,
      "",
      "💵 *Payment: Cash on Delivery (Paiement à la livraison)*",
      "",
      "Thank you! 🙏",
    ]
      .filter((l) => l !== null)
      .join("\n");
  }, [items, form, subtotal, delivery, total]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length > 0 || items.length === 0) return;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    setWaLink(url);
    window.open(url, "_blank", "noopener,noreferrer");
    clearCart();
    setForm(EMPTY_FORM);
    setSubmitted(false);
    setErrors({});
    setStep("sent");
  };

  const inputBase =
    "w-full rounded-xl border bg-paper/70 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-terracotta focus:bg-paper focus:ring-4 focus:ring-terracotta/15";

  return (
    <div
      className={`fixed inset-0 z-[120] ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-obsidian/70 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-[34rem] flex-col bg-paper transition-[transform,box-shadow] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0 shadow-[-30px_0_80px_rgba(43,29,22,0.45)]" : "translate-x-full shadow-none"
        }`}
      >
        {/* Header */}
        <header className="relative overflow-hidden bg-obsidian px-6 pb-5 pt-6 text-cream">
          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-terracotta/40 blur-3xl" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
                {step === "checkout" ? "Express checkout" : step === "sent" ? "Order sent" : "Your selection"}
              </p>
              <h2 className="mt-1 font-display text-4xl font-medium leading-none">
                {step === "checkout" ? (
                  <>
                    Delivery <em className="text-gold-shimmer pr-1">details</em>
                  </>
                ) : step === "sent" ? (
                  <>
                    Shukran <em className="text-gold-shimmer pr-1">!</em>
                  </>
                ) : (
                  <>
                    The <em className="text-gold-shimmer pr-1">Bag</em>
                    <span className="ml-2 align-top text-sm font-sans font-semibold text-cream/50">
                      ({itemCount})
                    </span>
                  </>
                )}
              </h2>
            </div>
            <button
              onClick={closeCart}
              aria-label="Close cart"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 transition hover:rotate-90 hover:border-gold hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free delivery progress */}
          {step !== "sent" && items.length > 0 && (
            <div className="relative mt-5">
              <div className="mb-2 flex items-center gap-2 text-xs text-cream/75">
                <Truck size={14} className="text-gold" />
                {remaining > 0 ? (
                  <span>
                    Add <b className="text-amber-glow">{formatTND(remaining)}</b> for free delivery
                  </span>
                ) : (
                  <span className="font-semibold text-amber-glow">
                    ✨ You unlocked free delivery across Tunisia
                  </span>
                )}
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-terracotta via-amber-glow to-gold transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </header>

        {/* BODY */}
        {step === "sent" ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="relative mb-6 grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-amber-glow to-terracotta text-obsidian">
              <span className="absolute inset-0 animate-ping-soft rounded-full bg-amber-glow/50" />
              <PartyPopper size={40} />
            </div>
            <h3 className="font-display text-4xl leading-tight">Your order is on its way to WhatsApp</h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/65">
              Send the pre-filled message to confirm. Samar will reply personally to arrange your
              delivery. You pay <b>cash on delivery</b>, only when your piece arrives.
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#4b8060] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-900/20 transition hover:-translate-y-0.5 hover:bg-[#3d6b50]"
            >
              <MessageCircle size={18} /> WhatsApp didn't open? Tap here
            </a>
            <button
              onClick={closeCart}
              className="mt-4 text-sm font-semibold text-terracotta underline-offset-4 hover:underline"
            >
              Continue exploring the gallery
            </button>
          </div>
        ) : step === "bag" ? (
          <>
            <div className="thin-scroll flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-5 grid h-24 w-24 place-items-center rounded-full border border-dashed border-terracotta/40 text-terracotta">
                    <ShoppingBag size={36} strokeWidth={1.4} />
                  </div>
                  <h3 className="font-display text-3xl">Your bag is empty</h3>
                  <p className="mt-2 max-w-xs text-sm text-ink/60">
                    Every piece in the gallery is made by hand. Find the one that speaks to you.
                  </p>
                  <button
                    onClick={() => {
                      closeCart();
                      setTimeout(
                        () => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" }),
                        350
                      );
                    }}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-cream transition hover:bg-sienna"
                  >
                    Browse the collection <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li
                      key={item.key}
                      className="group flex gap-4 rounded-2xl border border-sand bg-paper/70 p-3 transition hover:border-gold/60 hover:bg-paper"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-28 w-24 shrink-0 rounded-xl object-cover"
                      />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-display text-xl font-semibold leading-tight">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.key)}
                            aria-label={`Remove ${item.name}`}
                            className="-mr-1 rounded-full p-1.5 text-ink/65 transition hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          <span className="rounded-full bg-sand/70 px-2.5 py-0.5 text-[11px] font-semibold text-ink/70">
                            {item.sizeLabel}
                            {item.sizeHint ? ` · ${item.sizeHint}` : ""}
                          </span>
                          <span className="rounded-full bg-sand/70 px-2.5 py-0.5 text-[11px] font-semibold text-ink/70">
                            {item.frameLabel}
                          </span>
                        </div>
                        <div className="mt-auto flex items-end justify-between pt-3">
                          <div className="flex items-center rounded-full border border-ink/15 bg-paper">
                            <button
                              onClick={() => updateQuantity(item.key, -1)}
                              aria-label="Decrease quantity"
                              className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-terracotta hover:text-cream"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-7 text-center text-sm font-bold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.key, 1)}
                              aria-label="Increase quantity"
                              className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-terracotta hover:text-cream"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-[11px] text-ink/60">{formatTND(item.unitPrice)} each</p>
                            <p className="font-display text-xl font-bold text-terracotta">
                              {formatTND(item.unitPrice * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-sand bg-cream px-6 pb-6 pt-5">
                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-ink/65">
                    <dt>Subtotal</dt>
                    <dd className="font-semibold tabular-nums">{formatTND(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-ink/65">
                    <dt>Delivery</dt>
                    <dd className="font-semibold tabular-nums">
                      {delivery === 0 ? (
                        <span className="text-green-700">Free</span>
                      ) : (
                        formatTND(delivery)
                      )}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-dashed border-ink/20 pt-3">
                    <dt className="font-display text-2xl">Total</dt>
                    <dd className="font-display text-3xl font-bold text-terracotta tabular-nums">
                      {formatTND(total)}
                    </dd>
                  </div>
                </dl>
                <button
                  onClick={() => setStep("checkout")}
                  className="group relative mt-4 flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-terracotta py-4 text-sm font-bold uppercase tracking-[0.18em] text-cream transition hover:shadow-xl hover:shadow-terracotta/30"
                >
                  <span className="absolute inset-0 -translate-x-full bg-sienna transition-transform duration-500 group-hover:translate-x-0" />
                  <span className="relative">Checkout</span>
                  <ArrowRight size={18} className="relative transition group-hover:translate-x-1" />
                </button>
                <button
                  onClick={clearCart}
                  className="mx-auto mt-3 block text-xs font-semibold text-ink/60 underline-offset-4 transition hover:text-red-700 hover:underline"
                >
                  Empty the bag
                </button>
              </footer>
            )}
          </>
        ) : (
          /* CHECKOUT */
          <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="thin-scroll flex-1 space-y-4 overflow-y-auto px-6 py-5">
              <button
                type="button"
                onClick={() => setStep("bag")}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-ink/65 transition hover:text-terracotta"
              >
                <ArrowLeft size={14} /> Back to bag
              </button>

              <Field label="Full name *" error={errors.name}>
                <input
                  value={form.name}
                  onChange={setField("name")}
                  autoComplete="name"
                  placeholder="e.g. Yasmine Ben Salah"
                  className={`${inputBase} ${errors.name ? "border-red-500" : "border-sand"}`}
                />
              </Field>

              <Field label="Phone number *" error={errors.phone}>
                <div className="flex">
                  <span className="grid place-items-center rounded-l-xl border border-r-0 border-sand bg-sand/60 px-3 text-sm font-bold text-ink/70">
                    🇹🇳 +216
                  </span>
                  <input
                    value={form.phone}
                    onChange={setField("phone")}
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="98 123 456"
                    className={`${inputBase} rounded-l-none ${errors.phone ? "border-red-500" : "border-sand"}`}
                  />
                </div>
              </Field>

              <Field label="Governorate *" error={errors.governorate}>
                <select
                  value={form.governorate}
                  onChange={setField("governorate")}
                  className={`${inputBase} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%231b1511%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat ${
                    errors.governorate ? "border-red-500" : "border-sand"
                  }`}
                >
                  <option value="">Select your governorate…</option>
                  {GOVERNORATES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Delivery address *" error={errors.address}>
                <textarea
                  value={form.address}
                  onChange={setField("address")}
                  rows={3}
                  autoComplete="street-address"
                  placeholder="Street, building, city, postal code…"
                  className={`${inputBase} resize-none ${errors.address ? "border-red-500" : "border-sand"}`}
                />
              </Field>

              <Field label="Note for Samar (optional)">
                <input
                  value={form.notes}
                  onChange={setField("notes")}
                  placeholder="Custom dimensions, gift message…"
                  className={`${inputBase} border-sand`}
                />
              </Field>

              <div className="flex items-start gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-4">
                <Banknote className="mt-0.5 shrink-0 text-terracotta" size={20} />
                <div className="text-xs leading-relaxed text-ink/75">
                  <b className="text-ink">Cash on Delivery · Paiement à la livraison.</b> No online
                  payment. You pay in TND when the courier hands you your piece.
                </div>
              </div>
            </div>

            <footer className="border-t border-sand bg-cream px-6 pb-6 pt-4">
              <div className="mb-3 flex items-baseline justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-ink/65">
                  Total to pay on delivery
                </span>
                <span className="font-display text-3xl font-bold text-terracotta tabular-nums">
                  {formatTND(total)}
                </span>
              </div>
              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-[#4b8060] py-4 text-sm font-bold uppercase tracking-[0.15em] text-white shadow-lg shadow-green-900/25 transition hover:-translate-y-0.5 hover:bg-[#3d6b50]"
              >
                <MessageCircle size={20} /> Order on WhatsApp
                <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-ink/60">
                <ShieldCheck size={13} /> Your details are only shared with Samar via WhatsApp
              </p>
            </footer>
          </form>
        )}
      </aside>
    </div>
  );
}
