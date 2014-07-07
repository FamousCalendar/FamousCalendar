/*** DayScrollview.js ***
 *  Wayland Woodruff
 *  WaylandWoodruff@gmail.com
 */

define(function(require, exports, module) {
  var Transform       = require('famous/core/Transform');
  var ViewSequence    = require('famous/core/ViewSequence');
  var Easing          = require('famous/transitions/Easing');
  var Transitionable  = require('famous/transitions/Transitionable');
  var Scrollview      = require('famous/views/Scrollview');
  
  var AppSettings         = require('config/AppSettings');
  var Utilities           = require('utilities');
  var TimeUtil            = require('util/TimeUtil');
  var DayView             = require('views/DayView');
  var InfiniteScrollview  = require('views/InfiniteScrollview');
  
  function DayScrollview() {
    InfiniteScrollview.apply(this, arguments);
    this.setOptions(DayScrollview.DEFAULT_OPTIONS);
    
    _setEventsUpdater.call(this);
    _setNodeChangeEmitter.call(this);
    
    this.dayViews = [];
    this.viewSequence = new ViewSequence({
      array: this.dayViews,
      loop: true
    });
    this.sequenceFrom(this.viewSequence);
    this._autoscroll = {
      active: false,        //  limits events based on DayView transitions
      complete: true,
      minDiff: 0            //  The distance in pixels to autoscroll
    };
    
    _createDayViews.call(this);
    this.setToDate(this.options.startDate);
  }
  
  /** @const */
  var TOLERANCE = 0.5;
  
  DayScrollview.DEFAULT_OPTIONS = {
    maxDayViews: 7,
    startDate: '2014-06-25',
    startTime: AppSettings.dayView.getStartTime()  //  time of day [hours, minutes] to be default start time
  };
  
  DayScrollview.prototype = Object.create(InfiniteScrollview.prototype);
  DayScrollview.prototype.constructor = DayScrollview;
  
  /** @method resetDay
   * 
   * Called by AppView when an event is deleted. Forces a single DayView to
   * be rerendered after an event has been removed from the event data store.
   * 
   * @param {string/array} date : A date string ('yyyy-mm-dd') or array ([year, month, day])
   */
  DayScrollview.prototype.resetDay = function resetDay() {
    var currentPos = this.getPosition();
    var currentDay = this.dayViews[this._node.getIndex()];
    _resetDayViews.call(this, currentDay.getDate(), currentDay.getWeekday());
    this.setPosition(currentPos);
  };  //  End DayScrollview.prototype.resetDay
  
  /**@method setToDate
   * 
   * Forces the currently displayed DayView to change to the date specified.
   * TODO: Implement input verification to support receiving data array.
   * 
   * @param {string} date : A hyphen-delimited date in the format of "yyyy-mm-dd". This is the date
   *                        the DayView is being set to.
   * @param {boolean} scrollToDate : If false, the DayView is updated without transition (instant).
   *                                 If set to true, the DayScrollView will autoscroll to the date.
   *                                 Set this to true only if the DayView is visible when updated.
   */
  DayScrollview.prototype.setToDate = function setToDate(date, weekday, scrollToDate) {
    scrollToDate = (scrollToDate !== undefined) ? scrollToDate : false;
    
    if (!scrollToDate) {
      _resetDayViews.call(this, date, weekday);
      this.setPosition(1440 * TimeUtil.timeToPositionPercentage(this.options.startTime));
    } else {
      var currentIndex = this._node.getIndex();
      var now = []; //  The current time
      now.push(TimeUtil.dateStrToArr(this.dayViews[currentIndex].getDate()));
      now.push(TimeUtil.calcTimeArr(this.getPosition()));
      if (!now[0] || !now[1]) return;
      var then = [];    //  The time we want to transition to
      then.push(TimeUtil.dateStrToArr(date));
      then.push(this.options.startTime);
      if (!then[0] || !then[1]) return;
      
      this._autoscroll.active = true;
      this._autoscroll.minDiff = TimeUtil.timeToPixels(now[1]) + TimeUtil.timeDiffMin.call(this, then[0], now[0], then[1], now[1]); //  Negative value means target time is before current time
      var transitioner = new Transitionable(this.getPosition());
      this._scroller.positionFrom(transitioner);
      transitioner.set(this._autoscroll.minDiff, {duration: 750, curve: Easing.outCubic}, function() {
        this._autoscroll.minDiff = 0;
        this.setPosition(transitioner.get());
        this._scroller.positionFrom(this.getPosition.bind(this));
      }.bind(this));
    }
  }
  
  /**@method _createDayViews
   * 
   * Generates blank DayViews and pushes them to this.dayViews (7 DayViews by default). The DayScrollview
   * instance is passed as an option to the DayView so that nested surfaces can pipe events to it when they
   * are instantiated.
   */
  function _createDayViews() {
    for (var views = 0; views < this.options.maxDayViews; views++) {
      this.dayViews.push(new DayView({
        scrollView: this
      }));
      this._eventInput.subscribe(this.dayViews[views]._eventOutput);
    }
    this._eventInput.on('showDetails', function(eventView) {
      this._eventOutput.emit('showDetails', eventView);
    }.bind(this));
  } //  End _createDayViews
  
  /**@method _resetDayViews
   * 
   * Forces instant update of all DayViews in DayScrollview's sequence. Date supplied
   * applies to current DayView on screen; all other DayViews are updated to prior
   * and subsequent dates in sequence.
   *
   * @param {string} date : A date in the format "yyyy-mm-dd"
   * @param {number} weekday : A number between 0-6 representing a day of the week (0 = sunday)
   */
  function _resetDayViews(date, weekday) {
    var currentIndex  = this._node.getIndex();
    var array         = this.dayViews;
    this.dayViews[currentIndex].setDate(date);
    this.dayViews[currentIndex].setWeekday(weekday);
    
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
      var currentDay = current.getWeekday();
      currentDate = TimeUtil.dateStrToArr(currentDate);
      
      var targetDate = TimeUtil.findOffsetDate(currentDate, offset);  //  targetDate will be an array
      targetDate = TimeUtil.dateArrToStr(targetDate);
      var targetDay = currentDay + offset;
      if (targetDay < 0) targetDay += 7;
      if (targetDay > 6) targetDay -= 7;
      
      target.setDate(targetDate);
      target.setWeekday(targetDay);
      target.buildEvents(Utilities.getEvents(targetDate));
    };
  } //  End _setEventsUpdater
  
  /**@method _setNodeChangeEmitter
   * 
   * Sets the effects for when the user scrolls to a new node.
   */
  function _setNodeChangeEmitter() {
    this.emitNodeChange = function _emitNodeChange(direction) {
      if (!this._autoscroll.active) {
        var date = this.dayViews[this._node.getIndex()].getDate();
        this._eventOutput.emit('nodeChange', direction, date);
      }
      var position = this.getPosition();
      if (position >= 0 && position < 1440) this._autoscroll.active = false;
    };
  } //  End _setNodeChangeEmitter
  
  module.exports = DayScrollview;
});





















