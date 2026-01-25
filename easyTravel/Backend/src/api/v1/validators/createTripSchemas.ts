import Joi from 'joi';

// Validation schema for AI trip creation request
export const createTripWithAISchema = Joi.object({
  tripDays: Joi.number().integer().min(1).max(30).required(),
  month: Joi.string().valid(
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ).required(),
  landingCity: Joi.string().min(2).max(100).required(),
  budget: Joi.string().valid('Low', 'Medium', 'High').required(),
  groupType: Joi.string().valid('Solo', 'Couple', 'Family').required(),
  interests: Joi.array().items(
    Joi.string().valid('Beaches', 'Hills', 'Culture', 'Ayurveda', 'Food', 'Adventure')
  ).min(1).required(),
});
