const Joi = require('joi');

const trackEventSchema = Joi.object({
  event: Joi.string()
    .valid('page_view', 'signup', 'login', 'purchase', 'click', 'generic')
    .required(),
  user_id: Joi.string()
    .required(),
  session_id: Joi.string()
    .optional(),
  props: Joi.object()
    .optional()
    .default({})
});

const validateTrackEvent = (req, res, next) => {
  const { error, value } = trackEventSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => detail.message)
    });
  }
  
  req.validatedBody = value;
  next();
};

module.exports = {
  validateTrackEvent
};