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
    
    this.dayViews = [];
    this.viewSequence = new ViewSequence({
      array: this.dayViews,
      loop: true
    });
    this.sequenceFrom(this.viewSequence);
    this._autoscroll = {};
    
    _createDayViews.call(this);
    this.setToDate(this.options.startDate);
    
    window.ascroll = function(val) {
      this.setToDate( val, true );
    }.bind(this);
    
    window.gettime = function() {
      console.log('Position:', this.getPosition());
      console.log('Day:', this.dayViews[this._node.getIndex()].getDate());
    }.bind(this);
    
  }
  
  /** @const */
  var TOLERANCE = 0.5;
  
  DayScrollview.DEFAULT_OPTIONS = {
    maxDayViews: 7,
    startDate: '2014-06-25',
    startTime: AppSettings.dayView.getStartTime()  //  time of day [hours, minutes] to be default start time
  };
  
  /**@positionFrom() Transforms**/
  var POSITION_TRANSFORM = {
    'default': _default,
    'autoscroll': _autoScroller
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
  DayScrollview.prototype.resetDay = function resetDay(date) {
    if (!date) return;
    else if (date instanceof Array && date.length === 3) date = TimeUtil.dateArrToStr(date);
    var currentIdx = this._node.getIndex();
    var loop = false;
    
    for (var i = currentIdx; i !== currentIdx && loop !== true; i++) {
      if (i >= this.dayViews.lenth) i = 0;
      loop = true;
      if (date === this.dayViews[i].getDate()) {
        this.dayViews[i].buildEvents(Utilities.getEvents(date));
        break;
      }
    }
  };  //  End DayScrollview.prototype.resetDay
  
  /**@method setToDate
   * 
   * Forces the currently displayed DayView to change to the date specified.
   *
   * @param {string} date : A hyphen-delimited date in the format of "yyyy-mm-dd". This is the date
   *                        the DayView is being set to.
   * @param {boolean} scrollToDate : If false, the DayView is updated without transition (instant).
   *                                 If set to true, the DayScrollView will autoscroll to the date.
   *                                 Set this to true only if the DayView is visible when updated.
   */
  DayScrollview.prototype.setToDate = function setToDate(date, scrollToDate) {
    scrollToDate = (scrollToDate !== undefined) ? scrollToDate : false;
    
    if (!scrollToDate) {
      _resetDayViews.call(this, date);
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
      
      this._autoscroll.minDiff = TimeUtil.timeToPixels(then[1]) + TimeUtil.timeDiffMin.call(this, then[0], now[0], then[1], now[1]); //  Negative value means target time is before current time
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
        Scrollview: this
      }));
      this._eventInput.subscribe(this.dayViews[views]._eventOutput);
      this._eventInput.on('showDetails', function(eventView) {
        this._eventOutput.emit('showDetails', eventView);
      }.bind(this));
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
  
  module.exports = DayScrollview;
});





















