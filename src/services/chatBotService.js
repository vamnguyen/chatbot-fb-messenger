import request from "request";
import dotenv from "dotenv";
import { response } from "express";
dotenv.config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

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
            title: "Welcome!",
            image_url:
              "https://raw.githubusercontent.com/fbsamples/original-coast-clothing/main/public/styles/male-work.jpg",
            subtitle: "We have the right hat for everyone.",
            default_action: {
              type: "web_url",
              url: "https://www.originalcoastclothing.com/",
              webview_height_ratio: "tall",
            },
            buttons: [
              {
                type: "web_url",
                url: "https://www.originalcoastclothing.com/",
                title: "View Website",
              },
              {
                type: "postback",
                title: "Start Chatting",
                payload: "DEVELOPER_DEFINED_PAYLOAD",
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
