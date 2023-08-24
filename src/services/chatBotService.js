import request from "request";
import dotenv from "dotenv";
dotenv.config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IMAGE_GET_STARTED = "https://bit.ly/vam-bot1";

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: "https://graph.facebook.com/v2.6/me/messages",
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log("message sent!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
}

let getUserName = async (sender_psid) => {
  return new Promise((resolve, reject) => {
    // Send the HTTP request to the Messenger Platform
    request(
      {
        uri: `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
        method: "GET",
      },
      (err, res, body) => {
        console.log("getUserName ~ body:", body);
        if (!err) {
          body = JSON.parse(body);
          const username = `${body.first_name} ${body.last_name}`;
          resolve(username);
        } else {
          console.error("Unable to send message:" + err);
          reject(err);
        }
      }
    );
  });
};

let sendGetStartedTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "The VAM restaurant warmly welcomes our valued guests!",
            image_url: IMAGE_GET_STARTED,
            subtitle: "We have the right hat for everyone.",
            buttons: [
              // {
              //   type: "web_url",
              //   url: "https://www.originalcoastclothing.com/",
              //   title: "View Website",
              // },
              {
                type: "postback",
                title: "SHOW MAIN MENU",
                payload: "MAIN_MENU",
              },
              {
                type: "postback",
                title: "RESERVE A TABLE",
                payload: "RESERVE_TABLE",
              },
              {
                type: "postback",
                title: "GUIDE TO USE THIS BOT",
                payload: "GUIDE_BOT",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

let handleGetStarted = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const username = await getUserName(sender_psid);
      // send text message
      let response1 = { text: `Welcome ${username} to VAM Nguyen Restaurant!` };
      await callSendAPI(sender_psid, response1);

      // send generic template message
      let response2 = sendGetStartedTemplate();
      await callSendAPI(sender_psid, response2);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

export default { handleGetStarted };
