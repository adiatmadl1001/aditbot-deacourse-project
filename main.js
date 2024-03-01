const Bot = require("./app/Bot")
require("dotenv").config()
const token = process.env.TELE_TOKEN
const options = {
  polling: true,
}
const aditBot = new Bot(token, options)

const main = () => {
  console.log("checking")
  aditBot.getSticker()
  aditBot.getAdit()
  aditBot.getTextAfter()
  aditBot.getQuotes()
  aditBot.getNews()
  aditBot.getQuake()
  aditBot.getHelp()
  aditBot.getMenu()
  console.log("checking complete")
}

main()
