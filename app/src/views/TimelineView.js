/*** TimelineView.js ***
 *  Wayland Woodruff
 *  WaylandWoodruff@gmail.com
 */

define(function(require, exports, module) {
  var View            = require('famous/core/View');
  var Surface         = require('famous/core/Surface');
  var Transform       = require('famous/core/Transform');
  var StateModifier   = require('famous/modifiers/StateModifier');
  
  var AppSettings = require('config/AppSettings');
  var TimelineSettings = AppSettings.timelineView;
  
  function TimelineView() {
    View.apply(this, arguments);
    
    _createGraphic.call(this);
  }
  
  TimelineView.DEFAULT_OPTIONS = {
    timeUnits: AppSettings.time.getTimeUnits(),
    _12HourClock: AppSettings.time.is12HourClock(),
    timebarSize: [TimelineSettings.getTimebarWidth(), ((1440 / AppSettings.time.getTimeUnits()) * TimelineSettings.getNotchSpacing())],
    timelineSize: [TimelineSettings.getTimebarLineWidth(), ((1440 / AppSettings.time.getTimeUnits()) * TimelineSettings.getNotchSpacing())],
    fontFamily: TimelineSettings.getFontFamily(),
    fontSize: TimelineSettings.getFontSize(),
    fontUnitColor: TimelineSettings.getFontUnitColor(),
    fontAMColor: TimelineSettings.getFontAMColor(),
    fontPMColor: TimelineSettings.getFontPMColor(),
    timebarColor: TimelineSettings.getTimebarColor(),
    notchSize: [window.innerWidth, TimelineSettings.getNotchWidth()],
    notchSpacing: TimelineSettings.getNotchSpacing(),                 //  Change to get current row height
    timelineLineColor: TimelineSettings.getLineColor()
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
      classes: ['bgSurface', 'timebar'],
      properties: {
        backgroundColor: this.options.timebarColor,
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
      align: [1, 0],
      size: this.options.timelineSize
    });
    
    node.add(timelineModifier).add(timelineSurface);
  }
  
  function _addNotches(node) {
    for (var i = 0; i < (1440 / 30); i++) {
      var notchSurface = new Surface({
        properties: {
          //backgroundColor: this.options.timelineLineColor,
          background: '-webkit-linear-gradient(left, rgba(68, 68, 170, 0.75) 0%, rgba(68, 68, 170, 0) 75%)',
          zIndex: 3
        }
      });
      
      var notchModifier = new StateModifier({
        origin: [0, 0],
        align: [1, 0],
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
      var time = '<font style="color:' + this.options.fontUnitColor + '">' ;
      
      if (_12HourClock) {
        time += (rawTime[0] < 13) ? ((rawTime[0] === 0) ? 12 : rawTime[0]) : (rawTime[0] - 12);
        if (showMinutes) {
          time += ':' + rawTime[1];
        }
        time += '</font>';
        time += (rawTime[0] < 12) 
          ? '<font style="color:' + this.options.fontAMColor + '"> am</font>' 
          : '<font style="color:' + this.options.fontPMColor + '"> pm</font>';
      } else {
        time += rawTime[0] + (showMinutes ? (':' + rawTime[1]) : '');
      }
      
      return new Surface({
        content: time,
        classes: ['timestamp'],
        properties: {
          backgroundColor: 'rgba(0, 0, 0, 0)',
          fontFamily: this.options.fontFamily,
          fontSize: '' + this.options.fontSize + 'px',
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
          size: [this.options.timebarSize[0]+2, this.options.fontSize],
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
          size: [this.options.timebarSize[0]+2, this.options.fontSize],
          transform: Transform.translate(0, ((this.options.notchSpacing * 2) * i), 0)
        });
        node.add(timestampModifier).add(timestampSurface);
      }
    }
  } //  End _createUnits
  
  module.exports = TimelineView;
});





































