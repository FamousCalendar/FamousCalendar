/*** DayView.js ***/

define(function(require, exports, module) {
  //  Dependencies
  var View  = require('famous/core/View');
  
  var RowsView      = require('views/RowsView');
  var TimelineView  = require('views/TimelineView');
  var AppSettings   = require('config/AppSettings');
  
  function DayView() {
    View.apply(this, arguments);
    
    _createRows.call(this);
    _createTimeline.call(this);
    this.loadEvents();
  }
  
  DayView.DEFAULT_OPTIONS = {
    scrollView: null
  };
  
  //  Prototype Functions
  DayView.prototype = Object.create(View.prototype);
  DayView.prototype.constructor = DayView;
  
  DayView.prototype.getSize = function getSize() {
    //  This function is called by scrollview to determine spacing of each element in the scroll's collection
    return this.rows.getTotalSize();
  };  //  End DayView.prototype.getSize
  
  DayView.prototype.loadEvents = function loadEvents() {
    //  Instantiates the collection of event surfaces and their modifiers for a given day.
    //  Called each time the ScrollView cycles a DayView from one end of the collection to the other
  };  //  End DayView.prototype.loadEvents
  
  //  Helper Functions
  function _createRows() {
    this.rows = new RowsView({ scrollView: this.options.scrollView });
    this.add(this.rows);
  };  //  End _createRows
  
  function _createTimeline() {
    this.timeline = new TimelineView();
    this.add(this.timeline);
  };  //  End _createTimeline
  
  module.exports = DayView;
});