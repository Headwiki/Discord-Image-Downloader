const fs = require('fs');
const request = require('request');
const Discord = require("discord.js");
var mkdirp = require('mkdirp');

const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () => {

    let imageCount = 0;

    console.log("Starting.");
    client.user.setActivity(`Looking for images`);

    const channelId = '451879432601206794';

    // Get channel
    const henChannel = client.channels.get(channelId);

    // Get all messages
    henChannel.fetchMessages({ limit: 0 })
        .then(messages => 
            messages.forEach(message => {
                const dir = './images/' + message.channel.name + '/';

                // Create directory
                mkdirp(dir, (err) => console.log(err))

                message.attachments.forEach(a => {
                    download(a.url, dir + a.id + a.filename, () => {
                        console.log('Downloaded image: ' + a.id);
                    })
                })
            })
        )
        .catch(console.error);

        client.destroy();
  });

// Download image given uri and filename as path + name
const download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };

client.login(config.token);
