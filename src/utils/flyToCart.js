/**
 * Launches a small clone of the product image from its card toward the floating cart button.
 * Pure DOM + Web Animations API: no state, no re-renders.
 */
export function flyToCart(imgEl) {
  if (typeof document === "undefined" || !imgEl) return;
  const target = document.getElementById("floating-cart-btn");
  if (!target || !imgEl.animate) return;

  const from = imgEl.getBoundingClientRect();
  const to = target.getBoundingClientRect();

  const size = 96;
  const startX = from.left + from.width / 2 - size / 2;
  const startY = from.top + from.height / 2 - size / 2;
  const endX = to.left + to.width / 2 - size / 2;
  const endY = to.top + to.height / 2 - size / 2;

  const ghost = document.createElement("div");
  Object.assign(ghost.style, {
    position: "fixed",
    left: `${startX}px`,
    top: `${startY}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "9999px",
    backgroundImage: `url("${imgEl.currentSrc || imgEl.src}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    boxShadow: "0 0 0 3px #c9a24b, 0 20px 50px rgba(0,0,0,.45)",
    zIndex: "100",
    pointerEvents: "none",
  });
  document.body.appendChild(ghost);

  const dx = endX - startX;
  const dy = endY - startY;

  const anim = ghost.animate(
    [
      { transform: "translate(0,0) scale(0.4)", opacity: 0.0, offset: 0 },
      { transform: "translate(0,0) scale(1)", opacity: 1, offset: 0.15 },
      {
        transform: `translate(${dx * 0.55}px, ${dy * 0.55 - 120}px) scale(0.8) rotate(120deg)`,
        opacity: 1,
        offset: 0.6,
      },
      {
        transform: `translate(${dx}px, ${dy}px) scale(0.12) rotate(300deg)`,
        opacity: 0.9,
        offset: 1,
      },
    ],
    { duration: 900, easing: "cubic-bezier(0.55, 0, 0.25, 1)" }
  );
  anim.onfinish = () => ghost.remove();
  anim.oncancel = () => ghost.remove();
}
