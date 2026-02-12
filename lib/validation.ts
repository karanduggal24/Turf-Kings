// Form Validation Utilities

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  
  return { isValid: true };
};

// Phone number validation (Indian format)
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone.trim()) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's exactly 10 digits
  if (cleaned.length !== 10) {
    return { isValid: false, error: 'Phone number must be exactly 10 digits' };
  }
  
  // Check if it starts with valid digits (6-9 for Indian mobile numbers)
  if (!/^[6-9]/.test(cleaned)) {
    return { isValid: false, error: 'Phone number must start with 6, 7, 8, or 9' };
  }
  
  return { isValid: true };
};

// Name validation
export const validateName = (name: string, fieldName: string = 'Name'): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters` };
  }
  
  if (name.trim().length > 100) {
    return { isValid: false, error: `${fieldName} must be less than 100 characters` };
  }
  
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return { isValid: false, error: `${fieldName} should only contain letters and spaces` };
  }
  
  return { isValid: true };
};

// Price validation
export const validatePrice = (price: string | number, min: number = 1, max: number = 100000): ValidationResult => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return { isValid: false, error: 'Please enter a valid price' };
  }
  
  if (numPrice < min) {
    return { isValid: false, error: `Price must be at least ₹${min}` };
  }
  
  if (numPrice > max) {
    return { isValid: false, error: `Price must be less than ₹${max}` };
  }
  
  return { isValid: true };
};

// Text field validation
export const validateTextField = (
  text: string,
  fieldName: string,
  minLength: number = 1,
  maxLength: number = 500
): ValidationResult => {
  if (!text.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (text.trim().length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }
  
  if (text.trim().length > maxLength) {
    return { isValid: false, error: `${fieldName} must be less than ${maxLength} characters` };
  }
  
  return { isValid: true };
};

// City/State validation (letters only)
export const validateLocation = (location: string, fieldName: string = 'Location'): ValidationResult => {
  if (!location.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (!/^[a-zA-Z\s]+$/.test(location)) {
    return { isValid: false, error: `${fieldName} should only contain letters` };
  }
  
  if (location.trim().length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters` };
  }
  
  return { isValid: true };
};

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  
  return phone;
};

// Clean phone number (remove formatting)
export const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};
