const Station = require('../models/station.schema');
const User = require('../models/user.schema');
const AppError = require('../utils/appError');

exports.getAllStation = async (req, res, next) => {
  const stations = await Station.find();
  res.json(
    {
      status: 'success',
      results: stations.length,
      data: stations,
    },
    200
  );
};

exports.setStationData = async (req, res, next) => {
  try {
    const {
      NameDevice,
      GPS_Lat,
      GPS_Lon,
      O2,
      PM10,
      PM25,
      PM100,
      Temp,
      Pre,
      Hum,
      Time,
      Predict_date,
      Predict_value,
    } = req.body;
    const date = new Date(Time);
    const stationData = {
      O2,
      Temp,
      Hum,
      Pre,
      PM25,
      PM10,
      PM100,
      AQI: Math.max(PM25, PM10, PM100),
      predictNextHour: { Date: new Date(Predict_date), value: Predict_value },
      createdAt: date,
    };
    console.log(stationData);
    let station = await Station.findOne({ NameDevice });

    if (station) {
      station.data.push(stationData);
      station.data = station.data.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      station.currentAQI = station.data[station.data.length - 1].AQI;
      await Station.findOneAndUpdate({ NameDevice }, station, {
        new: true,
        runValidators: true,
      });
      res.json(
        {
          status: 'success',
          data: {
            NameDevice,
            GPS: {
              lat: GPS_Lat,
              lon: GPS_Lon,
            },
            data: stationData,
            Time,
          },
        },
        200
      );
    } else {
      await Station.create({
        NameDevice,
        GPS: {
          lat: GPS_Lat,
          lon: GPS_Lon,
        },
        currentAQI: stationData.AQI,
        data: [stationData],
        predicts: [],
      });
      res.json(
        {
          status: 'success',
          data: {
            NameDevice,
            GPS: {
              lat: GPS_Lat,
              lon: GPS_Lon,
            },
            data: stationData,
            Time,
          },
        },
        200
      );
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ status: 'error' });
  }
};

exports.getStationById = async (req, res, next) => {
  const stationId = req.params.stationId;

  const station = await Station.findById(stationId);
  if (!station) {
    return res
      .status(404)
      .send(new AppError('No document found with that ID', 404));
  }
  res.json(
    {
      status: 'success',
      data: station,
    },
    200
  );
};

exports.getDashboard = async (req, res, next) => {
  let user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).send(new AppError('User not found!', 404));
  }
  let stations = await Station.find().sort({ currentAQI: -1 });
  const userCount = await User.count();
  let station = null;
  if (user.role === 'user') {
    station = await Station.findOne({ NameDevice: user.NameDevice });
  } else {
    station = stations ? stations[0] : null;
  }
  res.json(
    {
      status: 'success',
      data: {
        station,
        stationCount: stations.length || 0,
        userCount,
      },
    },
    200
  );
};
exports.getStationByDeviceName = async (req, res, next) => {
  let user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).send(new AppError('User not found!', 404));
  }

  const station = await Station.findOne({ NameDevice: user.NameDevice });
  if (!station) {
    return res.status(404).send(new AppError('Station not found!', 404));
  }
  res.json(
    {
      status: 'success',
      data: station,
    },
    200
  );
};

exports.predict = async (req, res, next) => {
  try {
    const {
      NameDevice,
      GPS_Lat,
      GPS_Lon,
      Predict_date1,
      Predict_value1,
      Predict_date2,
      Predict_value2,
      Predict_date3,
      Predict_value3,
    } = req.body;
    const predicts = [
      {
        Date: new Date(Predict_date1),
        value: Predict_value1,
      },
      {
        Date: new Date(Predict_date2),
        value: Predict_value2,
      },
      {
        Date: new Date(Predict_date3),
        value: Predict_value3,
      },
    ];
    let station = await Station.findOne({ NameDevice });

    if (station) {
      station.predicts = [...station.predicts, ...predicts];

      await Station.findOneAndUpdate({ NameDevice }, station, {
        new: true,
        runValidators: true,
      });
      res.json(
        {
          status: 'success',
          NameDevice,
          predicts,
        },
        200
      );
    } else {
      await Station.create({
        NameDevice,
        GPS: {
          lat: GPS_Lat,
          lon: GPS_Lon,
        },
        currentAQI: 0,
        data: [],
        predicts: [...predicts],
      });
      res.json(
        {
          status: 'success',
          NameDevice,
          predicts,
        },
        200
      );
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ status: 'error' });
  }
};
