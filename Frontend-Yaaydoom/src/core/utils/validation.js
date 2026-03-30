/**
 * Validation utility functions
 */

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Senegal phone number
 * Accepts formats: +221 XX XXX XX XX, 221 XX XXX XX XX, 77 XXX XX XX
 * @param {string} phone 
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+221|221)?[ \d]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate password strength
 * Minimum 8 characters, at least one letter and one number
 * @param {string} password 
 * @returns {{valid: boolean, message: string}}
 */
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, message: 'Le mot de passe est requis' };
  }
  if (password.length < 8) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins 8 caractères' };
  }
  if (!/[a-zA-Z]/.test(password)) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins une lettre' };
  }
  if (!/\d/.test(password)) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins un chiffre' };
  }
  return { valid: true, message: '' };
};

/**
 * Validate required field
 * @param {any} value 
 * @returns {boolean}
 */
export const isRequired = (value) => {
  if (typeof value === 'string') return value.trim().length > 0;
  return value !== null && value !== undefined;
};

/**
 * Validate date is not in the future
 * @param {string|Date} date 
 * @returns {boolean}
 */
export const isNotFutureDate = (date) => {
  if (!date) return false;
  return new Date(date) <= new Date();
};

/**
 * Validate date is not too old (more than 100 years)
 * @param {string|Date} date 
 * @returns {boolean}
 */
export const isValidBirthDate = (date) => {
  if (!date) return false;
  const birthDate = new Date(date);
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 100);
  return birthDate >= minDate && birthDate <= new Date();
};

/**
 * Validate Senegal ID number (NINA or birth certificate)
 * @param {string} id 
 * @returns {boolean}
 */
export const isValidIdNumber = (id) => {
  if (!id) return false;
  // Basic validation - minimum 5 characters
  return id.replace(/\s/g, '').length >= 5;
};

/**
 * Validate professional matricule format
 * Format: XXX-YYYY-NNN (e.g., GYN-2024-001)
 * @param {string} matricule 
 * @returns {boolean}
 */
export const isValidMatricule = (matricule) => {
  const matriculeRegex = /^[A-Z]{3}-\d{4}-\d{3}$/;
  return matriculeRegex.test(matricule);
};

/**
 * Form validation helper
 * @param {object} values - Form values
 * @param {object} rules - Validation rules
 * @returns {object} - Errors object
 */
export const validateForm = (values, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach((field) => {
    const value = values[field];
    const fieldRules = rules[field];
    
    for (const rule of fieldRules) {
      const error = rule(value, values);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });
  
  return errors;
};

/**
 * Common validation rules factory
 */
export const rules = {
  required: (message = 'Ce champ est requis') => (value) => {
    return isRequired(value) ? null : message;
  },
  
  email: (message = 'Email invalide') => (value) => {
    return value && !isValidEmail(value) ? message : null;
  },
  
  phone: (message = 'Numéro de téléphone invalide') => (value) => {
    return value && !isValidPhone(value) ? message : null;
  },
  
  minLength: (min, message) => (value) => {
    return value && value.length < min ? message || `Minimum ${min} caractères` : null;
  },
  
  maxLength: (max, message) => (value) => {
    return value && value.length > max ? message || `Maximum ${max} caractères` : null;
  },
  
  password: () => validatePassword,
  
  pastDate: (message = 'La date doit être dans le passé') => (value) => {
    return value && !isNotFutureDate(value) ? message : null;
  },
};

export default {
  isValidEmail,
  isValidPhone,
  validatePassword,
  isRequired,
  isNotFutureDate,
  isValidBirthDate,
  isValidIdNumber,
  isValidMatricule,
  validateForm,
  rules,
};
