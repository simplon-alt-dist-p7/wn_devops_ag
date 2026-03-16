import Joi from "joi";
import type { Request, Response, NextFunction } from "express";

const articleSchema = Joi.object({
  title: Joi.string().max(300).required(),
  subtitle: Joi.string().max(300).required(),
  summary: Joi.string().max(1000).required(),
  content: Joi.string().max(10000).required(),
  category: Joi.object({
    id: Joi.number().integer().positive().required(),
  }).required(),
});

const patchArticleSchema = articleSchema.fork(
  ["title", "subtitle", "summary", "content", "category"],
  (schema) => schema.optional(),
);

export const validateArticle = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = articleSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: "Données invalides",
      details: error.details.map((detail) => detail.message),
    });
  }
  next();
};

export const validatePatchArticle = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error, value } = patchArticleSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      message: "Données invalides",
      details: error.details.map((detail) => detail.message),
    });
  }

  req.body = value;
  next();
};
