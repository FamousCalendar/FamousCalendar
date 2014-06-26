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
  
  var AppSettings   = require('config/AppSettings');
  var TimelineView  = require('views/TimelineView');
  var EventView     = require('views/EventView');
  
  function DayView() {
    View.apply(this, arguments);
    
    this._date        = null;
    this._eventsNode  = new RenderNode();
    this.add(this._eventsNode);
    
    _createBackground.call(this);
    _createTimeline.call(this);
  }
  
  DayView.DEFAULT_OPTIONS = {
    scrollView: null,
    startTime: AppSettings.dayView.getStartTime()
  };
  
  //  Prototype Functions
  DayView.prototype = Object.create(View.prototype);
  DayView.prototype.constructor = DayView;
  
  DayView.prototype.buildEvents = function buildEvents(dates) {
    //  Instantiates the collection of event surfaces and their modifiers for a given day.
    //  Called each time the ScrollView cycles a DayView from one end of the collection to the other
    
    if (!dates || !(dates instanceof Array)) dates = [];
    
    this._eventsNode._child = null;
    this._eventsNode._hasMultipleChildren = false;
    
    for (var i = 0; i < dates.length; i++) {
      var eventNode = new RenderNode();
      
      var start = _timeStrToArr(dates[i].start);
      var posY  = _timeArrToPixels(start);
      
      var eventModifier = new StateModifier({
        origin: [0, 0],
        align: [0, 0],
        transform: Transform.translate(0, posY, 0)
      });
      var event = new EventView(dates[i]);
      
      eventNode.add(eventModifier).add(event);
      this._eventsNode.add(eventNode);
    }
  };  //  End DayView.prototype.loadEvents
  
  DayView.prototype.getDate = function getDate() {
    return this._date;
  };  //  End DayView.prototype.getDate
  
  DayView.prototype.getSize = function getSize() {
    //  This function is called by scrollview to determine spacing of each element in the scroll's collection
    return (this.timeline)
      ? [true, this.timeline.getSize()[1], 0]
      : [true, 1440, 0];
  };  //  End DayView.prototype.getSize
  
  DayView.prototype.setDate = function setDate(date) {
    if (date && typeof date === 'string') this._date = date;
  };  //  End DayView.prototype.setDate
  
  //  Helper Functions
  function _createBackground() {
    var bgModifier = new StateModifier({
      origin: [0, 0],
      align: [0, 0],
      //size: this.getSize()
      size: [undefined, 1440]
    });
    
    var bgSurface = new Surface({
      properties: {
        backgroundColor: '#BBBBAA',
        zIndex: -10
      }
    });
    
    bgSurface.pipe(this.options.Scrollview);
    this.add(bgModifier).add(bgSurface);
  } //  End _createBackground
  
  function _createTimeline() {
    this.timeline = new TimelineView();
    this.add(this.timeline);
  } //  End _createTimeline
  
  function _timeArrToPixels(time) {
    if (!time || !(time instanceof Array)) return;
    var units   = AppSettings.time.getTimeUnits();
    var spacing = AppSettings.timelineView.getNotchSpacing();
    var pixToMin  = spacing / units;
    
    return (((time[0] * 60) + time[1]) * pixToMin);
  } //  End _timeArrToPixels
  
  function _timeStrToArr(time) {
    if (time instanceof Array) return time;
    if (typeof time !== 'string') return null;
    return [+(time.slice(0, 2)), +(time.slice(3))];
  } //  End _timeStrToArr
  
  function _timeToPositionPercentage(time) {
    //  Takes time as array: [hour, minutes] (military time)
    if (!time || !(time instanceof Array)) return null;
    
    return (time instanceof Array && time.length >= 2)
      ? (((time[0] * 60) + time[1]) / 1440)
      : null;
  } //  End _timeToPositionPercentage
  
  module.exports = DayView;
});































