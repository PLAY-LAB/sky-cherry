var Question = require('../models/question.model');

/**
 * Get question list.
 * @property {number} req.query.skip - Number of questions to be skipped.
 * @property {number} req.query.limit - Limit number of questions to be returned.
 * @property {string} req.query.createdBy - filter of questions to be returned.
 * @returns {Question[]}
 */
function list(req, res, next) {
    const { limit = 50, skip = 0, q = {}} = req.query;
    if(req.query.createdBy) {
      q.createdBy = req.query.createdBy
    }
    Question.list({ limit, skip, q })
      .then(questions => res.json(questions))
      .catch(e => next(e));
  }
  
  /**
   * Create new question
   * @property {string} req.body.title
   * @property {string} req.body.description
   * @property {string} req.body.mainField
   * @property {string} req.body.subField
   * @property {ObjectId} req.body.createdBy
   * @property {Answer[]} req.body.answers
   * @property {like[]} req.body.likes
   * @property {string} req.body.occupation
   * @property {string} req.body.familyType
   * @property {string} req.body.interest
   * @property {string} req.body.monthlyIncome
   * @property {string} req.body.assets
   * @property {string} req.body.incomeManagement
   * @property {string[]} req.body.tags
   * @returns {Question}
   */
  function create(req, res, next) {
    const question = new Question({
      title: req.body.title,
      description: req.body.description,
      mainField: req.body.mainField,
      subField: req.body.subField,
      createdAt: Date.now(),
      createdBy: req.decoded._id,
      answers: req.body.answers,
      likes: req.body.likes,
      occupation: req.body.occupation,
      familyType: req.body.familyType,
      interest: req.body.interest,
      monthlyIncome: req.body.monthlyIncome,
      assets: req.body.assets,
      incomeManagement: req.body.incomeManagement,
      tags: req.body.tags
    });
  
    question.save()
      .then(savedQuestion => {
        req.savedQuestion = savedQuestion;
        next();
      })
      .catch(e => next(e));
  }
  
  /**
   * Load question and append to req.
   */
  function load(req, res, next, questionId) {
    Question.get(questionId)
      .then((question) => {
        req.question = question;
        return next()
      }) 
      .catch(e => next(e));
  }
  
  /**
   * Get question
   * @returns {question}
   */
  function get(req, res) {
    return res.json(req.question);
  }

module.exports = { list, create, load, get };