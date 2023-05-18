const admin = require('firebase-admin');

const serviceAccount = require('../google-services.json');

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.sendPushNotification = (req, res, next) => {
  // This registration token comes from the client FCM SDKs.
  const emulatorToken = 'eQHYyzCSTnOwzBatfmcMoB:APA91bFNpnGm4M6Erm-l7NhahRq5gj0LBfITHoKizKtHGYSV8dnJ6Eu07Tj6N40DnIlZnly3vOMYz_J-R6tHKtsCsy2B5hcsA0EaVqr_WY0hivVohllCeKcxgAbucA_ZgTZYNuMxDiHU';
  const deviceToken = 'd6-Wv1q3Shy-MvhjVb7Z4p:APA91bGb-JCVxuJqOXsmP4vE4yCI6-3QXLexpz7TnttBoYzdzidQs2KM7Hm-Bj2hbOY2iyx5TvBPcsD3_ktv9dUhxQvkBrmfAmPr1qsrfp-mkFwW3L-DvAN-6bJwUGp09S8l0weeshV1';
  const registrationToken = deviceToken;
  const message = {
    data: {
      title: 'Test Notification',
      message: 'Hello Darkness, my old friend!',
      complaint_id: 'ID'
    },
    token: registrationToken
  };

  // Send a message to the device corresponding to the provided
  // registration token.
  admin.messaging().send(message)
    .then(response => {
      // Response is a message ID string.
      res.status(200).json({ message: 'Successfully sent message', response: response })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}


