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

let getStartedTemplate = () => {
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
      let response2 = getStartedTemplate();
      await callSendAPI(sender_psid, response2);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

let getMainMenuTemplate = () => {
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
                type: "postback",
                title: "RESERVE A TABLE",
                payload: "RESERVE_TABLE",
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
      let response = getMainMenuTemplate();
      await callSendAPI(sender_psid, response);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

let getLunchMenuTemplate = () => {
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
            image_url: "https://bit.ly/imageSalad",
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
                title: "BACK TO MAIN MENU",
                payload: "BACK_TO_MAIN_MENU",
              },
              {
                type: "postback",
                title: "RESERVE A TABLE",
                payload: "RESERVE_TABLE",
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
      let response = getLunchMenuTemplate();
      await callSendAPI(sender_psid, response);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

// Lunch Detail
let getAppetizerDetail = () => {
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
                title: "BACK TO MAIN MENU",
                payload: "BACK_TO_MAIN_MENU",
              },
              {
                type: "postback",
                title: "RESERVE A TABLE",
                payload: "RESERVE_TABLE",
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
      let response = getAppetizerDetail();
      await callSendAPI(sender_psid, response);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

let getFishDetail = () => {
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
                title: "BACK TO MAIN MENU",
                payload: "BACK_TO_MAIN_MENU",
              },
              {
                type: "postback",
                title: "RESERVE A TABLE",
                payload: "RESERVE_TABLE",
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
      let response = getFishDetail();
      await callSendAPI(sender_psid, response);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

let getMeatDetail = () => {
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
                title: "BACK TO MAIN MENU",
                payload: "BACK_TO_MAIN_MENU",
              },
              {
                type: "postback",
                title: "RESERVE A TABLE",
                payload: "RESERVE_TABLE",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};
let sendMeatBacon = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // send generic template message
      let response = getMeatDetail();
      await callSendAPI(sender_psid, response);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

// Dinner Detail
let getDinnerMenuTemplate = () => {};

let sendDinnerMenu = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      // send generic template message
      let response = getDinnerMenuTemplate();
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

export default {
  handleGetStarted,
  sendMainMenu,
  sendLunchMenu,
  sendDinnerMenu,
  backToMainMenu,
  sendAppetizer,
  sendFish,
  sendMeatBacon,
};
