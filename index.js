// Les 4 prochaines lignes servent à importer les modules servant au bot de fonctionner.
require('dotenv/config');
const { Client, IntentsBitField } = require('discord.js');
const { CommandHandler } = require('djs-commander');
const path = require('path');

const client = new Client({ // Permet de créer un client servant de référence au bot avec des "intents", simmilaire à des depedencies.
    intents: [
        IntentsBitField.Flags.Guilds, // Intent servant à récupérer les données des serveurs dans lequel il est.
    ],
});

new CommandHandler({ // Correspond au "Command Handler" qui va prendre en charge les commandes discord pour que l'on puisse en créer plus facilement.
    client, // Permet de définir le client que le "Command Handler" va devoir utiliser pour éxécuter les commandes.
    commandsPath: path.join(__dirname, 'commands'), // Le "Command Handler" va utiliser le dossier "commands" pour lire les fichiers des commandes discord.
    eventsPath: path.join(__dirname, 'events'), // Le "Command Handler" va utiliser le dossier "events" pour lire les fichiers des events discord.
    validationsPath: path.join(__dirname, 'validations'),
    testServer: '1053722483087388803', // Correspond au serveur de test du bot.
});

client.login(process.env.TOKEN); // Permet de mettre le bot en ligne avec son token caché dans un fichier ".env" (Raisons de sécurité).