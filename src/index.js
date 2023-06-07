require('dotenv/config');
const { Client, IntentsBitField } = require('discord.js');
const mongoose = require('mongoose');
const eventHandler = require('./handlers/eventHandler');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildPresences,
    ],
});

(async () =>{
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGODB_URI, { keepAlive: true });
        console.log("Connected to DB");

        eventHandler(client);

        client.login(process.env.TOKEN); // Permet de mettre le bot en ligne avec son token caché dans un fichier ".env" (Raisons de sécurité).
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

