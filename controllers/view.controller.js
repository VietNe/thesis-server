const FakeData = require('../utils/fakeData');
exports.getHome = async (req, res) => {
  res.status(200).render('home');
};
exports.fake = async (req, res) => {
  await FakeData.fake();
  await FakeData.fakePredict();
  res.status(200).render('home');
};
