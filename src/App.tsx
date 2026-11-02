import { useState } from "react";
import { CartProvider } from "./context/CartContext";
import { CatalogProvider } from "./data/CatalogContext";
import GalleryShowcase from "./components/GalleryShowcase";
import { Footer } from "./components/Sections";
import CartDrawer from "./components/CartDrawer";
import FloatingCartButton from "./components/FloatingCartButton";
import Navbar from "./components/Navbar";
import Preloader from "./components/Preloader";

export default function App() {
  // `ready` flips as the intro curtain starts lifting, which triggers the hero entrance animation
  const [ready, setReady] = useState(false);

  return (
    <CatalogProvider>
    <CartProvider>
      <Preloader onReveal={() => setReady(true)} />
      <Navbar ready={ready} />
      <main>
        <GalleryShowcase ready={ready} />
      </main>
      <Footer />
      <CartDrawer />
      <FloatingCartButton />
    </CartProvider>
    </CatalogProvider>
  );
}
