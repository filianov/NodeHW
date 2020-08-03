const Joi = require('@hapi/joi');

async function validateCreateContact(req, res, next) {
    try {
        const contactSchema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.string().required(),
            password: Joi.string().required(),
            token: Joi.string()
        })
        const result = contactSchema.validate(req.body);
        if (result.error) {
            res.status(400).send(result.error)
        }
        next()
    }
    catch (err) { console.log('err', err) };
};

async function validateUpdateContact(req, res, next) {
    try {
        const contactSchema = Joi.object({
            name: Joi.string(),
            email: Joi.string(),
            phone: Joi.string(),
            password: Joi.string(),
            token: Joi.string()
        }).min(1);
        const result = contactSchema.validate(req.body);
        if (result.error) {
            res.status(400).send(result.error)
        }
        next()
    }
    catch (err) { console.log('err', err) };
};

async function validateCreateUser(req, res, next) {
    try {
        const userSchema = Joi.object({

            email: Joi.string().required(),
            subscription: Joi.string(),
            password: Joi.string().required(),
            token: Joi.string()
        })
        const result = userSchema.validate(req.body);
        if (result.error) {
            res.status(400).send(result.error)
        }
        next()
    }
    catch (err) { console.log('err', err) };
};

async function validateLoginUser(req, res, next) {
    try {
        const userSchema = Joi.object({

            email: Joi.string().required(),
            password: Joi.string().required()
        })
        const result = userSchema.validate(req.body);
        if (result.error) {
            res.status(400).send(result.error)
        }
        next()
    }
    catch (err) { console.log('err', err) };
};

module.exports = {
    validateCreateContact,
    validateUpdateContact,
    validateCreateUser,
    validateLoginUser,
};
