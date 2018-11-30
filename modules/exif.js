'use strict';
const ExifImage = require('exif').ExifImage;

const getCoordinates = (kuva) => {
  return new Promise(((resolve, reject) => {
    try {
      new ExifImage({image: kuva}, function(error, exifData) {
        if (error) {
          console.log('Error: ' + error.message);
          reject(error);
        } else {
          if (exifData.gps.GPSLatitudeRef) {
            const latitude = gpsToDecimal(exifData.gps.GPSLatitude,
                exifData.gps.GPSLatitudeRef); // Do something with your data!
            const longitude = gpsToDecimal(exifData.gps.GPSLongitude,
                exifData.gps.GPSLongitudeRef); // Do something with your data!
            const coordinates = {
              lat: latitude,
              lng: longitude
            }
            resolve(coordinates);
          }
        }
      });
    } catch (error) {
      console.log('Error: ' + error.message);
      reject(error);
    }
  }));
};

// convert GPS coordinates to GoogleMaps format
const gpsToDecimal = (gpsData, hem) => {
  let d = parseFloat(gpsData[0]) + parseFloat(gpsData[1] / 60) +
      parseFloat(gpsData[2] / 3600);
  return (hem === 'S' || hem === 'W') ? d *= -1 : d;
};

module.exports = {
  getCoordinates: getCoordinates,
};