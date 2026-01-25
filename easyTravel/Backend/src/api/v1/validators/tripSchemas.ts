import Joi from 'joi';

export const createTripSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required(),
  days: Joi.array().items(
    Joi.object({
      date: Joi.date().iso().required(),
      places: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          location: Joi.object({
            type: Joi.string().valid('Point').required(),
            coordinates: Joi.array().items(Joi.number()).length(2).required()
          }).required(),
          type: Joi.string().optional(),
          notes: Joi.string().optional(),
          aiRecommendation: Joi.boolean().optional()
        })
      ).required(),
      notes: Joi.string().optional()
    })
  ).required()
});

export const updateTripSchema = createTripSchema;
