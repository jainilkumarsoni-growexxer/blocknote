export const validateCreateDocument = (req, res, next) => {
  const { title } = req.body;
  
  if (title !== undefined && (typeof title !== 'string' || title.length > 255)) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors: ['Title must be a string with max 255 characters'] 
    });
  }
  
  next();
};


export const validateUpdateDocument = (req, res, next) => {
  const { title, is_public } = req.body;
  const errors = [];

  if (title !== undefined && (typeof title !== 'string' || title.length > 255)) {
    errors.push('Title must be a string with max 255 characters');
  }
  if (is_public !== undefined && typeof is_public !== 'boolean') {
    errors.push('is_public must be a boolean');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  next();
};