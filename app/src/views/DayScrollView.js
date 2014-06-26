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
    this._autoscroll = {};
    
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
    ///////////////////////////////////////////////////////////////////////////////////////////////
      _resetDayViews.call(this, date);
      this.setPosition(1440 * _timeToPositionPercentage(this.options.startTime));
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    /*
    if (!scrollToDate) {
      _resetDayViews.call(this, date);
      this.setPosition(1440 * _timeToPositionPercentage(this.options.startTime));
    } else {
      var currentIndex = this._node.getIndex();
      var now = _dateStrToArr(this.dayViews[currentIndex].getDate());
      if (!now) return;
      var then = _dateStrToArr(date);
      if (!then) return;
      
      //debugger;
      this._autoscroll.minDiff = _timeDiffMin.call(this, now, then); //  Negative value means target time is before current time
      
      //  Set new getPosition function with this._scroller.positionFrom()
      this._scroller.positionFrom(this.getAutoscrollPosition.bind(this));
      //compare target date to current date
      //  Calculate difference in time between target date at start position ([8,0]) and current position on current date
      //  transform scrollview particle by this difference
    }
    */
  }
  
  DayScrollview.prototype.getAutoscrollPosition = function getAutoscrollPosition() {
    var distance  = this._autoscroll.minDiff;
    
    if (distance < 0) {
      if (distance < -100) {
        this._autoscroll.minDiff += 100;
        return this.getPosition() - 100;
      } else {
        this._autoscroll.minDiff = 0;
        this._scroller.positionFrom(this.getPosition.bind(this));
        return this.getPosition() - distance;
      }
    } else {
      if (distance > 100) {
        this._autoscroll.minDiff -= 100;
        return this.getPosition() + 100;
      } else {
        this._autoscroll.minDiff = 0;
        this._scroller.positionFrom(this.getPosition.bind(this));
        return this.getPosition() + distance;
      }
    }
    
    //return this._particle.getPosition1D();
  };  //  End DayScrollview.prototype.getAutoscrollPosition
  
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
  
  function _isLeapYear(year) {
    return ((year % 400 === 0) || ((year % 100 !== 0) && (year % 4 === 0)));
  }
  
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
      else if (date[1] === 2) date[2] = (_isLeapYear(date[0])) ? 29 : 28;
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
        var maxDay = (_isLeapYear(offsetDate[0])) ? 29 : 28;
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
  
  function _timeDiffDays(target, current) {
    var _31DayMonths = 5546;
    
    function daysFromBeginMonth(date) {
      return date[2] - 1;
    }
    
    function daysFromEndMonth(date) {
      if ((1 << date[1]) && _31DayMonths) return 31 - date[2];
      else if (date[1] === 2) return (_isLeapYear(date[0])) ? 29 - date[2] : 28 - date[2];
      else return 30 - date[2];
    }
    
    function daysBetweenMonths(earlyMonth, laterMonth) {
      var days = 0;
      
      for (var m = earlyMonth; m <= laterMonth; m++) {
        if ((1 << m) && _31DayMonths) days += 31;
        else if (m === 2) days += (_isLeapYear(date[0])) ? 29 : 28;
        else days += 30;
      }
      return days;
    }
    
    function daysFromBeginYear(date) {
      var days = 0;
      for (var m = 1; m < date[1]; m++) {
        if ((1 << m) && _31DayMonths) days += 31;
        else if (m === 2) days += (_isLeapYear(date[0])) ? 29 : 28;
        else days += 30;
      }
      days += daysFromBeginMonth(date);
      return days;
    }
    
    function daysFromEndYear(date) {
      var days = 0;
      for (var m = 12; m > date[1]; m--) {
        if ((1 << m) && _31DayMonths) days += 31;
        else if (m === 2) days += (_isLeapYear(date[0])) ? 29 : 28;
        else days += 30;
      }
      days += daysFromEndMonth(date);
      return days;
    }
    
    function daysBetweenYears(earlyYear, laterYear) {
      var days = 0;
      for (var y = earlyYear; y <= laterYear; y++) {
        days += (_isLeapYear(y)) ? 366 : 365;
      }
      return days;
    }
    
    var days = 0;
    if (target[0] === current[0]) {     //  Same year
      if (target[1] === current[1]) {   //  Same month
        days = target[2] - current[2];
        if (days === 0) return 0;
        else if (days > 0) return days - 1;
        else return days + 1;
      } else if (target[1] > current[1]) {  //  target month after current month
        days = daysBetweenMonths((current[1] + 1), (target[1] - 1));
        days += daysFromBeginMonth(target);
        days += daysFromEndMonth(current);
        return days;
      } else {      //  target month before current month
        days = daysBetweenMonths((target[1] + 1), (current[1] - 1));
        days += daysFromEndMonth(target);
        days += daysFromBeginMonth(current);
        return -days;
      }
    } else if (target[0] > current[0]) {  //  target year after current year
      days = daysBetweenYears((current[0] + 1), (target[0] - 1));
      days += daysFromBeginYear(target);
      days += daysFromEndYear(current);
      return days;
    } else {          //  target year before current year
      days = daysBetweenYears((target[0] + 1), (current[0] - 1));
      days += daysFromEndYear(target);
      days += daysFromBeginYear(current);
      return -days;
    }
  } //  End _timeDiffDays
  
  function _timeDiffMin(target, current) {
    ///////////////////////////////////////////// TODO: Convert this.getPosition() return value into minutes; this currently assumes 1 minute:1 pixel ratio
    if (!this.getPosition) return;
    
    var startTime = AppSettings.dayView.getStartTime()
    if ((target[0] === current[0])
       && (target[1] === current[1]) 
       && (target[2] === current[2])) {
      return (((startTime[0] * 60) + startTime[1]) - this.getPosition());
    }
    
    var isTargetAfter = (((target[0] * 10000) + (target[1] * 100) + target[2]) > ((current[0] * 10000) + (current[1] * 100) + current[2]));
    var result = _timeDiffDays(target, current) * 1440;
    result = (isTargetAfter) 
      ? (result + (1440 - this.getPosition()) + ((startTime[0] * 60) + startTime[1])) 
      : (-result - this.getPosition() - (1440 - ((startTime[0] * 60) + startTime[1])));
    
    return result;
  } //  End _timeDiffMin
  
  function _timeToPositionPercentage(time) {
    //  Takes time as array: [hour, minutes] (military time)
    if (!time || !(time instanceof Array)) return null;
    
    return (time instanceof Array && time.length >= 2)
      ? (((time[0] * 60) + time[1]) / 1440)
      : null;
  } //  End _timeToPositionPercentage
  
  module.exports = DayScrollview;
});





















