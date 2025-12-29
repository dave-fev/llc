// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Phone number validation with country code (supports formats like +1-555-123-4567, +1 555 123 4567, +15551234567, etc.)
export const isValidPhoneWithCountryCode = (phone: string): boolean => {
  if (!phone || phone.trim() === '') return false;
  
  // Remove all spaces, dashes, parentheses, dots, and other formatting
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  
  // Must start with + followed by country code (1-3 digits) and then 7-15 digits
  // Examples: +1-555-123-4567, +44-20-1234-5678, +91-98765-43210
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  
  // Check if it matches the pattern and has valid length (10-16 digits total including country code)
  let isValid = phoneRegex.test(cleaned) && cleaned.length >= 10 && cleaned.length <= 16;
  
  // Also check if it's a valid US number without + (10 digits) - will be formatted to +1
  if (!isValid) {
    // Check for 10-digit US number (will be formatted to +1)
    if (cleaned.length === 10 && /^\d{10}$/.test(cleaned)) {
      isValid = true;
    }
    // Check for 11-digit number starting with 1 (US with country code)
    else if (cleaned.length === 11 && /^1\d{10}$/.test(cleaned)) {
      isValid = true;
    }
    // Check for formatted number like +1XXXXXXXXXX (12 chars)
    else if (cleaned.startsWith('+1') && cleaned.length === 12 && /^\+1\d{10}$/.test(cleaned)) {
      isValid = true;
    }
  }
  
  return isValid;
};

// Format phone number for display (adds country code if missing)
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // If it doesn't start with +, assume US number and add +1
  if (!cleaned.startsWith('+')) {
    const digits = cleaned.replace(/\D/g, '');
    if (digits.length === 10) {
      // Format as +1 (XXX) XXX-XXXX for display
      return `+1 (${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6, 10)}`;
    }
    // If it's 11 digits and starts with 1, format as US number
    if (digits.length === 11 && digits.startsWith('1')) {
      return `+1 (${digits.substring(1, 4)}) ${digits.substring(4, 7)}-${digits.substring(7, 11)}`;
    }
    return cleaned;
  }
  
  // If it starts with +, format it nicely if it's a US number (+1)
  if (cleaned.startsWith('+1') && cleaned.length === 12) {
    const digits = cleaned.substring(2);
    return `+1 (${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6, 10)}`;
  }
  
  return cleaned;
};

