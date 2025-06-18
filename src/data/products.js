export const products = [
  // PCs
  {
    id: 1,
    name: "PC Gaming Pro RTX 4080",
    category: "PC",
    price: 2499.99,
    description: "PC Gaming haut de gamme avec RTX 4080, Intel i9-13900K, 32GB RAM",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop",
    specs: {
      processor: "Intel Core i9-13900K",
      graphics: "NVIDIA RTX 4080",
      ram: "32GB DDR5",
      storage: "2TB NVMe SSD"
    },
    inStock: true,
    rating: 4.8
  },
  {
    id: 2,
    name: "PC Bureau Économique",
    category: "PC",
    price: 599.99,
    description: "PC de bureau pour usage quotidien, parfait pour la bureautique",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop",
    specs: {
      processor: "Intel Core i5-12400",
      graphics: "Intel UHD Graphics",
      ram: "16GB DDR4",
      storage: "512GB SSD"
    },
    inStock: true,
    rating: 4.2
  },
  {
    id: 3,
    name: "PC Portable Gaming",
    category: "PC",
    price: 1299.99,
    description: "PC Portable gaming avec RTX 4060, écran 15.6\" 144Hz",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    specs: {
      processor: "AMD Ryzen 7 7735HS",
      graphics: "NVIDIA RTX 4060",
      ram: "16GB DDR5",
      storage: "1TB NVMe SSD"
    },
    inStock: true,
    rating: 4.6
  },

  // Imprimantes
  {
    id: 4,
    name: "Imprimante Laser Multifonction",
    category: "Imprimantes",
    price: 299.99,
    description: "Imprimante laser couleur, impression, scan, copie, fax",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
    specs: {
      type: "Laser Multifonction",
      vitesse: "25 ppm",
      resolution: "1200 x 1200 dpi",
      connectivite: "WiFi, USB, Ethernet"
    },
    inStock: true,
    rating: 4.4
  },
  {
    id: 5,
    name: "Imprimante Jet d'Encre Photo",
    category: "Imprimantes",
    price: 149.99,
    description: "Imprimante jet d'encre spécialisée pour photos haute qualité",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
    specs: {
      type: "Jet d'Encre Photo",
      vitesse: "15 ppm",
      resolution: "4800 x 2400 dpi",
      connectivite: "WiFi, USB"
    },
    inStock: true,
    rating: 4.3
  },

  // Claviers
  {
    id: 6,
    name: "Clavier Mécanique Gaming",
    category: "Claviers",
    price: 129.99,
    description: "Clavier mécanique RGB avec switches Cherry MX Red",
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop",
    specs: {
      type: "Mécanique",
      switches: "Cherry MX Red",
      rgb: "Oui",
      connectivite: "USB-C"
    },
    inStock: true,
    rating: 4.7
  },
  {
    id: 7,
    name: "Clavier Sans Fil Ergonomique",
    category: "Claviers",
    price: 89.99,
    description: "Clavier sans fil ergonomique pour confort de frappe optimal",
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop",
    specs: {
      type: "Membrane",
      connectivite: "Bluetooth + USB",
      autonomie: "6 mois",
      ergonomie: "Oui"
    },
    inStock: true,
    rating: 4.5
  },

  // Souris
  {
    id: 8,
    name: "Souris Gaming RGB",
    category: "Souris",
    price: 79.99,
    description: "Souris gaming avec capteur optique 25K DPI et RGB",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
    specs: {
      type: "Optique",
      dpi: "25,600",
      rgb: "Oui",
      connectivite: "USB"
    },
    inStock: true,
    rating: 4.6
  },
  {
    id: 9,
    name: "Souris Sans Fil Logitech",
    category: "Souris",
    price: 59.99,
    description: "Souris sans fil ergonomique avec autonomie 2 ans",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
    specs: {
      type: "Optique",
      dpi: "1000",
      connectivite: "Bluetooth",
      autonomie: "2 ans"
    },
    inStock: true,
    rating: 4.4
  },

  // Casques
  {
    id: 10,
    name: "Casque Gaming 7.1",
    category: "Casques",
    price: 159.99,
    description: "Casque gaming avec son surround 7.1 et micro détachable",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    specs: {
      type: "Gaming",
      audio: "7.1 Surround",
      micro: "Détachable",
      connectivite: "USB + 3.5mm"
    },
    inStock: true,
    rating: 4.5
  },
  {
    id: 11,
    name: "Casque Bluetooth Bose",
    category: "Casques",
    price: 299.99,
    description: "Casque Bluetooth avec réduction de bruit active",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    specs: {
      type: "Bluetooth",
      reduction_bruit: "Active",
      autonomie: "20h",
      connectivite: "Bluetooth 5.0"
    },
    inStock: true,
    rating: 4.8
  },

  // Écrans
  {
    id: 12,
    name: "Écran Gaming 27\" 144Hz",
    category: "Écrans",
    price: 349.99,
    description: "Écran gaming 27\" avec 144Hz, 1ms, FreeSync",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop",
    specs: {
      taille: "27\"",
      resolution: "1920x1080",
      refresh_rate: "144Hz",
      response_time: "1ms"
    },
    inStock: true,
    rating: 4.6
  },
  {
    id: 13,
    name: "Écran 4K 32\"",
    category: "Écrans",
    price: 599.99,
    description: "Écran 4K 32\" pour montage vidéo et design",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop",
    specs: {
      taille: "32\"",
      resolution: "3840x2160",
      refresh_rate: "60Hz",
      color_gamut: "99% sRGB"
    },
    inStock: true,
    rating: 4.7
  },

  // Accessoires
  {
    id: 14,
    name: "Webcam HD 1080p",
    category: "Accessoires",
    price: 89.99,
    description: "Webcam HD avec micro intégré, parfaite pour visioconférence",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    specs: {
      resolution: "1080p",
      micro: "Intégré",
      connectivite: "USB",
      autofocus: "Oui"
    },
    inStock: true,
    rating: 4.3
  },
  {
    id: 15,
    name: "Disque Dur Externe 2TB",
    category: "Accessoires",
    price: 79.99,
    description: "Disque dur externe 2TB USB 3.0 pour sauvegarde",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    specs: {
      capacite: "2TB",
      interface: "USB 3.0",
      vitesse: "5400 RPM",
      format: "2.5\""
    },
    inStock: true,
    rating: 4.4
  }
];

export const categories = [
  { id: 'all', name: 'Tous les Produits', icon: '🛍️' },
  { id: 'PC', name: 'PC', icon: '💻' },
  { id: 'Imprimantes', name: 'Imprimantes', icon: '🖨️' },
  { id: 'Claviers', name: 'Claviers', icon: '⌨️' },
  { id: 'Souris', name: 'Souris', icon: '🖱️' },
  { id: 'Casques', name: 'Casques', icon: '🎧' },
  { id: 'Écrans', name: 'Écrans', icon: '🖥️' },
  { id: 'Accessoires', name: 'Accessoires', icon: '🔧' }
]; 