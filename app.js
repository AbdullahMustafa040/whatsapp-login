/*
 * Starter Project for WhatsApp Echo Bot Tutorial
 *
 * Remix this as the starting point for following the WhatsApp Echo Bot tutorial
 *
 */
"use strict";

// Access token for your app
// (copy token from DevX getting started page
// and save it as environment variable into the .env file)
const token = process.env.WHATSAPP_TOKEN;

// Imports dependencies and set up http server
const request = require("request"),
  express = require("express"),
  body_parser = require("body-parser"),
  axios = require("axios").default,
  app = express().use(body_parser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));

// Accepts POST requests at /webhook endpoint
app.post("/webhook", (req, res) => {
  console.log("Here");
  // Parse the request body from the POST
  let body = req.body;

  // Check the Incoming webhook message
  console.log(JSON.stringify(req.body, null, 2));

  // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id = req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
      axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v15.0/" +
          phone_number_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: {
            body: "Ack: " + msg_body,
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    res.sendStatus(200);
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    res.sendStatus(404);
  }
  try {
    if (req.body.entry[0].changes[0].value.hasOwnProperty("messages")) {
      if (req.body.entry[0].changes[0].value.messages[0].type == "text") {
        let text = req.body.entry[0].changes[0].value.messages[0].text.body;
        let substring = "Hey I want to signup";
        console.log("HEllo");
        console.log(text);
        console.log(substring);

        if (text.includes(substring)) {
          console.log("sub String contains");
          let userName =
            req.body.entry[0].changes[0].value.contacts[0].profile.name;
          let phoneNumber =
            req.body.entry[0].changes[0].value.contacts[0].wa_id;
          let phone_number_id =
            req.body.entry[0].changes[0].value.metadata.phone_number_id;
          let companyName = text.match(/'([^']+)'/)[1];
          enterRecievedMessage(
            companyName,
            phoneNumber,
            userName,
            phone_number_id,
            req
          );
          //        getLink(companyName, phoneNumber, userName, phone_number_id);
        }
      }
    }
  } catch (err) {
    console.log("error");
    console.log(err);
    return;
  }
  try {
    if (req.body.entry[0].changes[0].value.hasOwnProperty("statuses")) {
      console.log("in statuses");
      if(req.body.entry[0].changes[0].value.statuses[0].hasOwnProperty("pricing")){
      enterMessageStatus(req);
      }
    }
  } catch (err) {
    console.log("error 2");
    console.log(err);
  }
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
  console.log("Here 2");
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
   **/
  const verify_token = "a glitch";

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

function enterData(erty, pho, phone_number_id, redirect, companyId) {
  console.log("Pative");
  var XMLHttpRequest = require("xhr2");

  let xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "https://Pative-mobile-testing.bubbleapps.io/api/1.1/obj/end_user"
  );
  xhr.setRequestHeader("Accept", "*/*");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader(
    "Authorization",
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log("status " + xhr.status);
      console.log("status " + xhr.responseText);
      console.log(xhr.responseText);
      console.log("Data is succesfully enter");
      getID(pho, phone_number_id, redirect, companyId);
    }
  };

  console.log(companyId);
  console.log(erty);
  console.log(pho);
  let data = `{
      "name": "${erty}",
      "phoneNo":"${pho}",
      "company":"${companyId}"
      
  }`;
  //  ,"phoneNo":"${pho}","company":"${companyId}"}`;

  xhr.send(data);
  console.log("Done");
}

function getID(phoneNos, phone_number_id, redirect, companyId) {
  console.log("inside get ID");
  var XMLHttpRequest = require("xhr2");

  let xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  xhr.open(
    "GET",
    "https://{P}ative-mobile-testing.bubbleapps.io/api/1.1/obj/end_user?"+
    "constraints=%5B%7B%22key%22%3A+%22phoneNo%22%2C+%22constraint_type%22%3A+%22equals%22%2C+%22value%22%3A+%22" +
      phoneNos +
      companyId +
      "%22%7D%5D"
  );
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader(
    "Authorization",
  );
  let temString;
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      let obj = xhr.response;
      const myJSON = JSON.stringify(obj);
      let myObj = JSON.parse(myJSON);
      temString = myObj.response.results[0]._id;
      mycallback(temString, phoneNos, phone_number_id, redirect);
    }
  };
  xhr.send();
}

function mycallback(result, pho, phone_number_id, redirect) {
  console.log(result);
  console.log("idher be aa gya");

  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v15.0/" +
      phone_number_id +
      "/messages?access_token=" +
    data: {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: pho,
      type: "template",
      template: {
        name: "wa_auth",
        language: {
          code: "en",
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: redirect + "?token=" + result,
              },
            ],
          },
        ],
      },
    },
    headers: {
      "Content-Type": "application/json",
      Authorization:
    },
  });
}

