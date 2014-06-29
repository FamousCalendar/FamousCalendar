/*** TimelineView.js ***
 *  Wayland Woodruff
 *  WaylandWoodruff@gmail.com
 */

define(function(require, exports, module) {
  var View            = require('famous/core/View');
  var Surface         = require('famous/core/Surface');
  var Transform       = require('famous/core/Transform');
  var StateModifier   = require('famous/modifiers/StateModifier');
  
  function TimelineView() {
    View.apply(this, arguments);
    
    _createGraphic.call(this);
  }
  
  TimelineView.DEFAULT_OPTIONS = {
    timeUnits: 30,
    _12HourClock: true,
    timebarSize: [45, ((1440 / 30) * 30)],  //  Replace second index with getNumberRows * notchSpacing
    timelineSize: [1, ((1440 / 30) * 30)],  //  Replace second index with getNumberRows * notchSpacing
    timebarFontSize: 10,
    notchSize: [5, 1],
    notchSpacing: 30,                 //  Change to get current row height
    timelineBackgroundColor: '#EEEEEE',
    timelineLineColor: '#4444AA'
  };
  
  TimelineView.prototype = Object.create(View.prototype);
  TimelineView.prototype.constructor = TimelineView;
  TimelineView.prototype.getSize = function getSize() {
    return [this.options.timebarSize[0], this.options.timebarSize[1], 0];
  };
  
  function _createGraphic() {
    var timebarModifier = new StateModifier({
      origin: [0, 0],
      align: [0, 0],
      size: this.options.timebarSize
    });
    
    var timebarNode = this.add(timebarModifier);
    
    _addTimeline.call(this, timebarNode);
    _addNotches.call(this, timebarNode);
    _createUnits.call(this, timebarNode);
    
    var bgSurface = new Surface({
      properties: {
        backgroundColor: this.options.timelineBackgroundColor,
        zIndex: 1
      }
    });
    
    timebarNode.add(bgSurface);
  } //  End _createGraphic
  
  function _addTimeline(node) {
    var timelineSurface = new Surface({
      properties: {
        backgroundColor: this.options.timelineLineColor,
        zIndex: 2
      }
    });
    
    var timelineModifier = new StateModifier({
      origin: [1, 0],
      align: [0.85, 0],
      size: this.options.timelineSize
    });
    
    node.add(timelineModifier).add(timelineSurface);
  }
  
  function _addNotches(node) {
    for (var i = 0; i < (1440 / 30); i++) {
      var notchSurface = new Surface({
        properties: {
          backgroundColor: this.options.timelineLineColor,
          zIndex: 3
        }
      });
      
      var notchModifier = new StateModifier({
        origin: [1, 0],
        align: [0.85, 0],
        size: this.options.notchSize,
        transform: Transform.translate(0, (this.options.notchSpacing * i), 0)
      });
      
      node.add(notchModifier).add(notchSurface);
    }
  } //  End _addNotches
  
  function _createUnits(node) {
    var tUnit = this.options.timeUnits;
    var _makeTimestamp = function _makeTimestamp(iteration, baseUnit, showMinutes, _12HourClock) {
      var minutes = iteration * baseUnit;
      var rawTime = [Math.floor(minutes / 60), (minutes % 60)];
      _12HourClock = _12HourClock || false;
      var time = '';
      
      if (_12HourClock) {
        time += (rawTime[0] < 13) ? ((rawTime[0] === 0) ? 12 : rawTime[0]) : (rawTime[0] - 12);
        if (showMinutes) {
          time += ':' + rawTime[1];
        }
        time += (rawTime[0] < 12) ? ' a.m.' : ' p.m.';
      } else {
        time += rawTime[0] + (showMinutes ? (':' + rawTime[1]) : '');
      }
      
      return new Surface({
        content: time,
        properties: {
          backgroundColor: 'rgba(0, 0, 0, 0)',
          color: this.options.timelineLineColor,
          fontSize: '' + this.options.timebarFontSize + 'px',
          zIndex: 4
        }
      });
    };
    
    if (tUnit > 60) { //  Print timestamp at every row
      for (var i = 0; i < (1440 / tUnit); i++) {
        var timestampSurface = _makeTimestamp.call(this, i, tUnit, false, this.options._12HourClock);
        var timestampModifier = new StateModifier({
          origin: [0, 0.5],
          align: [0.15, 0],
          size: [this.options.timebarSize[0]+2, this.options.timebarFontSize],
          transform: Transform.translate(0, (this.options.notchSpacing * i), 0)
        });
        node.add(timestampModifier).add(timestampSurface);
      }
    } else {    //  Print timestamp at every other row
      for (var i = 0; i < (1440 / tUnit / 2); i++) {
        var timestampSurface = _makeTimestamp.call(this, i, (tUnit * 2), (tUnit < 30), this.options._12HourClock);
        var timestampModifier = new StateModifier({
          origin: [0, 0.5],
          align: [0.15, 0],
          size: [this.options.timebarSize[0]+2, this.options.timebarFontSize],
          transform: Transform.translate(0, ((this.options.notchSpacing * 2) * i), 0)
        });
        node.add(timestampModifier).add(timestampSurface);
      }
    }
  } //  End _createUnits
  
  module.exports = TimelineView;
});





































