/*** AppSettings.js ***/
/*  Global settings for the app are stored here with their getters and setters
    exported in an object.
 */

define(function(require, exports, module) {
  //  ENUMS
  var timeUnits = {
    '12hr': 720,
    '8hr': 480,
    '6hr': 360,
    '4hr': 240,
    '2hr': 120,
    'hour': 60,
    '30mn': 30,  //  default
    '15mn': 15,
    '10mn': 10,
    '5mn': 5,
    'min': 1
  };
  
  //  Global Settings
  //    FONTS
  //    COLORS
  //    SIZES
  //    INPUTS (speed, physics, etc.)
  //    VIEW SETTINGS
  
  var DEFAULT_DayViewSettings = {
    timeUnits: '30mn',
    startTime: [9,0],   //  [hour, minute]
    //  Rows
    rowSize: [undefined, 40],
    rowColorDayPrimary: '#FFFF66',
    rowColorDaySecondary: '#FFFF99',
    rowColorNightPrimary: '#FF99CC',
    rowColorNightSecondary: '#FFCCFF',
    //  Timeline
    //timelineFont: ???,
    //timelineFontSize: ???,
    //timelineFontColor: '#000000',
    //timelineFontStyle: ???,
    timebarWidth: 1,
    timeNotchWidth: 1,
    timeNotchLength: 5,
    timelineLineColor: '#000000',
  };
  
  module.exports = {
    //  Getters and Setters here
  };
});

