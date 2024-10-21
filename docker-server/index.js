/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-token');
require('dotenv').config();

const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cors());

// Get the value of the environment variable AGORA_APP_ID. Make sure you set this variable to the App ID you obtained from Agora console.
const appId = process.env.AGORA_APP_ID;

// Get the value of the environment variable AGORA_APP_CERTIFICATE. Make sure you set this variable to the App certificate you obtained from Agora console
const appCertificate = process.env.AGORA_APP_CERTIFICATE;

// Set streaming permissions
const role = RtcRole.PUBLISHER;

// Token validity time in seconds
const tokenExpirationInSecond = 3600;

// The validity time of all permissions in seconds
const privilegeExpirationInSecond = 3600;

if (!appId || !appCertificate) {
  console.log(
    'Need to set environment variable AGORA_APP_ID and AGORA_APP_CERTIFICATE',
  );
  process.exit(1);
}

app.post('/token', (req, res) => {
  const { channelName, uid } = req.body;

  if (!channelName || !uid) {
    return res.status(422).json({ message: 'channelName and uid is required' });
  }

  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    uid || 0,
    role,
    tokenExpirationInSecond,
    privilegeExpirationInSecond,
  );

  res.json({ token, uid, appId });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
