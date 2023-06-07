require('dotenv/config');
const { Client, IntentsBitField } = require('discord.js');


client.login(process.env.TOKEN); // Permet de mettre le bot en ligne avec son token caché dans un fichier ".env" (Raisons de sécurité).