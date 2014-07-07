define(function(require, exports, module) {
  var data = {};

  data.monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  data.daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  data.generateDateString = function(year, month, day) {
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    return year + '-' + month + '-' + day;
  };

  data.toFormattedDateString = function(year, month, day, weekDay) {
    return this.daysOfWeek[weekDay] + ' ' + this.monthNames[month] + ' ' + day + ', ' + year;
  };

  module.exports = data;
});