export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getGenderLabel = (gender: boolean): string => {
  return gender ? 'Male' : 'Female';
};

export const getConcentrationLabel = (concentration: string): string => {
  const labels: { [key: string]: string } = {
    'Extrait': 'Extrait de Parfum',
    'EDP': 'Eau de Parfum',
    'EDT': 'Eau de Toilette',
    'EDC': 'Eau de Cologne',
  };
  return labels[concentration] || concentration;
};

export const getConcentrationColor = (concentration: string): string => {
  const colors: { [key: string]: string } = {
    'Extrait': '#8b5cf6', // Purple - most luxurious
    'EDP': '#3b82f6',     // Blue
    'EDT': '#10b981',     // Green
    'EDC': '#f59e0b',     // Yellow
  };
  return colors[concentration] || '#6b7280';
};

export const getConcentrationGradient = (concentration: string): string => {
  const gradients: { [key: string]: string } = {
    'Extrait': 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)',
    'EDP': 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
    'EDT': 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
    'EDC': 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
  };
  return gradients[concentration] || 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)';
};

export const isExtraitConcentration = (concentration: string): boolean => {
  return concentration === 'Extrait';
};

export const getTargetAudienceIcon = (targetAudience: string): string => {
  const icons: { [key: string]: string } = {
    'male': '♂',
    'female': '♀',
    'unisex': '⚲',
  };
  return icons[targetAudience] || '⚲';
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  return errors;
};

export const getRatingStars = (rating: number): string => {
  const stars = '★'.repeat(rating) + '☆'.repeat(3 - rating);
  return stars;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};