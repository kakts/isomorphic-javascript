'use strict';

const moment = require('moment');

const formatDate = function(date) {
  return moment(date).format('MMMM Do YYYY, h:mm:ss a');
}
module.exports = formatDate;
