const fs = require('fs');
const request = require('request');
const Discord = require("discord.js");
var mkdirp = require('mkdirp');

const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () => {
    // This event will run if the bot starts, and logs in, successfully.
    //console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    console.log("Starting bot.");
    client.user.setActivity(`Looking for images`);

    // Get channel
    const henChannel = client.channels.get("482585301479325717");
    console.log("Got channel 482585301479325717");

    // Get messages
    henChannel.fetchMessages({ limit: 0 })
        .then(messages => 
            messages.forEach(message => {
                // channel: (TextChannel {name: 'name'})
                // author: User{username: 'name'}
                //console.log(message.attachments)
                //console.log(message.channel.name)
                //console.log(message.author.username)
                const dir = './images/' + message.channel.name + '/';
                mkdirp(dir, (err) => console.log(err))
                message.attachments.forEach(a => {
                    //fs.writeFileSync(`./${a.name}`, a.file); // Write the file to the system synchronously.
                    download(a.url, dir + a.id + a.filename, function(){
                        console.log('Downloaded image: ' + a.id);
                    })
                })
            })
        )
        .catch(console.error);

    console.log("Done!")

  });

client.on("message", async message => {
    // This event will run on every single message received, from any channel or DM.
    
    // It's good practice to ignore other bots. This also makes your bot ignore itself
    // and not get into a spam loop (we call that "botception").
    if(message.author.bot) return;
})

const download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      //console.log('content-type:', res.headers['content-type']);
      //console.log('content-length:', res.headers['content-length']);
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };

client.login(config.token);

/*
const henChannel = client.channels.get("482585301479325717");

// Get messages
channel.fetchMessages({ limit: 10 })
  .then(messages => console.log(`Received ${messages.size} messages`))
  .catch(console.error);


const fs = require('fs');
msg.attachments.forEach(a => {
    fs.writeFileSync(`./${a.name}`, a.file); // Write the file to the system synchronously.
});

   request = require('request');

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

download('https://www.google.com/images/srpr/logo3w.png', 'google.png', function(){
  console.log('done');
});
*/