const qrcode = require("qrcode-terminal");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const csvtojson = require("csvtojson/v2");

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const message = (name) => [
  
];

client.on("ready", async () => {
  console.log("Client is ready!");
  csvtojson()
    .fromFile("sheet.csv")
    .then(async (json) => {
      const total = json.length;
      let count = 1;
      for (const data of json) {
        const name = data["name"];
        const number = data["number"];
        client.getChatById(`91${number}@c.us`).then(async (chat) => {
          // const media = MessageMedia.fromFilePath("./poster.png");
          try {
            chat
              .sendMessage(message(name).join("\n"))
              .then(() => {
                count++;
                console.log(`Message sent to ${name}`);
              });
          } catch (error) {
            console.log(error);
          }
        });
        console.log(`Count: ${count}/${total}`);
        await delay(10000);
      }
      console.log("All messages sent!");
      process.exit();
    });
});

client.initialize();
