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
      startTime: [8,0]
    },
    timelineView: {
      filePath: 'views/timelines/BasicTimelineView',
      //font: ,
      //fontSize: ,
      //fontColor: ,
      //fontStyle: ,
      timebarWidth: 1,
      notchWidth: 1,
      notchLength: 5,
      notchSpacing: 30,
      notchColor: '#000000'
    }
  }
  
  var current_settings = {
    time: {
      units: 30,
      military: false
    },
    dayView: {
      startTime: [8,0]    //  [hour, minute]
    },
    timelineView: {
      filePath: 'views/timelines/BasicTimelineView',
      //font: ,
      //fontSize: ,
      //fontColor: ,
      //fontStyle: ,
      timebarWidth: 45,
      timebarLineWidth: 1,
      timebarColor: '#4444AA',
      notchWidth: 1,
      notchLength: 5,
      notchSpacing: 30,
      notchColor: '#4444AA',
      backgroundColor: 'EEEEEE'
    }
  }
  
  module.exports = {
    time: {
      getTimeUnits: function() { return current_settings.time['units']; },
      is12HourClock: function() { return !current_settings.time['military']; }
    },
    dayView: {
      getStartTime: function() { return current_settings.dayView['startTime']; }
    },
    timelineView: {
      getFilePath: function() { return current_settings.timelineView['filePath']; },
      getTimebarWidth: function() { return current_settings.timelineView['timebarWidth']; },
      getTimebarLineWidth: function() { return current_settings.timelineView['timebarLineWidth']; },
      getTimebarColor: function() { return current_settings.timelineView['timebarColor']; },
      getNotchWidth: function() { return current_settings.timelineView['notchWidth']; },
      getNotchLength: function() { return current_settings.timelineView['notchLength']; },
      getNotchSpacing: function() { return current_settings.timelineView['notchSpacing']; },
      getNotchColor: function() { return current_settings.timelineView['notchColor']; },
      getBGColor: function() { return current_settings.timelineView['backgroundColor']; }
    }
    //  Getters and Setters here
  };
});

