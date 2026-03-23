/**
 * Formatting utility functions
 */

/**
 * Format phone number to Senegal format
 * @param {string} phone 
 * @returns {string}
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all spaces and characters except digits
  const cleaned = phone.replace(/\D/g, '');
  
  // If it starts with 221 or +221
  if (cleaned.startsWith('221')) {
    const number = cleaned.slice(3);
    return `+221 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`;
  }
  
  // If it's a local number (9 digits)
  if (cleaned.length === 9) {
    return `+221 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
  }
  
  return phone;
};

/**
 * Format weight in kg
 * @param {number} weight 
 * @returns {string}
 */
export const formatWeight = (weight) => {
  if (weight === null || weight === undefined) return '-';
  return `${weight.toFixed(1)} kg`;
};

/**
 * Format height/size in cm
 * @param {number} size 
 * @returns {string}
 */
export const formatSize = (size) => {
  if (size === null || size === undefined) return '-';
  return `${size} cm`;
};

/**
 * Format pregnancy week display
 * @param {number} week 
 * @returns {string}
 */
export const formatPregnancyWeek = (week) => {
  if (!week) return '-';
  return `Semaine ${week}`;
};

/**
 * Format age display (for babies)
 * @param {number} months 
 * @returns {string}
 */
export const formatAge = (months) => {
  if (months === null || months === undefined) return '-';
  
  if (months < 1) {
    return `${Math.round(months * 30)} jours`;
  }
  
  if (months < 24) {
    return `${months} mois`;
  }
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (remainingMonths === 0) {
    return `${years} an${years > 1 ? 's' : ''}`;
  }
  
  return `${years} an${years > 1 ? 's' : ''} ${remainingMonths} mois`;
};

/**
 * Format currency (XOF - Franc CFA)
 * @param {number} amount 
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format percentage
 * @param {number} value 
 * @param {number} decimals 
 * @returns {string}
 */
export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined) return '-';
  return `${value.toFixed(decimals)}%`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Format file size
 * @param {number} bytes 
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Octets';
  
  const k = 1024;
  const sizes = ['Octets', 'Ko', 'Mo', 'Go'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Capitalize first letter
 * @param {string} text 
 * @returns {string}
 */
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Format user role display
 * @param {string} role 
 * @returns {string}
 */
export const formatRole = (role) => {
  const roles = {
    'maman': 'Maman',
    'professionnel': 'Professionnel de santé',
    'admin': 'Administrateur',
  };
  return roles[role] || role;
};

/**
 * Format status badge
 * @param {string} status 
 * @returns {object} - { label, color }
 */
export const formatStatus = (status) => {
  const statuses = {
    'VALIDEE': { label: 'Validée', color: 'green' },
    'EN_ATTENTE': { label: 'En attente', color: 'yellow' },
    'REJETEE': { label: 'Rejetée', color: 'red' },
    'ACTIVE': { label: 'Active', color: 'green' },
    'INACTIVE': { label: 'Inactive', color: 'gray' },
    'COMPLETED': { label: 'Terminé', color: 'green' },
    'UPCOMING': { label: 'À venir', color: 'blue' },
  };
  return statuses[status] || { label: status, color: 'gray' };
};

export default {
  formatPhoneNumber,
  formatWeight,
  formatSize,
  formatPregnancyWeek,
  formatAge,
  formatCurrency,
  formatPercentage,
  truncateText,
  formatFileSize,
  capitalize,
  formatRole,
  formatStatus,
};
