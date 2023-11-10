const Account = require('./accounts-model');
const db = require('../../data/db-config');

exports.checkAccountPayload = (req, res, next) => {
  const { name, budget } = req.body;

  if (name === undefined || budget === undefined) {
    return res.status(400).json({ message: "name and budget are required" });
  }


  const trimmedName = name.trim();

  if (trimmedName.length < 3 || trimmedName.length > 100) {
    return res.status(400).json({
      message: "name of account must be between 3 and 100 characters"
    });
  }

  const parsedBudget = parseFloat(budget);
  if (isNaN(parsedBudget)) {
    return res.status(400).json({ message: "budget of account must be a number" });
  }

  if (parsedBudget < 0 || parsedBudget > 1000000) {
    return res.status(400).json({
      message: "budget of account is too large or too small"
    });
  }


  req.body.name = trimmedName;

  next();
};




exports.checkAccountNameUnique = async (req, res, next) => {
  try {
    const existing = await db('accounts')
    .where('name', req.body.name.trim())
    .first()

    if (existing) {
      res.status(400).json({
        message: 'that name is taken'
      })
    } else {
      next()
    }
  } catch (err) {
    next(err);
  }
}

exports.checkAccountId = async (req, res, next) => {
  try {
    const account = await Account.getById(req.params.id);
    if (!account) {
      res.status(404).json({
        message: 'account not found'
      })
    } else {
      req.account = account;
      next();
    }
  } catch (err) {
    next(err);
  }
}
