import * as Joi from 'joi';

export const ENV_VALIDATION_SCHEMA = Joi.object({
  DATASOURCE_USERNAME: Joi.required(),
  DATASOURCE_PASSWORD: Joi.required(),
  DATASOURCE_HOST: Joi.required(),
  DATASOURCE_PORT: Joi.number().required(),
  DATASOURCE_DATABASE: Joi.required(),
  DATASOURCE_URL: Joi.required(),
  JWT_ACCESS_SECRETE: Joi.required(),
  JWT_REFRESH_SECRET: Joi.required(),
  JWT_ACCESS_TTL: Joi.required(),
  JWT_REFRESH_TTL: Joi.required(),
  CLOUDINARY_NAME: Joi.required(),
  CLOUDINARY_API_KEY: Joi.number().required(),
  CLOUDINARY_API_SECRET: Joi.required(),
  CLOUDINARY_FOLDER_PRODUCTS: Joi.required(),
  CLOUDINARY_FOLDER_PROFILES: Joi.required(),
  GOOGLE_CLIENT_ID: Joi.required(),
  GOOGLE_CLIENT_SECRET: Joi.required(),
  GOOGLE__OAUTH_REDIRECT_URL: Joi.required(),
});
