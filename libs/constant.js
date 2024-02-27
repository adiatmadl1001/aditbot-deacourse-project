function helpText(bot) {
  return `Welcome to ${bot}. Please enter your command that you want to use :
    -----
    !help -> for more information about this bot
    !quote -> for generate random quote
    !news -> for generate random news
    !quake -> for generate earthquake information
    !halo -> for saying hello to owner of this program
    -----
    `
}

const invalidCommand = "Command not available 🙏"

module.exports = { helpText, invalidCommand }
