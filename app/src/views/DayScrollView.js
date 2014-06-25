/*** DayScrollview.js ***
 *  Wayland Woodruff
 *  WaylandWoodruff@gmail.com
 */

define(function(require, exports, module) {
  var ViewSequence        = require('famous/core/ViewSequence');
  var Scrollview          = require('famous/views/Scrollview');
  var InfiniteScrollview  = require('views/InfiniteScrollview');
  
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
  }
  
  DayScrollview.DEFAULT_OPTIONS = {
    maxDayViews: 7,
    startTime: AppSettings.dayView.getStartTime()  //  time of day [hours, minutes] to be default start time
  };
  
  DayScrollview.prototype = Object.create(InfiniteScrollview.prototype);
  DayScrollview.prototype.constructor = DayScrollview;
  
  DayScrollview.prototype.setToStartPosition = function setToStartPosition(date, scrollToDate) {
    //  Called when a day is selected from the month view
    scrollToDate = (scrollToDate !== undefined) ? scrollToDate : false;
    if (scrollToDate) {
      //  scroll to date supplied, end scroll at default time for that date
    } else if (date) {    //  loads events for the supplied date to the current DayView.
    //  Determine the current DayView
    //    Load events for 'date' on this DayView
    //    Load events for adjacent dates on adjacent DayViews
    //    
    //  Then set scroller to default position on current DayView
    }
    this.setPosition(((this.dayViews[0].getSize())[1] * _timeToPositionPercentage(this.options.startPosition)));
  }
  
  function _createDayViews() {
    for (var views = 0; views < this.options.maxDayViews; views++) {
      this.dayViews.push(new DayView({
        Scrollview: this
      }));
      
      if (views < 4) {
        this.dayViews[views].buildEvents(views);
      } else {
        this.dayViews[views].buildEvents(views - 7);
      }
    }
  }
  
  function _setEventsUpdater() {
    this.updateNodeBuffer = function updateNodeBuffer(target, current, offset) {
      target.buildEvents(current._date + offset);
    };
  } //  End _setEventsUpdater
  
  function _timeToPositionPercentage(time) {
    //  Takes time as array: [hour, minutes] (military time)
    return (time instanceof Array && time.length >= 2)
      ? (((time[0] * 60) + time[1]) / 1440)
      : null;
  } //  End _timeToPositionPercentage
  
  module.exports = DayScrollview;
});
