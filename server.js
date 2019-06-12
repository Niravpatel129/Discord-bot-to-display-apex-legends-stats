const express = require("express");
const app = express();
const port = 3003;
const axios = require("axios");
var Jimp = require("jimp");
app.use("/exported-images", express.static("static"));

const Discord = require("discord.js");
const client = new Discord.Client();

//function to set the localimage to the character with the data on top
function loadImageForSelectedCharacter(url, games, dmg, ad, name) {
  var name = name.charAt(0).toUpperCase() + name.slice(1);
  var games = "Games: " + games;
  var dam = "Damage: " + dmg;
  var ad = "ADR: " + ad;
  return new Promise((resolve, reject) => {
    Jimp.read(url)
      .then(function(image) {
        loadedImage = image;
        // image.crop(0, 30, 652, 729);
        return Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
      })
      .then(function(font) {
        loadedImage
          .print(font, 100, 600, games, (err, image, { x, y }) => {
            image.print(font, 100, 600 + 40, dam, (err, image, { x, y }) => {
              image.print(font, 100, 600 + 80, ad, (err, image, { x, y }) => {
                image.print(font, 100, 600 - 400, name);
              });
            });
          })
          .write("picture.png");
      })
      .then(() => {
        console.log("1");
        resolve("success");
      });
  });
}

app.get("/", (req, res) => {
  res.send("bot running");
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", message => {
  //debugging
  if (message === "debugging") {
    axios
      .get(
        "http://api.mozambiquehe.re/bridge?version=2&platform=PC&player=raieez&auth=Kae5tcqrkg3A05ajxLA9"
      )
      .then(res => {
        console.log(res);
      });
  }

  //end of debugging
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
        message.channel.send(msg[1] + " player level is: " + level);
      })
      .catch(() => {
        message.channel.send("Player Not Found");
      });
  }

  if (msg[0] === "!dmg") {
    axios
      .get(
        "http://api.mozambiquehe.re/bridge?version=2&platform=PC&player=" +
          msg[1] +
          "&auth=Kae5tcqrkg3A05ajxLA9"
      )
      .then(dat => {
        let selected = dat.data.legends.selected;
        character = Object.keys(selected);

        console.log(character);
        selected = selected[Object.keys(selected)[0]];

        if (selected.games_played && selected.damage) {
          let damage = selected.damage / selected.games_played;
          damage = Math.floor(damage);
          let img = selected.ImgAssets.icon;
          let playername = msg[1];
          const getResult = async () => {
            if (msg[1] === "raieez") {
              message.channel.send("A-I-B-A-T-C");
            }
            return await loadImageForSelectedCharacter(
              img,
              selected.games_played,
              selected.damage,
              damage,
              playername
            );
          };
          getResult().then(() => {
            console.log("2");
            message.channel
              .send({
                files: ["picture.png"]
              })
              .catch(() => {
                message.channel.send("Something wen't wrong, message the dev");
              });
          });
        } else {
          message.channel
            .send(
              "On your selected character equip the banner: games played and total damage to see your average damage per game"
            )
            .catch(() => {
              message.channel.send("Something wen't wrong, message the dev");
            });
        }
      })
      .catch(() => {
        message.channel.send("Player Not Found");
      });
  }
});

client.login("NTg3MTM5NDg2MjgzMjAyNTgw.XPyX3Q._YSeFuFQavPV3iNq4h9gTGcoVA8");

app.listen(process.env.PORT || 4001, console.log("botrunning"));
