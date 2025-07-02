// Frontend validation utilities
export const validateForm = (data, rules) => {
  const errors = {};
  
  for (const field in rules) {
    const rule = rules[field];
    const value = data[field];
    
    // Required validation
    if (rule.required && (!value || value.toString().trim() === '')) {
      errors[field] = rule.messages?.required || `${field} is required`;
      continue;
    }
    
    // Skip other validations if field is empty and not required
    if (!value || value.toString().trim() === '') continue;
    
    // String length validation
    if (rule.minLength && value.length < rule.minLength) {
      errors[field] = rule.messages?.minLength || `${field} must be at least ${rule.minLength} characters`;
      continue;
    }
    
    if (rule.maxLength && value.length > rule.maxLength) {
      errors[field] = rule.messages?.maxLength || `${field} cannot exceed ${rule.maxLength} characters`;
      continue;
    }
    
    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.messages?.pattern || `${field} format is invalid`;
      continue;
    }
    
    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value, data);
      if (customError) {
        errors[field] = customError;
        continue;
      }
    }
    
    // Enum validation
    if (rule.enum && !rule.enum.includes(value)) {
      errors[field] = rule.messages?.enum || `${field} must be one of: ${rule.enum.join(', ')}`;
      continue;
    }
    
    // Date validation
    if (rule.type === 'date' && value) {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        errors[field] = rule.messages?.invalidDate || `${field} must be a valid date`;
        continue;
      }
      
      if (rule.minDate) {
        const minDate = rule.minDate === 'now' ? new Date() : new Date(rule.minDate);
        if (date < minDate) {
          errors[field] = rule.messages?.minDate || `${field} cannot be in the past`;
          continue;
        }
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validation rules for different forms
export const validationRules = {
  login: {
    username: {
      required: true,
      minLength: 3,
      maxLength: 30,
      pattern: /^[a-zA-Z0-9]+$/,
      messages: {
        required: 'Username is required',
        minLength: 'Username must be at least 3 characters long',
        maxLength: 'Username cannot exceed 30 characters',
        pattern: 'Username must contain only alphanumeric characters'
      }
    },
    password: {
      required: true,
      minLength: 6,
      maxLength: 100,
      messages: {
        required: 'Password is required',
        minLength: 'Password must be at least 6 characters long',
        maxLength: 'Password cannot exceed 100 characters'
      }
    },
    role: {
      required: true,
      enum: ['admin', 'viewer'],
      messages: {
        required: 'Role is required',
        enum: 'Role must be either admin or viewer'
      }
    }
  },
  
  project: {
    title: {
      required: true,
      minLength: 3,
      maxLength: 100,
      messages: {
        required: 'Title is required',
        minLength: 'Title must be at least 3 characters long',
        maxLength: 'Title cannot exceed 100 characters'
      }
    },
    description: {
      required: true,
      minLength: 10,
      maxLength: 1000,
      messages: {
        required: 'Description is required',
        minLength: 'Description must be at least 10 characters long',
        maxLength: 'Description cannot exceed 1000 characters'
      }
    },
    status: {
      required: true,
      enum: ['planning', 'in-progress', 'completed', 'on-hold'],
      messages: {
        required: 'Status is required',
        enum: 'Status must be one of: planning, in-progress, completed, on-hold'
      }
    },
    priority: {
      required: true,
      enum: ['low', 'medium', 'high', 'urgent'],
      messages: {
        required: 'Priority is required',
        enum: 'Priority must be one of: low, medium, high, urgent'
      }
    },
    dueDate: {
      type: 'date',
      minDate: 'now',
      messages: {
        invalidDate: 'Due date must be a valid date',
        minDate: 'Due date cannot be in the past'
      }
    }
  }
};

// Sanitize input data
export const sanitizeInput = (data) => {
  const sanitized = {};
  
  for (const key in data) {
    const value = data[key];
    
    if (typeof value === 'string') {
      // Trim whitespace and remove potentially harmful characters
      sanitized[key] = value.trim().replace(/[<>]/g, '');
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

// Format validation errors for display
export const formatValidationErrors = (errors) => {
  if (Array.isArray(errors)) {
    // Backend validation errors format
    return errors.reduce((acc, error) => {
      acc[error.field] = error.message;
      return acc;
    }, {});
  }
  
  // Frontend validation errors format
  return errors;
};