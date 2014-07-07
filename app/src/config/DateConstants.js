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

  data.calcNextMonth = function(month, year) {
    var nextMonth;
    if (month === 11) {
      nextMonth = { month: 0, year: year + 1 };
    } else {
      nextMonth = { month: month + 1, year: year };
    }

    return nextMonth;
  };

  data.calcPreviousMonth = function(month, year) {
    var priorMonth;
    if (month === 0) {
      priorMonth = { month: 11, year: year - 1 };
    } else {
      priorMonth = { month: month - 1, year: year };
    }

    return priorMonth;
  };

  data.getPreviousDate = function(dateObj) {
    var date = {};
    var previousMonthYear;

    if (dateObj.day === 1) {
      previousMonthYear = this.calcPreviousMonth(dateObj.month, dateObj.year);
      date.year = previousMonthYear.year;
      date.month = previousMonthYear.month;
      date.day = new Date(date.year, date.month + 1, 0).getDate();
      date.weekDay = (dateObj.weekDay + 6) % 7;
    } else {
      date.year = dateObj.year;
      date.month = dateObj.month;
      date.day = dateObj.day - 1;
      date.weekDay = (dateObj.weekDay + 6) % 7;
    }

    return date;
  };

  data.getNextDate = function(dateObj) {
    var date = {};
    var nextMonthYear;
    var daysInMonth = new Date(dateObj.year, dateObj.month + 1, 0).getDate();

    if (dateObj.day === daysInMonth) {
      nextMonthYear = this.calcNextMonth(dateObj.month, dateObj.year);
      date.year = nextMonthYear.year;
      date.month = nextMonthYear.month;
      date.day = 1;
      date.week = 1;
      date.weekDay = (dateObj.weekDay + 1) % 7;
    } else {
      date.year = dateObj.year;
      date.month = dateObj.month;
      date.day = dateObj.day + 1;
      date.weekDay = (dateObj.weekDay + 1) % 7;
    }

    return date;
  };

  module.exports = data;
});