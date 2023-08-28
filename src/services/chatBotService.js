import request from "request";
import dotenv from "dotenv";
dotenv.config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IMAGE_GET_STARTED = "https://bit.ly/vam-bot1";
const IMAGE_DETAIL_ROOM = "https://bit.ly/eric-bot-18";
const IMAGE_GIF_WELCOME =
  "https://media.giphy.com/media/l41lTR6jmXXxHDgxG/giphy.gif";

// Sends response messages via the Send API
async function callSendAPI(sender_psid, response) {
  return new Promise(async (resolve, reject) => {
    try {
      // Construct the message body
      let request_body = {
        recipient: {
          id: sender_psid,
        },
        message: response,
      };

      await sendMarkSeenMessage(sender_psid);
      await sendTypingOn(sender_psid);

      // Send the HTTP request to the Messenger Platform
      request(
        {
          uri: "https://graph.facebook.com/v9.0/me/messages",
          qs: { access_token: PAGE_ACCESS_TOKEN },
          method: "POST",
          json: request_body,
        },
        (err, res, body) => {
          if (!err) {
            resolve("message sent!");
          } else {
            console.error("Unable to send message:" + err);
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

let sendTypingOn = (sender_psid) => {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    sender_action: "typing_on",
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
        console.log("sendTypingOn sent!");
      } else {
        console.error("Unable to send sendTypingOn:" + err);
      }
    }
  );
};
let sendMarkSeenMessage = (sender_psid) => {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    sender_action: "mark_seen",
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
        console.log("sendMarkSeenMessage sent!");
      } else {
        console.error("Unable to send sendMarkSeenMessage:" + err);
      }
    }
  );
};

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

let getStartedTemplate = (senderID) => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "The VAM restaurant warmly welcomes our valued guests!",
            image_url: IMAGE_GET_STARTED,
            subtitle: "Below are the restaurant options!",
            buttons: [
              {
                type: "postback",
                title: "SHOW MAIN MENU",
                payload: "MAIN_MENU",
              },
              {
                type: "web_url",
                url: `${process.env.URL_WEB_VIEW_ORDER}/${senderID}`,
                title: "TABLE RESERVATION",
                webview_height_ratio: "tall",
                messenger_extensions: true, // false: open the webview in new tab
              },
              {
                type: "postback",
                title: "GUIDE TO USE BOT",
                payload: "GUIDE_TO_USE",
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
      // let response2 = getStartedTemplate(sender_psid);

      let response2 = getImageGetStartedTemplate();
      let response3 = getStartedQuickReplyTemplate();

      // send an image
      await callSendAPI(sender_psid, response2);
      // send a quick replies
      await callSendAPI(sender_psid, response3);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

let getImageGetStartedTemplate = () => {
  let response = {
    attachment: {
      type: "image",
      payload: {
        url: IMAGE_GIF_WELCOME,
        is_reusable: true,
      },
    },
  };
  return response;
};

let getStartedQuickReplyTemplate = () => {
  let response = {
    text: "Below are the restaurant options!",
    quick_replies: [
      {
        content_type: "text",
        title: "MAIN MENU",
        payload: "MAIN_MENU",
      },
      {
        content_type: "text",
        title: "TABLE RESERVATION",
        payload: "<POSTBACK_PAYLOAD>",
      },
      {
        content_type: "text",
        title: "GUIDE TO USE BOT",
        payload: "<GUIDE_TO_USE>",
      },
    ],
  };
  return response;
};

let getMainMenuTemplate = (senderID) => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Our menus",
            subtitle:
              "We are pleased to offer you a wide-range of menu for lunch or dinner.",
            image_url: "https://bit.ly/imageMenu",
            buttons: [
              {
                type: "postback",
                title: "LUNCH MENU",
                payload: "LUNCH_MENU",
              },
              {
                type: "postback",
                title: "DINNER MENU",
                payload: "DINNER_MENU",
              },
            ],
          },
          {
            title: "Business Hours",
            subtitle: "MON-FRI 10AM - 11PM  | SAT 5PM - 10PM | SUN 5PM - 9PM",
            image_url: IMAGE_GET_STARTED,
            buttons: [
              {
                type: "web_url",
                url: `${process.env.URL_WEB_VIEW_ORDER}/${senderID}`,
                title: "TABLE RESERVATION",
                webview_height_ratio: "tall",
                messenger_extensions: true, // false: open the webview in new tab
              },
            ],
          },
          {
            title: "Restaurant Space",
            subtitle:
              "Restaurant accommodates up to 300 seated guests and similar at cocktail receptions",
            image_url: IMAGE_GET_STARTED,
            buttons: [
              {
                type: "postback",
                title: "SHOW ROOMS",
                payload: "SHOW_ROOMS",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

let sendMainMenu = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      // send generic template message
      let response = getMainMenuTemplate(sender_psid);
      await callSendAPI(sender_psid, response);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

// Lunch and Dinner
let getLunchMenuTemplate = (senderID) => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Appetizers",
            image_url: "https://bit.ly/imageAppetizer",
            buttons: [
              {
                type: "postback",
                title: "SHOW APPETIZERS",
                payload: "SHOW_APPETIZERS",
              },
            ],
          },
          {
            title: "Fish and Shell Fish",
            image_url: "https://bit.ly/imageFish",
            buttons: [
              {
                type: "postback",
                title: "SHOW FISH",
                payload: "SHOW_FISH",
              },
            ],
          },
          {
            title: "Meat Bacon",
            image_url: "https://bit.ly/3qKHFxk",
            buttons: [
              {
                type: "postback",
                title: "SHOW MEAT BACON",
                payload: "SHOW_MEAT_BACON",
              },
            ],
          },

          {
            title: "Go back",
            image_url: " https://bit.ly/imageToSend",
            buttons: [
              {
                type: "postback",
                title: "MAIN MENU",
                payload: "BACK_TO_MAIN_MENU",
              },
              {
                type: "web_url",
                url: `${process.env.URL_WEB_VIEW_ORDER}/${senderID}`,
                title: "TABLE RESERVATION",
                webview_height_ratio: "tall",
                messenger_extensions: true, // false: open the webview in new tab
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

let sendLunchMenu = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      // send generic template message
      let response = getLunchMenuTemplate(sender_psid);
      await callSendAPI(sender_psid, response);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

let getDinnerMenuTemplate = (senderID) => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Appetizers",
            image_url: "https://bit.ly/imageAppetizer",
            buttons: [
              {
                type: "postback",
                title: "SHOW APPETIZERS",
                payload: "SHOW_APPETIZERS",
              },
            ],
          },
          {
            title: "Fish and Shell Fish",
            image_url: "https://bit.ly/imageFish",
            buttons: [
              {
                type: "postback",
                title: "SHOW FISH",
                payload: "SHOW_FISH",
              },
            ],
          },
          {
            title: "Meat Bacon",
            image_url: "https://bit.ly/3qKHFxk",
            buttons: [
              {
                type: "postback",
                title: "SHOW MEAT BACON",
                payload: "SHOW_MEAT_BACON",
              },
            ],
          },

          {
            title: "Go back",
            image_url: " https://bit.ly/imageToSend",
            buttons: [
              {
                type: "postback",
                title: "MAIN MENU",
                payload: "BACK_TO_MAIN_MENU",
              },
              {
                type: "web_url",
                url: `${process.env.URL_WEB_VIEW_ORDER}/${senderID}`,
                title: "TABLE RESERVATION",
                webview_height_ratio: "tall",
                messenger_extensions: true, // false: open the webview in new tab
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

let sendDinnerMenu = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      // send generic template message
      let response = getDinnerMenuTemplate(sender_psid);
      await callSendAPI(sender_psid, response);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

// Lunch, Dinner Detail
let getAppetizerDetail = (senderID) => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Watermelon",
            subtitle: "50.000vnd/1kg",
            image_url: "https://bit.ly/vam-watermelon",
          },
          {
            title: "Mango",
            subtitle: "20.000vnd/1kg",
            image_url: "https://bit.ly/vam-mango",
          },
          {
            title: "Guava",
            subtitle: "30.000vnd/1kg",
            image_url: "https://bit.ly/vam-guava",
          },

          {
            title: "Go back",
            image_url: " https://bit.ly/imageToSend",
            buttons: [
              {
                type: "postback",
                title: "MAIN MENU",
                payload: "BACK_TO_MAIN_MENU",
              },
              {
                type: "web_url",
                url: `${process.env.URL_WEB_VIEW_ORDER}/${senderID}`,
                title: "TABLE RESERVATION",
                webview_height_ratio: "tall",
                messenger_extensions: true, // false: open the webview in new tab
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};
let sendAppetizer = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      // send generic template message
      let response = getAppetizerDetail(sender_psid);
      await callSendAPI(sender_psid, response);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

let getFishDetail = (senderID) => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Cá Hồi Châu Âu",
            subtitle: "150.000vnd/1kg",
            image_url: "https://bit.ly/vam-ca-hoi",
          },
          {
            title: "Cá Chép Ông Táo",
            subtitle: "200.000vnd/1kg",
            image_url: "https://bit.ly/45oF6Ae",
          },
          {
            title: "Cá Ngừ Châu Mỹ",
            subtitle: "30.000vnd/1kg",
            image_url: "https://bit.ly/45LRn1t",
          },

          {
            title: "Go back",
            image_url: " https://bit.ly/imageToSend",
            buttons: [
              {
                type: "postback",
                title: "MAIN MENU",
                payload: "BACK_TO_MAIN_MENU",
              },
              {
                type: "web_url",
                url: `${process.env.URL_WEB_VIEW_ORDER}/${senderID}`,
                title: "TABLE RESERVATION",
                webview_height_ratio: "tall",
                messenger_extensions: true, // false: open the webview in new tab
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};
let sendFish = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      // send generic template message
      let response = getFishDetail(sender_psid);
      await callSendAPI(sender_psid, response);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

let getMeatDetail = (senderID) => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Thịt nướng phê lòi",
            subtitle: "150.000vnd/1kg",
            image_url: "https://bit.ly/3PcBf3s",
          },
          {
            title: "Thịt nướng xông khói ảo giác",
            subtitle: "200.000vnd/1kg",
            image_url: "https://bit.ly/3QSUZu8",
          },
          {
            title: "Thịt xông khói Mai Thúy",
            subtitle: "30.000vnd/1kg",
            image_url: "https://bit.ly/3srGzqS",
          },

          {
            title: "Go back",
            image_url: " https://bit.ly/imageToSend",
            buttons: [
              {
                type: "postback",
                title: "MAIN MENU",
                payload: "BACK_TO_MAIN_MENU",
              },
              {
                type: "web_url",
                url: `${process.env.URL_WEB_VIEW_ORDER}/${senderID}`,
                title: "TABLE RESERVATION",
                webview_height_ratio: "tall",
                messenger_extensions: true, // false: open the webview in new tab
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};
let sendMeatBacon = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      // send generic template message
      let response = getMeatDetail(sender_psid);
      await callSendAPI(sender_psid, response);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

let backToMainMenu = async (sender_psid) => {
  await sendMainMenu(sender_psid);
};

let getImageRoomTemplate = () => {
  let response = {
    attachment: {
      type: "image",
      payload: {
        url: IMAGE_DETAIL_ROOM,
        is_reusable: true,
      },
    },
  };
  return response;
};

let getButtonRoomTemplate = (senderID) => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "button",
        text: "The Restaurant can contain a maximum of 300 customer.",
        buttons: [
          {
            type: "postback",
            title: "MAIN MENU",
            payload: "BACK_TO_MAIN_MENU",
          },
          {
            type: "web_url",
            url: `${process.env.URL_WEB_VIEW_ORDER}/${senderID}`,
            title: "TABLE RESERVATION",
            webview_height_ratio: "tall",
            messenger_extensions: true, // false: open the webview in new tab
          },
        ],
      },
    },
  };
  return response;
};

let handleShowDetailRoom = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      // send an image
      let response1 = getImageRoomTemplate();
      // send a button template: text, buttons
      let response2 = getButtonRoomTemplate(sender_psid);

      await callSendAPI(sender_psid, response1);
      await callSendAPI(sender_psid, response2);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  handleGetStarted,
  sendMainMenu,
  sendLunchMenu,
  sendDinnerMenu,
  backToMainMenu,
  sendAppetizer,
  sendFish,
  sendMeatBacon,
  handleShowDetailRoom,
  callSendAPI,
  getUserName,
};
