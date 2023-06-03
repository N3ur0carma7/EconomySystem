module.exports = (interaction, commandObj) => {
    if (commandObj.devOnly) {
      if (interaction.member.id !== '580160894395219968') {
        interaction.reply('This command is for the developer only'); // Informe l'utilisateur qu'il ne peux pas éxécuter la commande.
        return true; // This must be added to stop the command from being executed.
      }
    }
  };