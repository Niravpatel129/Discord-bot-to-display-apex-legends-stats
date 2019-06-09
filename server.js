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
  if (msg[0] === "!lvl") {
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

  if (msg[0] === "!dmg") {
    console.log(msg[1]);
    axios
      .get(
        "http://api.mozambiquehe.re/bridge?version=2&platform=PC&player=" +
          msg[1] +
          "&auth=Kae5tcqrkg3A05ajxLA9"
      )
      .then(dat => {
        // console.log("???");
        let selected = dat.data.legends.selected;
        selected = selected[Object.keys(selected)[0]];
        if (selected.games_played && selected.damage) {
          let damage = selected.damage / selected.games_played;
          message.channel.send(
            msg[1] + " damage per game is approx: " + damage
          );
        } else {
          message.channel.send(
            "On your selected character requip the banner: games played and total damage to see your average damage per game"
          );
        }
      })
      .catch(() => {
        message.channel.send("Player Not Found");
      });
  }
});

client.login("NTg3MTM5NDg2MjgzMjAyNTgw.XPyX3Q._YSeFuFQavPV3iNq4h9gTGcoVA8");

app.listen(process.env.PORT || 4000, console.log("botrunning"));
