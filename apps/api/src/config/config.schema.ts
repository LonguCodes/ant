import * as Joi from 'joi';
export const configSchema = Joi.object({
  DATABASE__PASSWORD: Joi.string().required(),
  DATABASE__USERNAME: Joi.string().required(),
  DATABASE__DATABASE: Joi.string().required(),
  DATABASE__HOST: Joi.string().required(),
  DATABASE__PORT: Joi.string().default(5432),
  DATABASE__MIGRATIONS_RUN: Joi.boolean().default(false),
});
