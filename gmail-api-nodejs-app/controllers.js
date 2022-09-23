const axios = require("axios");
const { generateConfig } = require("./utils");
const nodemailer = require("nodemailer");
const CONSTANTS = require("./constants");
const { google } = require("googleapis");

require("dotenv").config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function sendMail(req, res) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        ...CONSTANTS.auth,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      ...CONSTANTS.mailoptions,
      text: "The Gmail API with NodeJS works",
    };

    const result = await transport.sendMail(mailOptions);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

async function getUser(req, res) {
  try {
    console.log("This getuser Execute");
    const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/profile`;
    const { token } = await oAuth2Client.getAccessToken();
    console.log(token);
    const config = generateConfig(url, token);
    console.log(config);
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

async function getDrafts(req, res) {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/drafts`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function readMail(req, res) {
  try {
    console.log("User Email Execute");
    const url = `https://gmail.googleapis.com/gmail/v1/users/dushyant.khoda007@gmail.com/messages/${req.params.messageId}`;
    const anotherUrl = `https://gmail.googleapis.com/gmail/v1/users/dushyant.khoda007@gmail.com/messages`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);
    let data = await response.data;
    res.json(data);
  } catch (error) {
    res.send(error);
  }
}
async function listMail(req, res) {
  try {
    console.log("User Email Execute");
    const anotherUrl = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/messages`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(anotherUrl, token);
    const response = await axios(config);
    let data = await response.data;
    res.json(data);
  } catch (error) {
    res.send(error);
  }
}

async function watchMethod(req, res) {
  try {
    // console.log("User Email Watch Execute");
    // const anotherUrl = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/watch`;
    // const { token } = await oAuth2Client.getAccessToken();
    // const config = generateConfig(anotherUrl, token);
    // const response = await axios(config);
    // let data = await response.data;
    const request = {
      labelIds: ["INBOX"],
      topicName: "projects/nodejs-email-testing-363204/topics/Get-mail",
    };
    const data = Gmail.Users.watch(request, "me");
    res.json(data);
  } catch (error) {
    res.send(error);
  }
}

module.exports = {
  getUser,
  sendMail,
  getDrafts,
  readMail,
  listMail,
  watchMethod,
};

app.post("/hooks", (req, res) => {
  console.log("Hooks Connected");
});
