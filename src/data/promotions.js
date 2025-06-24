export const promotions = [
  {
    id: 1,
    title: "Black Friday - Jusqu'à 50% de réduction",
    description: "Les plus grandes réductions de l'année sur tous nos produits gaming et bureautique",
    discount: 50,
    discountType: "percentage", // percentage ou fixed
    code: "BLACKFRIDAY50",
    validFrom: "2025-01-01",
    validUntil: "2025-12-31",
    minPurchase: 100000, // en DA
    maxDiscount: 200000, // en DA
    applicableCategories: ["PC", "Écrans", "Casques"],
    applicableProducts: [1, 3, 10, 12], // IDs des produits
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=300&fit=crop",
    isActive: true,
    isFeatured: true,
    usageLimit: 100,
    usedCount: 45,
    conditions: [
      "Minimum d'achat: 100,000 DA",
      "Maximum de réduction: 200,000 DA",
      "Valable sur les produits gaming uniquement"
    ]
  },
  {
    id: 2,
    title: "Pack Gaming - Économisez 25%",
    description: "Achetez un PC gaming + écran + casque et économisez 25% sur le total",
    discount: 25,
    discountType: "percentage",
    code: "GAMINGPACK25",
    validFrom: "2025-01-01",
    validUntil: "2025-12-31",
    minPurchase: 300000,
    maxDiscount: 150000,
    applicableCategories: ["PC", "Écrans", "Casques"],
    applicableProducts: [1, 3, 10, 12, 13],
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop",
    isActive: true,
    isFeatured: true,
    usageLimit: 50,
    usedCount: 12,
    conditions: [
      "Minimum 3 produits gaming",
      "PC + Écran + Casque obligatoires",
      "Valable jusqu'au 31 décembre 2025"
    ]
  },
  {
    id: 3,
    title: "Première Commande - 15% de réduction",
    description: "Nouveau client ? Bénéficiez de 15% de réduction sur votre première commande",
    discount: 15,
    discountType: "percentage",
    code: "WELCOME15",
    validFrom: "2025-01-01",
    validUntil: "2025-12-31",
    minPurchase: 50000,
    maxDiscount: 50000,
    applicableCategories: ["all"],
    applicableProducts: [],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    isActive: true,
    isFeatured: false,
    usageLimit: 1000,
    usedCount: 234,
    conditions: [
      "Nouveaux clients uniquement",
      "Minimum d'achat: 50,000 DA",
      "Une utilisation par client"
    ]
  },
  {
    id: 4,
    title: "Réduction Flash - 20% sur les Accessoires",
    description: "Offre limitée : 20% de réduction sur tous les accessoires informatiques",
    discount: 20,
    discountType: "percentage",
    code: "ACCESSOIRES20",
    validFrom: "2025-01-01",
    validUntil: "2025-12-31",
    minPurchase: 20000,
    maxDiscount: 30000,
    applicableCategories: ["Accessoires", "Claviers", "Souris"],
    applicableProducts: [6, 7, 8, 9, 14, 15],
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop",
    isActive: true,
    isFeatured: true,
    usageLimit: 200,
    usedCount: 89,
    conditions: [
      "Offre limitée dans le temps",
      "Minimum d'achat: 20,000 DA",
      "Accessoires uniquement"
    ]
  },
  {
    id: 5,
    title: "Étudiant - 10% de réduction",
    description: "Présentez votre carte étudiant et bénéficiez de 10% de réduction",
    discount: 10,
    discountType: "percentage",
    code: "STUDENT10",
    validFrom: "2025-01-01",
    validUntil: "2025-12-31",
    minPurchase: 30000,
    maxDiscount: 40000,
    applicableCategories: ["all"],
    applicableProducts: [],
    image: "https://images.unsplash.com/photo-1523240798132-8757214e76ba?w=400&h=300&fit=crop",
    isActive: true,
    isFeatured: false,
    usageLimit: 500,
    usedCount: 156,
    conditions: [
      "Carte étudiant obligatoire",
      "Minimum d'achat: 30,000 DA",
      "Valable toute l'année"
    ]
  },
  {
    id: 6,
    title: "Livraison Gratuite",
    description: "Livraison gratuite pour toute commande supérieure à 200,000 DA",
    discount: 5000,
    discountType: "fixed",
    code: "FREESHIP",
    validFrom: "2025-01-01",
    validUntil: "2025-12-31",
    minPurchase: 200000,
    maxDiscount: 5000,
    applicableCategories: ["all"],
    applicableProducts: [],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    isActive: true,
    isFeatured: false,
    usageLimit: 1000,
    usedCount: 423,
    conditions: [
      "Minimum d'achat: 200,000 DA",
      "Livraison standard gratuite",
      "Valable sur tout le territoire"
    ]
  },
  {
    id: 7,
    title: "Pack Bureautique - 30% de réduction",
    description: "PC + Imprimante + Accessoires pour un environnement de travail complet",
    discount: 30,
    discountType: "percentage",
    code: "BUREAUTIQUE30",
    validFrom: "2025-01-01",
    validUntil: "2025-12-31",
    minPurchase: 150000,
    maxDiscount: 100000,
    applicableCategories: ["PC", "Imprimantes", "Accessoires"],
    applicableProducts: [2, 4, 5, 14, 15],
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop",
    isActive: true,
    isFeatured: true,
    usageLimit: 75,
    usedCount: 23,
    conditions: [
      "PC + Imprimante obligatoires",
      "Minimum d'achat: 150,000 DA",
      "Pack bureautique complet"
    ]
  },
  {
    id: 8,
    title: "Réduction Volume - 15% dès 3 produits",
    description: "Achetez 3 produits ou plus et bénéficiez de 15% de réduction",
    discount: 15,
    discountType: "percentage",
    code: "VOLUME15",
    validFrom: "2025-01-01",
    validUntil: "2025-12-31",
    minPurchase: 100000,
    maxDiscount: 80000,
    applicableCategories: ["all"],
    applicableProducts: [],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    isActive: true,
    isFeatured: false,
    usageLimit: 300,
    usedCount: 67,
    conditions: [
      "Minimum 3 produits différents",
      "Minimum d'achat: 100,000 DA",
      "Valable toute l'année"
    ]
  }
];

