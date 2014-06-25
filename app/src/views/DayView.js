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
  
  var AppSettings   = require('config/AppSettings');
  var TimelineView  = require('views/TimelineView');
  
  function DayView() {
    View.apply(this, arguments);
    
    this._eventsNode  = new RenderNode();
    this._date        = null;
    
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
  
  DayView.prototype.getSize = function getSize() {
    //  This function is called by scrollview to determine spacing of each element in the scroll's collection
    return (this.timeline)
      ? [true, this.timeline.getSize()[1], 0]
      : [true, 1440, 0];
  };  //  End DayView.prototype.getSize
  
  DayView.prototype.buildEvents = function buildEvents(date) {
    //  Instantiates the collection of event surfaces and their modifiers for a given day.
    //  Called each time the ScrollView cycles a DayView from one end of the collection to the other
    this._date = date;
    console.log('Updated value to:', this._date);
    //  Clear all events on this dayView
    //  Collect list of events for the current date from data storage
    //  Build list of EventViews with corresponding modifiers
    //  add modifier+eventview to this.eventsNode
  };  //  End DayView.prototype.loadEvents
  
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
  
  module.exports = DayView;
});































