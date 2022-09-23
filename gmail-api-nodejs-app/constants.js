require("dotenv").config();

const auth = {
  type: "OAuth2",
  user: "dushyant.khoda007@gmail.com",
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
};

const mailoptions = {
  from: "Dushyant &lt;dushyant.khoda007@gmail.com>",
  to: "fullstack.dk@gmail.com",
  subject: "Gmail API NodeJS",
};

module.exports = {
  auth,
  mailoptions,
};
