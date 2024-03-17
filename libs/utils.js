const commands = require("./command")
const { helpText, invalidCommand } = require("./constant")

function checkError(bot) {
  bot.on("polling_error", (error) => {
    console.log(error.code)
  })
}

function checkCallback(bot) {
  bot.on("callback_query", (callback) => {
    const callbackName = callback.data
    if (callbackName == "user_guide") {
      bot.sendMessage(callback.from.id, helpText)
    }
  })
}

function checkCommand(bot) {
  bot.on("message", (callback) => {
    const isInCommand = Object.values(commands).some((keywword) =>
      keywword.test(callback.text)
    )
    if (!isInCommand) {
      bot.sendMessage(callback.from.id, invalidCommand, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "User Guide",
                callback_data: "user_guide",
              },
            ],
          ],
        },
      })
    }
  })
}

function checkTime() {
  const _date = new Date()

  const date = ("0" + _date.getDate()).slice(-2)
  const month = ("0" + _date.getMonth() + 1).slice(-2)
  const year = _date.getFullYear()
  const hours = _date.getHours()
  const minutes = _date.getMinutes()
  const seconds = _date.getSeconds()

  return (
    date +
    "-" +
    month +
    "-" +
    year +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds
  )
}


function commandSticker(bot){
    bot.on("sticker", (callback) => {
        console.log(`getSticker executed by ${callback.from.first_name}`)
        bot.sendMessage(callback.from.id, callback.sticker.emoji)
      })
}

function commandFollow(bot){
    bot.onText(commands.follow, (callback, after) => {
        console.log(`getSticker executed by ${callback.from.first_name}`)
        bot.sendMessage(callback.from.id, `bot thing is${after[1]}`)
      })   
}

function commandQuote(bot){
    bot.onText(commands.quote, async (callback) => {
        console.log(`getQuotes executed by ${callback.from.first_name}`)
        const quoteEndpoint = process.env.QUOTE_ENDPOINT
        try {
          const apiCall = await fetch(quoteEndpoint)
          const { quote } = await apiCall.json()
  
          bot.sendMessage(callback.from.id, quote)
        } catch (e) {
          bot.sendMessage(
            callback.from.id,
            "we're sorry cannot show these quote 🙏"
          )
        }
      })
}
module.exports = { checkTime, checkError, checkCommand, checkCallback,commandSticker,commandFollow, commandQuote }