function checkUser(phoneNoo, userName, phone_number_id, redirect, companyId) {
  console.log("in Check USer");
  var XMLHttpRequest = require("xhr2");
  let xhr = new XMLHttpRequest();
  xhr.open(
    "Get",
    "https://pative-mobile-testing.bubbleapps.io/api/1.1/obj/end_user?"+
    "constraints=%5B%7B%22key%22%3A+%22phoneNo%22%2C+%22constraint_type%22%3A+%22equals%22%2C+%22value%22%3A+%22" +
      phoneNoo +
      "%22%7D%2C+%7B%22key%22%3A+%22company%22%2C+%22constraint_type%22%3A+%22equals%22%2C+%22value%22%3A+%22" +
      companyId +
      "%22%7D%5D"
  );
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");

  let tempString;
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      let obj = xhr.response;
      const myJSON = JSON.stringify(obj);
      let myObj = JSON.parse(myJSON);
      myObj = JSON.parse(myObj);
      console.log(myObj);
      tempString = myObj.response.results;
      var size = Object.keys(tempString).length;
      if (size == 0) {
        console.log("No exits");
        enterData(userName, phoneNoo, phone_number_id, redirect, companyId);
      } else {
        console.log("outer If");
        getID(phoneNoo, phone_number_id, redirect, companyId);
      }
    }
  };
  xhr.send();
}

function getLink(companyName, phoneNumber, userName, phone_number_id) {
  console.log("in get Link");
  console.log(companyName);
  var XMLHttpRequest = require("xhr2");

  let xhr = new XMLHttpRequest();
  xhr.open(
    "Get",
    "https://pative-mobile-testing.bubbleapps.io/api/1.1/obj/company/?"+
    "constraints=%5B%7B%22key%22%3A+%22Name%22%2C+%22constraint_type%22%3A+%22equals%22%2C+%22value%22%3A+%22" +
      companyName +
      "%22%7D%5D"
  );
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  let tempString;
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      let obj = xhr.response;
      const myJSON = JSON.stringify(obj);
      let myObj = JSON.parse(myJSON);
      myObj = JSON.parse(myObj);
      tempString = myObj.response.results;
      var size = Object.keys(tempString).length;
      let redirect = tempString[0].Redirect_URL;
      let companyId = tempString[0]._id;
      checkUser(phoneNumber, userName, phone_number_id, redirect, companyId);
    }
  };
  xhr.send();
}
function enterRecievedMessage(
  companyName,
  phoneNumber,
  userName,
  phone_number_id,
  res
) {
  console.log("in enterRecievedMessage");
  var XMLHttpRequest = require("xhr2");

  let xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "https://pative-mobile-testing.bubbleapps.io/api/1.1/obj/recived_messages"
  );
  xhr.setRequestHeader("Accept", "*/*");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader(
    "Authorization",
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log("status " + xhr.status);
      console.log("status " + xhr.responseText);
      console.log(xhr.responseText);
      console.log("Data is succesfully enter");
      getLink(companyName, phoneNumber, userName, phone_number_id);
    }
  };

  let data = `{
      "CompanyName": "${companyName}",
      "display_phone_number":"${res.body.entry[0].changes[0].value.metadata.display_phone_number}",
      "message":"${res.body.entry[0].changes[0].value.messages[0].text.body}",
      "messaging_product":"${res.body.entry[0].changes[0].value.messaging_product}",
      "phone_number_id":"${res.body.entry[0].changes[0].value.metadata.phone_number_id}",
      "timestamp":"${res.body.entry[0].changes[0].value.messages[0].timestamp}",
      "user_name":"${res.body.entry[0].changes[0].value.contacts[0].profile.name}",
      "whatsapp_assign_id":"${res.body.entry[0].id}",
      "user_phone_no":"${phoneNumber}"

  }`;
  //  ,"phoneNo":"${pho}","company":"${companyId}"}`;

  xhr.send(data);
  console.log("Done");
}
function enterMessageStatus(res) {
  console.log("in enterMessageStatus");
  var XMLHttpRequest = require("xhr2");

  let xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "https://pative-mobile-testing.bubbleapps.io/api/1.1/obj/message_status"
  );
  xhr.setRequestHeader("Accept", "*/*");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader(
    "Authorization",
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log("status " + xhr.status);
      console.log("status " + xhr.responseText);
      console.log(xhr.responseText);
      console.log("Data is succesfully enter");
    }
  };

  let data = `{
  "display_phone_number":"${res.body.entry[0].changes[0].value.metadata.display_phone_number}",
  "messaging_product":"${res.body.entry[0].changes[0].value.messaging_product}",
  "phone_number_id":"${res.body.entry[0].changes[0].value.metadata.phone_number_id}",
  "pricing_model":"${res.body.entry[0].changes[0].value.statuses[0].pricing.pricing_model}",
  "recipient_id":"${res.body.entry[0].changes[0].value.statuses[0].recipient_id}",
    "category":"${res.body.entry[0].changes[0].value.statuses[0].pricing.category}",
      "conversion_type":"${res.body.entry[0].changes[0].value.statuses[0].conversation.origin.type}",
  "status":"${res.body.entry[0].changes[0].value.statuses[0].status}"
  }`;
  //  ,"phoneNo":"${pho}","company":"${companyId}"}`;

  xhr.send(data);
  console.log("Done");
}
