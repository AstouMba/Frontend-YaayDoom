/**
 * Date utility functions
 */

/**
 * Format a date to French locale string
 * @param {string|Date} date - The date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string}
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return new Date(date).toLocaleDateString('fr-FR', defaultOptions);
};

/**
 * Format date to short format (DD/MM/YYYY)
 * @param {string|Date} date 
 * @returns {string}
 */
export const formatDateShort = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Calculate pregnancy week based on last period date
 * @param {string|Date} lastPeriodDate 
 * @returns {number}
 */
export const calculatePregnancyWeek = (lastPeriodDate) => {
  if (!lastPeriodDate) return 0;
  
  const lastPeriod = new Date(lastPeriodDate);
  const today = new Date();
  const diffTime = today - lastPeriod;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Pregnancy is counted from last period, typically 40 weeks
  const week = Math.floor(diffDays / 7);
  return Math.min(week, 42); // Cap at 42 weeks
};

/**
 * Calculate due date based on last period
 * @param {string|Date} lastPeriodDate 
 * @returns {Date}
 */
export const calculateDueDate = (lastPeriodDate) => {
  if (!lastPeriodDate) return null;
  
  const lastPeriod = new Date(lastPeriodDate);
  // Add 280 days (40 weeks) for due date
  const dueDate = new Date(lastPeriod);
  dueDate.setDate(dueDate.getDate() + 280);
  
  return dueDate;
};

/**
 * Get trimester based on pregnancy week
 * @param {number} week 
 * @returns {1|2|3}
 */
export const getTrimester = (week) => {
  if (week <= 13) return 1;
  if (week <= 26) return 2;
  return 3;
};

/**
 * Calculate baby's age in months
 * @param {string|Date} birthDate 
 * @returns {number}
 */
export const calculateBabyAge = (birthDate) => {
  if (!birthDate) return 0;
  
  const birth = new Date(birthDate);
  const today = new Date();
  const diffMonths = (today.getFullYear() - birth.getFullYear()) * 12 + 
                    (today.getMonth() - birth.getMonth());
  return diffMonths;
};

/**
 * Format relative time (e.g., "il y a 2 jours")
 * @param {string|Date} date 
 * @returns {string}
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "aujourd'hui";
  if (diffDays === 1) return 'hier';
  if (diffDays < 7) return `il y a ${diffDays} jours`;
  if (diffDays < 30) return `il y a ${Math.floor(diffDays / 7)} semaines`;
  if (diffDays < 365) return `il y a ${Math.floor(diffDays / 30)} mois`;
  return `il y a ${Math.floor(diffDays / 365)} ans`;
};

export default {
  formatDate,
  formatDateShort,
  calculatePregnancyWeek,
  calculateDueDate,
  getTrimester,
  calculateBabyAge,
  formatRelativeTime,
};
