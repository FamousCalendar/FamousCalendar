/*** DayView.js ***
 *  Wayland Woodruff
 *  WaylandWoodruff@gmail.com
 */
 
define(function(require, exports, module) {
  //  Dependencies
  var RenderNode    = require('famous/core/RenderNode');
  var Surface       = require('famous/core/Surface');
  var View          = require('famous/core/View');
  var StateModifier = require('famous/modifiers/StateModifier');
  var Transform     = require('famous/core/Transform');
  
  var AppSettings     = require('config/AppSettings');
  var DayViewSettings = AppSettings.dayView;
  var TimeUtil        = require('util/TimeUtil');
  var TimelineView    = require('views/TimelineView');
  var EventView       = require('views/EventView');
  
  function DayView() {
    View.apply(this, arguments);
    
    this._date        = null;
    this._eventsNode  = new RenderNode();
    this.add(this._eventsNode);
    
    _createTimeline.call(this);
    _createBackground.call(this);
  }
  
  DayView.DEFAULT_OPTIONS = {
    scrollView: null,
    sizeY: ((1440 / AppSettings.time.getTimeUnits()) * AppSettings.timelineView.getNotchSpacing()),
    startTime: AppSettings.dayView.getStartTime()
  };
  
  //  Prototype Functions
  DayView.prototype = Object.create(View.prototype);
  DayView.prototype.constructor = DayView;
  
  /**@method buildEvents
   * 
   * Removes any existing events from the DayView, then instantiates an entirely
   * new set of events based on the date currently assigned to the DayView. This
   * function is typically called either when being looped from one end of the
   * sequence to the other on a scroll action or when a day is selected from the
   * full-screen MonthView.
   *
   * @param {array} events : An array of objects, each object being a set of EventView
   *                         options which are supplied to the EventView constructor.
   */
  DayView.prototype.buildEvents = function buildEvents(events) {
    if (!events || !(events instanceof Array)) events = [];
    if (events[0] === undefined) events = [];
    
    //_clearEvents.call(this);  //  Reference for future implementation
    this._eventsNode._child = null;
    this._eventsNode._hasMultipleChildren = false;
    
    for (var i = 0; i < events.length; i++) {
      var eventNode = new RenderNode();
      
      var start     = TimeUtil.timeStrToArr(events[i].start);
      var end       = TimeUtil.timeStrToArr(events[i].end);
      var duration  = ((end[0] * 60) + end[1]) - ((start[0] * 60) + start[1]);  //  TODO: Fix; currently assumes 1 minute:1 pixel ratio
      var posY      = TimeUtil.timeToPixels(start);
      
      var eventModifier = new StateModifier({
        origin: [0, 0],
        align: [0, 0],
        size: [undefined, duration],
        transform: Transform.translate(0, posY, 0)
      });
      
      var event = new EventView(events[i]);
      event.eventSurface.pipe(this.options.scrollView);
      
      eventNode.add(eventModifier).add(event);
      this._eventsNode.add(eventNode);
      this._eventInput.subscribe(event._eventOutput);
      this._eventInput.on('showDetails', function(eventView) {
        this._eventOutput.emit('showDetails', eventView);
      }.bind(this));
    }
  };  //  End DayView.prototype.loadEvents
  
  /**@method getDate
   * 
   * Returns the DayView's currently assigned date.
   *
   * @return {string} A date string in format "yyyy-mm-dd"
   */
  DayView.prototype.getDate = function getDate() {
    return this._date;
  };  //  End DayView.prototype.getDate
  
  /**@method getSize
   * 
   * Returns the dimensions of the entire DayView; used by the scroller to scroll
   * each DayView in sequence without gaps.
   *
   * @return {array} A three-index array in format [x, y, z]
   */
  DayView.prototype.getSize = function getSize() {
    return (this.timeline)
      ? [true, this.timeline.getSize()[1], 0]
      : [true, this.options.sizeY, 0];
  };  //  End DayView.prototype.getSize
  
  /**@method setDate
   * 
   * Assigns a date string to the DayView's _date variable.
   *
   * @param {string} date : The date string in format "yyyy-mm-dd" to assign to the DayView.
   */
  DayView.prototype.setDate = function setDate(date) {
    if (date && date instanceof Array && date.length === 3) date = TimeUtil.dateArrToStr(date);
    if (date && typeof date === 'string' && date.length === 10) this._date = date;
  };  //  End DayView.prototype.setDate
  
  //  Helper Functions
  /**@method _createBackground
   * 
   * Builds a surface to fill visual negative space. Pipes events to this.options.Scrollview.
   */
  function _createBackground() {
    var bgSize = [undefined, this.getSize()];
    var bgModifier = new StateModifier({
      origin: [0, 0],
      align: [0, 0],
      size: [undefined, 1440]
    });
    
    var bgSurface = new Surface({
      properties: {
        background: '-webkit-linear-gradient(top, '
                    + DayViewSettings.getBGColorNight() + ' ' + (5 / 24 * 100) + '%, '
                    + DayViewSettings.getBGColorDay() + ' ' + (7 / 24 * 100) + '%, '
                    + DayViewSettings.getBGColorDay() + ' ' + (17 / 24 * 100) + '%, '
                    + DayViewSettings.getBGColorNight() + ' ' + (19 / 24 * 100) + '%)',
        zIndex: -10
      }
    });
    
    bgSurface.pipe(this.options.scrollView);
    this.add(bgModifier).add(bgSurface);
  } //  End _createBackground
  
  /**@method _createTimeline
   * 
   * Builds the timebar measuring time units on the DayView.
   */
  function _createTimeline() {
    this._timeline = new TimelineView();
    
    this.add(this._timeline);
  } //  End _createTimeline
  
  module.exports = DayView;
});































