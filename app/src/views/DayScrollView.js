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
  var TimeUtil    = require('util/TimeUtil');
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
  
  /**
   * @method setToDate
   * Forces the currently displayed DayView to change to the date specified.
   *
   * @param {string} date : A hyphen-delimited date in the format of "yyyy-mm-dd". This is the date
   *                        the DayView is being set to.
   * @param {boolean} scrollToDate : If false, the DayView is updated without transition (instant).
   *                                 If set to true, the DayScrollView will autoscroll to the date.
   *                                 Set this to true only if the DayView is visible when updated.
   */
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
      var now = TimeUtil.dateStrToArr(this.dayViews[currentIndex].getDate());
      if (!now) return;
      var then = TimeUtil.dateStrToArr(date);
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
  
  /**
   * @method getAutoscrollPosition
   * Used to autoscroll the DayViews when setToDate is invoked with true passed in as a second argument.
   * This function is passed to DayScrollview._scroller.positionFrom() to make the scroll happen. After
   * the scroll completes, the default getter function should be reset using positionFrom.
   *
   * @return {number} The position to scroll to
   */
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
  
  /**
   * @method _createDayViews
   * Generates blank DayViews and pushes them to this.dayViews (7 DayViews by default). The DayScrollview
   * instance is passed as an option to the DayView so that nested surfaces can pipe events to it when they
   * are instantiated.
   */
  function _createDayViews() {
    for (var views = 0; views < this.options.maxDayViews; views++) {
      this.dayViews.push(new DayView({
        Scrollview: this
      }));
    }
  } //  End _createDayViews
  
  /**@method _resetDayViews
   * 
   * Forces instant update of all DayViews in DayScrollview's sequence. Date supplied
   * applies to current DayView on screen; all other DayViews are updated to prior
   * and subsequent dates in sequence.
   *
   * @param {string} date : A date in the format "yyyy-mm-dd"
   */
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
  
  /**@method _setEventsUpdater
   * 
   * DayScrollview is an extension of an InfiniteScrollview, which is extended from
   * the Scrollview. The InfiniteScrollview requires its data member called updateNodeBuffer
   * to be assigned a function which takes three arguments and updates the content
   * of a specified sequence element (in this case, updating a specific DayView).
   * updateNodeBuffer is called every time cycling through the DayScrollview changes
   * the current element.
   */
  function _setEventsUpdater() {
    this.updateNodeBuffer = function updateNodeBuffer(target, current, offset) {
      var currentDate = current.getDate();
      currentDate = TimeUtil.dateStrToArr(currentDate);
      var targetDate = TimeUtil.findOffsetDate(currentDate, offset);  //  targetDate will be an array
      targetDate = TimeUtil.dateArrToStr(targetDate);
      target.setDate(targetDate);
      target.buildEvents(Utilities.getEvents(targetDate));
    };
  } //  End _setEventsUpdater
  
  /**@method timeDiffMin
   * 
   * Calculates the total number of minutes between two specified date and times.
   * The time of each day is determined by the position of the current DayView and
   * the default position of a dayview.
   *
   * @param {array} target : A three-index array in format [year, month, day] representing
   *                         the date offset from the current DayView.
   * @param {array} current : A three-index array in format [year, month, day]
   *                          representing the current DayView's date.
   * @param {array} targetTime : A tuple array in format [hour, minute] marking
   *                             the target date's time.
   * @param {array} currentTime : A tuple array in format [hour, minute] marking
   *                              the current date's time.
   * @return {number} The total number of minutes between the two specified dates.
   *                  If negative, target's date precedes current date. Otherwise,
   *                  the current date precedes the target.
   */
  function _timeDiffMin(target, current, targetTime, currentTime) {
    targetPos = (typeof targetPos === 'number') ? targetPos : 0;
    currentPos = (typeof currentPos === 'number') ? currentPos : 0;
    
    if ((target[0] === current[0])
       && (target[1] === current[1]) 
       && (target[2] === current[2])) {
      return (((targetTime[0] * 60) + targetTime[1]) - ((currentTime[0] * 60) + currentTime[1]));
    }
    
    var isTargetAfter = (((target[0] * 10000) + (target[1] * 100) + target[2]) > ((current[0] * 10000) + (current[1] * 100) + current[2]));
    var result = TimeUtil.timeDiffDays(target, current) * 1440; /////////////////////////////////////////////////////////////////////////////////<=- FIX
    result = (isTargetAfter) 
      ? (result + (1440 - this.getPosition()) + ((targetTime[0] * 60) + targetTime[1])) 
      : (-result - this.getPosition() - (1440 - ((targetTime[0] * 60) + targetTime[1])));
    
    return result;
  } //  End _timeDiffMin
  
  /**
   * Description
   * @method Name
   *
   * @param {type} paramIdent description
   * @return {type} description
   */
  function _timeToPositionPercentage(time) {
    //  Takes time as array: [hour, minutes] (military time)
    if (!time || !(time instanceof Array)) return null;
    
    return (time instanceof Array && time.length >= 2)
      ? (((time[0] * 60) + time[1]) / 1440)
      : null;
  } //  End _timeToPositionPercentage
  
  module.exports = DayScrollview;
});





















