'use strict';
const sharp = require('sharp');

const resizeImage = (kuva, koko, uusiKuva) => {
  return sharp(kuva)
  .resize(koko)
  .toFile(uusiKuva).then((data) => {
    console.log(data);
    return data;
  }).catch((err) => {
    console.log(err);
  });
};

module.exports = {
  resizeImage: resizeImage,
};