// Central brand configuration.
// WhatsApp business number (country code 216 + 8 digits, no "+" or spaces).
export const WHATSAPP_NUMBER = "21628916115";

export const BRAND = {
  name: "Sam'Art Gallery",
  owner: "Samar Saddouri",
  instagram: "https://www.instagram.com/sam_art_galleryy/",
  facebook: "https://www.facebook.com/share/1TJ7XrefTv/",
  tiktok: "https://www.tiktok.com/@sam_art_galleryy?_r=1&_t=ZS-99xIkvyXEma",
};

export const CURRENCY = "TND";

// Delivery rules (Tunisia)
export const DELIVERY_FEE = 8;
export const FREE_DELIVERY_THRESHOLD = 300;

export const GOVERNORATES = [
  "Tunis",
  "Ariana",
  "Ben Arous",
  "Manouba",
  "Nabeul",
  "Zaghouan",
  "Bizerte",
  "Béja",
  "Jendouba",
  "Le Kef",
  "Siliana",
  "Sousse",
  "Monastir",
  "Mahdia",
  "Sfax",
  "Kairouan",
  "Kasserine",
  "Sidi Bouzid",
  "Gabès",
  "Médenine",
  "Tataouine",
  "Gafsa",
  "Tozeur",
  "Kébili",
];

export const formatTND = (value) =>
  `${Number(value).toLocaleString("fr-TN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  })} ${CURRENCY}`;
