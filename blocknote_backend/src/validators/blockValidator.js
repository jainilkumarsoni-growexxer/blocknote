export const validateCreateBlock = (req, res, next) => {
  const { type, order_index } = req.body;
  const errors = [];

  if (!type) errors.push('Type is required');
  if (order_index === undefined) errors.push('order_index is required');

  const validTypes = ['paragraph', 'heading_1', 'heading_2', 'todo', 'code', 'divider', 'image'];
  if (type && !validTypes.includes(type)) {
    errors.push(`Invalid block type. Must be one of: ${validTypes.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  next();
};


export const validateBatchUpdate = (req, res, next) => {
  const { blocks, version } = req.body;
  if (!Array.isArray(blocks)) {
    return res.status(400).json({ message: 'blocks must be an array' });
  }
  if (version === undefined) {
    return res.status(400).json({ message: 'version is required' });
  }
  next();
};