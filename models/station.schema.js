const mongoose = require('mongoose');

const stationSchema = mongoose.Schema({
  NameDevice: String,
  GPS: {
    lat: Number,
    lon: Number,
  },
  area: {
    type: String,
  },
  currentAQI: Number,
  data: [
    {
      O2: Number,
      Temp: Number,
      Hum: Number,
      Pre: Number,
      PM25: Number,
      PM10: Number,
      PM100: Number,
      AQI: Number,
      predictNextHour: {
        Date: { type: Date },
        value: Number,
      },
      createdAt: {
        type: Date,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Station = mongoose.model('Station', stationSchema);

module.exports = Station;
