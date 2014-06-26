/*** DayScrollview.js ***
 *  Wayland Woodruff
 *  WaylandWoodruff@gmail.com
 */

define(function(require, exports, module) {
  var ViewSequence        = require('famous/core/ViewSequence');
  var Scrollview          = require('famous/views/Scrollview');
  var InfiniteScrollview  = require('views/InfiniteScrollview');
  var Utilities           = require('utilities');
  
  var AppSettings = require('config/AppSettings');
  var DayView     = require('views/DayView');
  
  function DayScrollview() {
    InfiniteScrollview.apply(this, arguments);
    this.setOptions(DayScrollview.DEFAULT_OPTIONS);
    
    _setEventsUpdater.call(this);
    
    this.dayViews = [];
    this.viewSequence = new ViewSequence({
      array: this.dayViews,
      loop: true
    });
    this.sequenceFrom(this.viewSequence);
    
    _createDayViews.call(this);
    this.setToDate(this.options.startDate);
  }
  
  DayScrollview.DEFAULT_OPTIONS = {
    maxDayViews: 7,
    startDate: '2014-06-25',
    startTime: AppSettings.dayView.getStartTime()  //  time of day [hours, minutes] to be default start time
  };
  
  DayScrollview.prototype = Object.create(InfiniteScrollview.prototype);
  DayScrollview.prototype.constructor = DayScrollview;
  
  DayScrollview.prototype.setToDate = function setToDate(date, scrollToDate) {
    //  Called when a day is selected from the month view
    scrollToDate = (scrollToDate !== undefined) ? scrollToDate : false;
    
    if (!scrollToDate) {
      _resetDayViews.call(this, date);
      this.setPosition(1440 * _timeToPositionPercentage(this.options.startTime));
    } else {
      var currentIndex = this._node.getIndex();
    }
  }
  
  function _createDayViews() {
    for (var views = 0; views < this.options.maxDayViews; views++) {
      this.dayViews.push(new DayView({
        Scrollview: this
      }));
    }
  } //  End _createDayViews
  
  function _dateStrToArr(dateStr) {
    if (!dateStr) return;
    
    var result = [];
    result.push(+(dateStr.slice(0, 4)));
    result.push(+(dateStr.slice(5, 7)));
    result.push(+(dateStr.slice(8)));
    return result;
  } //  End _dateStrToArr
  
  function _dateArrToStr(dateArr) {
    if (!dateArr || !(dateArr instanceof Array)) return;
    
    var result = '';
    if (dateArr[0] > 999) result += dateArr[0] + '-';
    else if (dateArr[0] > 99) result += '0' + dateArr[0] + '-';
    else if (dateArr[0] > 9) result += '00' + dateArr[0] + '-';
    else if (dateArr[0] > -1) result += '000' + dateArr[0] + '-';
    else result += '0000' + '-';
    
    result += (dateArr[1] > 9) ? dateArr[1] + '-' : '0' + dateArr[1] + '-';
    result += (dateArr[2] > 9) ? dateArr[2] : '0' + dateArr[2];
    return result;
  } //  End _dateArrToStr
  
  function _resetDayViews(date) {
    var currentIndex  = this._node.getIndex();
    var array         = this.dayViews;
    this.dayViews[currentIndex].setDate(date);
    
    for (var i = 0; i < array.length; i++) {
      var targetIndex = ((currentIndex + i) < array.length) ? (currentIndex + i) : (currentIndex + i - array.length);
      var dateOffset  = (i < (Math.floor((array.length - 0.5) / 2) + 1)) ? i : (i - array.length);
      this.updateNodeBuffer(this.dayViews[targetIndex], this.dayViews[currentIndex], dateOffset);
    }
  } //  End _resetDayViews
  
  function _setEventsUpdater() {
    this.updateNodeBuffer = function updateNodeBuffer(target, current, offset) {
      var currentDate = current.getDate();
      currentDate = _dateStrToArr(currentDate);
      var targetDate = _offsetDate(currentDate, offset);  //  targetDate will be an array
      targetDate = _dateArrToStr(targetDate);
      target.setDate(targetDate);
      target.buildEvents(Utilities.getEvents(targetDate));
    };
  } //  End _setEventsUpdater
  
  function _offsetDate(date, offset) {
    if (!date) return null;
    
    var _31DayMonths = 5546;
    var offsetDate = [date[0], date[1], (date[2] + offset)];
    
    function isLeapYear(year) {
      return ((year % 400 === 0) || ((year % 100 !== 0) && (year % 4 === 0)));
    }
    
    function nextMonth() {
      var date = offsetDate.slice();
      date[1] = ((date[1] + 1) < 13) ? (date[1] + 1) : 1;
      if (date[1] === 1) date[0] += 1;
      date[2] = 1;
      
      return date;
    }
    
    function prevMonth() {
      var date = offsetDate.slice();
      date[1] = ((date[1] - 1) > 0) ? (date[1] - 1) : 12;
      if (date[1] === 12) date[0] -= 1;
      
      if ((1 << date[1]) & _31DayMonths) date[2] = 31;
      else if (date[1] === 2) date[2] = (isLeapYear(date[0])) ? 29 : 28;
      else date[2] = 30;
      
      return date;
    }
    
    if ((1 << date[1]) & _31DayMonths) {
      if (offsetDate[2] < 1) {
        return _offsetDate(prevMonth(), offsetDate[2]);
      } else if (offsetDate[2] > 31) {
        return _offsetDate(nextMonth(), (offsetDate[2] - 32));
      } else {
        return offsetDate;
      }
    } else if (date[1] === 2) {
      if (offsetDate[2] < 1) {
        return _offsetDate(prevMonth(), offsetDate[2]);
      } else {
        var maxDay = (isLeapYear(offsetDate[0])) ? 29 : 28;
        if (offsetDate[2] > maxDay) return _offsetDate(nextMonth(), (offsetDate[2] - maxDay - 1));
        else return offsetDate;
      }
    } else {
      if (offsetDate[2] < 1) {
        return _offsetDate(prevMonth(), offsetDate[2]);
      } else if (offsetDate[2] > 30) {
        return _offsetDate(nextMonth(), (offsetDate[2] - 31));
      } else {
        return offsetDate;
      }
    }
  } //  End _offsetDate
  
  function _timeToPositionPercentage(time) {
    //  Takes time as array: [hour, minutes] (military time)
    if (!time || !(time instanceof Array)) return null;
    
    return (time instanceof Array && time.length >= 2)
      ? (((time[0] * 60) + time[1]) / 1440)
      : null;
  } //  End _timeToPositionPercentage
  
  module.exports = DayScrollview;
});





















