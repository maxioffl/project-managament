import Joi from 'joi';

// Validation middleware factory
export const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: errorDetails
      });
    }

    // Replace the original data with validated and sanitized data
    req[property] = value;
    next();
  };
};

// Auth validation schemas
export const authSchemas = {
  login: Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.alphanum': 'Username must contain only alphanumeric characters',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot exceed 30 characters',
        'any.required': 'Username is required'
      }),
    password: Joi.string()
      .min(6)
      .max(100)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password cannot exceed 100 characters',
        'any.required': 'Password is required'
      }),
    role: Joi.string()
      .valid('admin', 'viewer')
      .required()
      .messages({
        'any.only': 'Role must be either admin or viewer',
        'any.required': 'Role is required'
      })
  })
};

// Project validation schemas
export const projectSchemas = {
  create: Joi.object({
    title: Joi.string()
      .trim()
      .min(3)
      .max(100)
      .required()
      .messages({
        'string.min': 'Title must be at least 3 characters long',
        'string.max': 'Title cannot exceed 100 characters',
        'any.required': 'Title is required'
      }),
    description: Joi.string()
      .trim()
      .min(10)
      .max(1000)
      .required()
      .messages({
        'string.min': 'Description must be at least 10 characters long',
        'string.max': 'Description cannot exceed 1000 characters',
        'any.required': 'Description is required'
      }),
    status: Joi.string()
      .valid('planning', 'in-progress', 'completed', 'on-hold')
      .default('planning')
      .messages({
        'any.only': 'Status must be one of: planning, in-progress, completed, on-hold'
      }),
    priority: Joi.string()
      .valid('low', 'medium', 'high', 'urgent')
      .default('medium')
      .messages({
        'any.only': 'Priority must be one of: low, medium, high, urgent'
      }),
    dueDate: Joi.date()
      .min('now')
      .allow(null, '')
      .optional()
      .messages({
        'date.min': 'Due date cannot be in the past'
      })
  }),

  update: Joi.object({
    title: Joi.string()
      .trim()
      .min(3)
      .max(100)
      .required()
      .messages({
        'string.min': 'Title must be at least 3 characters long',
        'string.max': 'Title cannot exceed 100 characters',
        'any.required': 'Title is required'
      }),
    description: Joi.string()
      .trim()
      .min(10)
      .max(1000)
      .required()
      .messages({
        'string.min': 'Description must be at least 10 characters long',
        'string.max': 'Description cannot exceed 1000 characters',
        'any.required': 'Description is required'
      }),
    status: Joi.string()
      .valid('planning', 'in-progress', 'completed', 'on-hold')
      .required()
      .messages({
        'any.only': 'Status must be one of: planning, in-progress, completed, on-hold',
        'any.required': 'Status is required'
      }),
    priority: Joi.string()
      .valid('low', 'medium', 'high', 'urgent')
      .required()
      .messages({
        'any.only': 'Priority must be one of: low, medium, high, urgent',
        'any.required': 'Priority is required'
      }),
    dueDate: Joi.date()
      .allow(null, '')
      .optional()
      .messages({
        'date.base': 'Due date must be a valid date'
      })
  }),

  query: Joi.object({
    search: Joi.string()
      .trim()
      .max(100)
      .optional()
      .messages({
        'string.max': 'Search term cannot exceed 100 characters'
      }),
    status: Joi.string()
      .valid('planning', 'in-progress', 'completed', 'on-hold')
      .optional()
      .messages({
        'any.only': 'Status filter must be one of: planning, in-progress, completed, on-hold'
      }),
    priority: Joi.string()
      .valid('low', 'medium', 'high', 'urgent')
      .optional()
      .messages({
        'any.only': 'Priority filter must be one of: low, medium, high, urgent'
      })
  })
};

// Notification validation schemas
export const notificationSchemas = {
  markAsRead: Joi.object({
    id: Joi.string()
      .required()
      .messages({
        'any.required': 'Notification ID is required'
      })
  })
};