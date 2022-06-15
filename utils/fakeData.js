const Station = require('../models/station.schema');

function getRandomDate(start, end) {
  var diff = end.getTime() - start.getTime();
  var new_diff = diff * Math.random();
  var date = new Date(start.getTime() + new_diff);
  return date;
}

const listNameDeviceAndGPS = [
  {
    NameDevice: 'BinhDuong.DiAn.DongHoa.0001',
    GPS: {
      lat: 10.8870049,
      lon: 106.773877,
    },
  },
  {
    NameDevice: 'BinhDuong.DiAn.DongHoa.0002',
    GPS: {
      lat: 10.8870049,
      lon: 106.773877,
    },
  },
  {
    NameDevice: 'BinhDuong.DiAn.DongHoa.0003',
    GPS: {
      lat: 10.8870049,
      lon: 106.773877,
    },
  },
  {
    NameDevice: 'TPHCM.ThuDuc.LinhTrung.0001',
    GPS: {
      lat: 10.86213,
      lon: 106.7754828,
    },
  },
  {
    NameDevice: 'TPHCM.ThuDuc.LinhTrung.0002',
    GPS: {
      lat: 10.86213,
      lon: 106.7754828,
    },
  },
  {
    NameDevice: 'TPHCM.ThuDuc.LinhDong.0001',
    GPS: {
      lat: 10.847031,
      lon: 106.7372499,
    },
  },
  {
    NameDevice: 'TPHCM.ThuDuc.BinhChanh.0001',
    GPS: {
      lat: 10.864561,
      lon: 106.74234,
    },
  },
  {
    NameDevice: 'TPHCM.Quan3.Phuong13.0001',
    GPS: {
      lat: 10.964561,
      lon: 106.1232134,
    },
  },
  {
    NameDevice: 'TPHCM.Quan3.Phuong6.0001',
    GPS: {
      lat: 10.3626234,
      lon: 106.745567,
    },
  },
  {
    NameDevice: 'TPHCM.Quan7.TanHung.0001',
    GPS: { lat: 10.745737, lon: 106.346234 },
  },
  {
    NameDevice: 'TPHCM.Quan9.TanPhu.0001',
    GPS: { lat: 10.2362423, lon: 106.56868 },
  },
  {
    NameDevice: 'TPHCM.Quan9.LongPhu.0001',
    GPS: { lat: 10.7668678, lon: 106.234235 },
  },
  {
    NameDevice: 'TPHCM.BinhTan.AnLac.0001',
    GPS: { lat: 10.9568564, lon: 106.123525 },
  },
  {
    NameDevice: 'TPHCM.TanPhu.TanSonNhi.0001',
    GPS: { lat: 10.5627, lon: 106.236663 },
  },
];

exports.fake = async () => {
  var arr = [];
  for (var i = 0, t = 40; i < t; i++) {
    arr.push(Math.round(Math.random() * t));
  }

  for await (a of arr) {
    let index = Math.floor(Math.random() * listNameDeviceAndGPS.length);
    const Time1 = getRandomDate(new Date('04/1/2021'), new Date('05/21/2021'));
    let PredictTime = Time1;
    PredictTime.setHours(PredictTime.getHours() + 1);
    let data = {
      NameDevice: listNameDeviceAndGPS[index].NameDevice,
      GPS: listNameDeviceAndGPS[index].GPS,
      O2: Math.floor(Math.random() * (300000 - 200000 + 1)) + 200000,
      PM10: Math.floor(Math.random() * 100),
      PM25: Math.floor(Math.random() * 400),
      PM100: Math.floor(Math.random() * 70),
      Temp: Math.floor(Math.random() * (85 - -45 + 1)) + -45,
      Pre: Math.floor(Math.random() * (110 - 30 + 1)) + 30,
      Hum: Math.floor(Math.random() * (100 + 1)),
      Time: Time1,
      predictNextHour: {
        Date: PredictTime,
        value: Math.floor(Math.random() * 400),
      },
    };

    const {
      NameDevice,
      GPS,
      O2,
      PM10,
      PM25,
      PM100,
      Temp,
      Pre,
      Hum,
      Time,
      predictNextHour,
    } = data;
    const date = new Date(Time);
    console.log(GPS);
    const stationData = {
      O2,
      Temp,
      Hum,
      Pre,
      PM25,
      PM10,
      PM100,
      AQI: Math.max(PM25, PM10, PM100),
      predictNextHour,
      createdAt: date,
    };
    // console.log(stationData);
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
    } else {
      await Station.create({
        NameDevice,
        GPS,
        currentAQI: stationData.AQI,
        data: [stationData],
      });
    }
  }
};
