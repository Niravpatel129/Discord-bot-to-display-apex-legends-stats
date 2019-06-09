const express = require("express");
const app = express();
const port = 3003;
const axios = require("axios");

const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", message => {
  let msg = message.content.split(" ");
  if (msg[0] === "!apexlvl") {
    axios
      .get(
        "http://api.mozambiquehe.re/bridge?version=2&platform=PC&player=" +
          msg[1] +
          "&auth=Kae5tcqrkg3A05ajxLA9"
      )
      .then(dat => {
        let level = dat.data.global.level;
        // msg.channel("hello");
        message.channel.send(msg[1] + " player level is: " + level);
      })
      .catch(() => {
        message.channel.send("Player Not Found");
      });
  }
});

client.login("NTg3MTM5NDg2MjgzMjAyNTgw.XPyOmQ._PT9JQl4yieIj25mvRXfOXHqIJg");

app.listen("4000", console.log("botrunning"));
