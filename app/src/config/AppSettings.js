/*** AppSettings.js ***/
/*  Global settings for the app are stored here with their getters and setters
    exported in an object.
 */

define(function(require, exports, module) {
  //  ENUMS
  var timeUnits = { '12hr': 720, '8hr': 480, '6hr': 360, '4hr': 240, '2hr': 120, 'hour': 60, '30mn': 30, '15mn': 15, '10mn': 10, '5mn': 5, 'min': 1 };
  
  //  Global Settings
  //    FONTS
  //    COLORS
  //    SIZES
  //    INPUTS (speed, physics, etc.)
  //    VIEW SETTINGS
  
  var DEFAULT_SETTINGS = {
    time: {
      units: 30,
      military: false
    },
    dayView: {
      startTime: [8,0],   //  [hour, minute]
      backgroundColorDay: '#FAFAFA',
      backgroundColorNight: '#EFEFFF'
    },
    timelineView: {
      filePath: 'views/timelines/BasicTimelineView',
      fontFamily: 'sans-serif',
      fontSize: '10px',
      fontUnitColor: 'red',
      fontAMColor: 'lightgrey',
      fontPMColor: '#4444AA',
      timebarWidth: 60,
      timebarLineWidth: 1,
      timebarColor: '#FAFAFA',
      notchWidth: 1,
      notchLength: 5,
      notchSpacing: 30,
      notchColor: '#4444AA',
      backgroundColor: 'EEEEEE'
    }
  }
  
  var current_settings = {
    time: {
      units: 30,
      military: false
    },
    dayView: {
      startTime: [8,0],   //  [hour, minute]
      backgroundColorDay: 'white',
      backgroundColorNight: '#EFEFFF'
    },
    timelineView: {
      filePath: 'views/timelines/BasicTimelineView',
      //  Font Settings
      fontFamily: 'sans-serif',
      fontSize: 10,
      fontUnitColor: 'red',
      fontAMColor: 'lightgrey',
      fontPMColor: '#4444AA',
      //  Background surface settings for TimelineView
      timebarWidth: 50,
      timebarLineWidth: 1,
      timebarColor: 'white',
      //  TimelineView line settings
      lineColor: '#4444AA',
      notchWidth: 1,
      notchLength: 5,
      notchSpacing: 30
    }
  }
  
  module.exports = {
    time: {
      getTimeUnits: function() { return current_settings.time['units']; },
      is12HourClock: function() { return !current_settings.time['military']; }
    },
    dayView: {
      getStartTime: function() { return current_settings.dayView['startTime']; },
      getBGColorDay: function() { return current_settings.dayView['backgroundColorDay']; },
      getBGColorNight: function() { return current_settings.dayView['backgroundColorNight']; }
    },
    timelineView: {
      getFilePath: function() { return current_settings.timelineView['filePath']; },
      getFontFamily: function() { return current_settings.timelineView['fontFamily']; },
      getFontSize: function() { return current_settings.timelineView['fontSize']; },
      getFontUnitColor: function() { return current_settings.timelineView['fontUnitColor']; },
      getFontAMColor: function() { return current_settings.timelineView['fontAMColor']; },
      getFontPMColor: function() { return current_settings.timelineView['fontPMColor']; },
      getTimebarWidth: function() { return current_settings.timelineView['timebarWidth']; },
      getTimebarLineWidth: function() { return current_settings.timelineView['timebarLineWidth']; },
      getTimebarColor: function() { return current_settings.timelineView['timebarColor']; },
      getLineColor: function() { return current_settings.timelineView['lineColor']; },
      getNotchWidth: function() { return current_settings.timelineView['notchWidth']; },
      getNotchLength: function() { return current_settings.timelineView['notchLength']; },
      getNotchSpacing: function() { return current_settings.timelineView['notchSpacing']; }
    }
    //  Getters and Setters here
  };
});

