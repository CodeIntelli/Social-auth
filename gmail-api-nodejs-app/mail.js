const express = require("express");
const routes = require("./routes");
require("dotenv").config();

const app = express();
app.use("/api", routes);

app.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});

app.get("/", async (req, res) => {
  // const result=await sendMail();
  res.send("Welcome to Gmail API with NodeJS");
});

// Imports the Google Cloud client library
// const { PubSub } = require("@google-cloud/pubsub");

// async function quickstart(
//   projectId = "node-js-gmail-testing", // Your Google Cloud Platform project ID
//   topicNameOrId = "projects/nodejs-email-testing-363204/topics/Get-mailsss", // Name for the new topic to create
//   subscriptionName = "projects/nodejs-email-testing-363204/subscriptions/received-mailssss" // Name for the new subscription to create
// ) {
//   // Instantiates a client
//   const pubsub = new PubSub({ projectId });

//   // Creates a new topic
//   const [topic] = await pubsub.createTopic(topicNameOrId);
//   console.log(`Topic ${topic.name} created.`);

//   // Creates a subscription on that new topic
//   const [subscription] = await topic.createSubscription(subscriptionName);

//   // Receive callbacks for new messages on the subscription
//   subscription.on("message", (message) => {
//     console.log("Received message:", message.data.toString());
//     process.exit(0);
//   });

//   // Receive callbacks for errors on the subscription
//   subscription.on("error", (error) => {
//     console.error("Received error:", error);
//     process.exit(1);
//   });

//   // Send a message to the topic
//   topic.publish(Buffer.from("Test message!"));
// }
// quickstart();
