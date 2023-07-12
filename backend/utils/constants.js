const { config } = require('dotenv');

const { NODE_ENV } = process.env;

if (NODE_ENV === 'production') {
  config();
}

const { CONFIDENTIAL_KEY = 'dev-secret' } = process.env;

// шаблон регулярного выражения
const emailPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

// статусы ошибок
const SUCCESS_CODE = 200;
const CREATED_CODE = 201;
const BAD_REQUEST_CODE = 400;
const NOT_FOUND_CODE = 404;
const INTERNAL_SERVER_ERROR = 500;

module.exports = {
  CONFIDENTIAL_KEY,
  emailPattern,
  SUCCESS_CODE,
  CREATED_CODE,
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  INTERNAL_SERVER_ERROR,
  NODE_ENV,
};