export const promotionCategories = [
  { id: 'all', name: 'Toutes les Promotions', icon: '🎉' },
  { id: 'featured', name: 'Promotions Vedettes', icon: '⭐' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'bureautique', name: 'Bureautique', icon: '💼' },
  { id: 'accessoires', name: 'Accessoires', icon: '🔧' },
  { id: 'flash', name: 'Offres Flash', icon: '⚡' },
  { id: 'student', name: 'Étudiants', icon: '🎓' }
];

export const getPromotionCategory = (promotion) => {
  if (promotion.isFeatured) return 'featured';
  if (promotion.title.toLowerCase().includes('gaming')) return 'gaming';
  if (promotion.title.toLowerCase().includes('bureautique')) return 'bureautique';
  if (promotion.applicableCategories.includes('Accessoires')) return 'accessoires';
  if (promotion.title.toLowerCase().includes('flash')) return 'flash';
  if (promotion.title.toLowerCase().includes('étudiant')) return 'student';
  return 'all';
};

export const calculateDiscount = (promotion, originalPrice) => {
  if (promotion.discountType === 'percentage') {
    const discountAmount = (originalPrice * promotion.discount) / 100;
    return Math.min(discountAmount, promotion.maxDiscount);
  } else {
    return Math.min(promotion.discount, promotion.maxDiscount);
  }
};

export const isPromotionValid = (promotion) => {
  const now = new Date();
  const validFrom = new Date(promotion.validFrom + 'T00:00:00');
  const validUntil = new Date(promotion.validUntil + 'T23:59:59');
  
  return promotion.isActive && 
         now >= validFrom && 
         now <= validUntil && 
         promotion.usedCount < promotion.usageLimit;
};

export const getPromotionStatus = (promotion) => {
  if (!promotion.isActive) return 'inactive';
  if (!isPromotionValid(promotion)) return 'expired';
  if (promotion.usedCount >= promotion.usageLimit) return 'limit-reached';
  return 'active';
}; 