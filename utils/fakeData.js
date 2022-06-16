const Station = require('../models/station.schema');
const moment = require('moment');

function getRandomDate(start, end) {
  var diff = end.getTime() - start.getTime();
  var new_diff = diff * Math.random();
  var date = new Date(start.getTime() + new_diff);
  return date;
}

const listNameDeviceAndGPS = [
  {
    NameDevice: 'TPHCM.ThuDuc.LinhTrung.0001',
    area: 'Linh Trung, Thủ Đức, TP HCM',
    lat: 10.86213,
    GPS: {
      lon: 106.7754828,
    },
  },
  {
    NameDevice: 'TPHCM.ThuDuc.LinhTrung.0002',
    area: 'Linh Trung, Thủ Đức, TP HCM',
    GPS: {
      lat: 10.86213,
      lon: 106.7754828,
    },
  },
  {
    NameDevice: 'TPHCM.ThuDuc.LinhDong.0001',
    area: 'Linh Đông, Thủ Đức, TP HCM',
    GPS: {
      lat: 10.847031,
      lon: 106.7372499,
    },
  },
  {
    NameDevice: 'TPHCM.ThuDuc.LinhDong.0002',
    area: 'Linh Đông, Thủ Đức, TP HCM',
    GPS: {
      lat: 10.847031,
      lon: 106.7372499,
    },
  },
  {
    NameDevice: 'TPHCM.ThuDuc.BinhChanh.0001',
    area: 'Bình Chánh, Thủ Đức, TP HCM',
    GPS: {
      lat: 10.864561,
      lon: 106.74234,
    },
  },
  {
    NameDevice: 'TPHCM.Quan3.Phuong13.0001',
    area: 'Phường 13, Quận 3, TP HCM',
    GPS: {
      lat: 10.964561,
      lon: 106.1232134,
    },
  },
  {
    NameDevice: 'TPHCM.Quan3.Phuong6.0001',
    area: 'Phường 6, Quận 3, TP HCM',
    GPS: {
      lat: 10.3626234,
      lon: 106.745567,
    },
  },
  {
    NameDevice: 'TPHCM.Quan7.TanHung.0001',
    area: 'Tân Hưng, Quận 7, TP HCM',
    GPS: { lat: 10.745737, lon: 106.346234 },
  },
  {
    NameDevice: 'TPHCM.Quan7.TanHung.0002',
    area: 'Tân Hưng, Quận 7, TP HCM',
    GPS: { lat: 10.745737, lon: 106.346234 },
  },
  {
    NameDevice: 'TPHCM.Quan9.TanPhu.0001',
    area: 'Tân Phú, Quận 7, TP HCM',
    GPS: { lat: 10.2362423, lon: 106.56868 },
  },
  {
    NameDevice: 'TPHCM.Quan9.LongPhu.0001',
    area: 'Long Phú, Quận 9, TP HCM',
    GPS: { lat: 10.7668678, lon: 106.234235 },
  },
  {
    NameDevice: 'TPHCM.BinhTan.AnLac.0001',
    area: 'An Lạc, Bình Tân, TP HCM',
    GPS: { lat: 10.9568564, lon: 106.123525 },
  },
  {
    NameDevice: 'TPHCM.TanPhu.TanSonNhi.0001',
    area: 'Tân Sơn Nhì, Tân Phú, TP HCM',
    GPS: { lat: 10.5627, lon: 106.236663 },
  },
  {
    NameDevice: 'TPHCM.TanPhu.TanSonNhi.0002',
    area: 'Tân Sơn Nhì, Tân Phú, TP HCM',
    GPS: { lat: 10.5627, lon: 106.236663 },
  },
];

exports.fake = async () => {
  for await (station of listNameDeviceAndGPS) {
    const stationsData = [];
    for (var i = 1, d = 31; i < d; i++) {
      // Hour
      for (var j = 0, h = 23; j <= h; j++) {
        let PredictTime = `${j > 23 ? i + 1 : i}-05-2022 ${
          j > 23 ? '0' : j + 1
        }:00:00`;

        let Time = `${i < 10 ? '0' : ''}${i}-05-2022 ${j}:00:00`;

        let data = {
          O2: Math.floor(Math.random() * (300000 - 200000 + 1)) + 200000,
          PM10: Math.floor(Math.random() * 100),
          PM25: Math.floor(Math.random() * 400),
          PM100: Math.floor(Math.random() * 70),
          Temp: Math.floor(Math.random() * (85 - -45 + 1)) + -45,
          Pre: Math.floor(Math.random() * (110 - 30 + 1)) + 30,
          Hum: Math.floor(Math.random() * (100 + 1)),
          predictNextHour: {
            Date: moment(PredictTime, 'D-MM-YYYY H:mm:SS'),
            value: Math.floor(Math.random() * 400),
          },
          createdAt: moment(Time, 'D-MM-YYYY H:mm:SS'),
        };
        data.AQI = Math.max(data.PM25, data.PM10, data.PM100);
        stationsData.push(data);
      }
    }

    await Station.create({
      NameDevice: station.NameDevice,
      GPS: station.GPS,
      area: station.area,
      currentAQI: stationsData[0].AQI,
      data: stationsData,
    });
  }
};
