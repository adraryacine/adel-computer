export const formatPrice = (price) => {
  if (typeof price !== 'number') {
    return price;
  }
  
  // Formatte le nombre avec un séparateur de milliers et deux décimales
  const formatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  // Remplace l'espace insécable par un espace normal pour le séparateur de milliers
  return formatted.replace(/\s/g, ' ');
}; 