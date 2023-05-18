const express = require('express');

const fcmController = require('../controller/fcm');

const router = express.Router();

router.post('/push-notification', fcmController.sendPushNotification);

module.exports = router;