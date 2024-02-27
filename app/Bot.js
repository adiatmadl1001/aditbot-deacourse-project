const TelegramBot = require("node-telegram-bot-api")
const commands = require("../libs/command")
const { helpText, invalidCommand } = require("../libs/constant")

class Bot extends TelegramBot {
  constructor(token, options) {
    super(token, options)
    console.log("AditBot started")
    this.on("polling_error", (error)=>{
        console.log(error.code)
    })
    this.on("message", (callback) => {
      const isInCommand = Object.values(commands).some((keywword) =>
        keywword.test(callback.text)
      )
      if (!isInCommand) {
        this.sendMessage(callback.from.id, invalidCommand, {
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
    this.on("callback_query", async(callback)=>{
        const callbackName = callback.data
        const botProfile = await this.getMe()
        if(callbackName == "user_guide"){
            this.sendMessage(callback.from.id, helpText(botProfile.username))
        }
    })
  }
  getSticker() {
    this.on("sticker", (callback) => {
      console.log(`getSticker executed by ${callback.from.first_name}`)
      this.sendMessage(callback.from.id, callback.sticker.emoji)
    })
  }
  getAdit() {
    this.onText(commands.halo, (callback) => {
      console.log(`getAdit executed by ${callback.from.first_name}`)
      this.sendMessage(
        callback.from.id,
        "halo dit ~~~ apa yang ingin kamu lakukan?"
      )
      if (callback.text !== ".") {
        this.onText("message", (callback, after) => {
          this.sendMessage(callback.from.id, `oalah kamu ingin ${after[1]}`)
        })
      } else {
        this.sendMessage(callback.from.id, "yawess")
      }
    })
  }
  getTextAfter() {
    this.onText(commands.follow, (callback, after) => {
      console.log(`getSticker executed by ${callback.from.first_name}`)
      this.sendMessage(callback.from.id, `this thing is${after[1]}`)
    })
  }
  getQuotes() {
    this.onText(commands.quote, async (callback) => {
      console.log(`getQuotes executed by ${callback.from.first_name}`)
      const quoteEndpoint = "https://api.kanye.rest/"
      try {
        const apiCall = await fetch(quoteEndpoint)
        const { quote } = await apiCall.json()

        this.sendMessage(callback.from.id, quote)
      } catch (e) {
        this.sendMessage(
          callback.from.id,
          "we're sorry cannot show these quote 🙏"
        )
      }
    })
  }
  getNews() {
    this.onText(commands.news, async (callback) => {
      console.log(`getNews executed by ${callback.from.first_name}`)
      const newsEndpoint = "https://jakpost.vercel.app/api/category/indonesia"
      try {
        const apiCall = await fetch(newsEndpoint)
        const { posts } = await apiCall.json()
        for (let i = 0; i < 2; i++) {
          const news = posts[i]
          const { title, image, headline } = news
          this.sendPhoto(callback.from.id, image, {
            caption: `Title: ${title}\n\nHeadline: ${headline}`,
          })
        }
      } catch (err) {
        this.sendMessage(callback.from.id, "Error fetching News 🙏")
      }
    })
  }
  getQuake() {
    this.onText(commands.quake, async (callback) => {
      console.log(`getQuake executed by ${callback.from.first_name}`)
      const earthQuakeEndPoint =
        "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json"
      try {
        const apiCall = await fetch(earthQuakeEndPoint)
        const {
          Infogempa: {
            gempa: { Tanggal, Jam, Magnitude, Kedalaman, Wilayah, Shakemap },
          },
        } = await apiCall.json()

        const gempaID = callback.from.id
        const url = `https://data.bmkg.go.id/DataMKG/TEWS/${Shakemap}`

        this.sendPhoto(gempaID, url, {
          caption: `
          -----------------------\nINFO GEMPA\n-----------------------\n ${Tanggal}||${Jam}\nWilayah: ${Wilayah}\nKedalaman: ${Kedalaman}\nMagnitude: ${Magnitude}
          `,
        })
      } catch (err) {
        this.sendMessage(callback.from.id, "Error Fetching Earth Quakes 🙏")
      }
    })
  }
  getHelp() {
    this.onText(commands.help, async (callback) => {
      console.log(`getHelp executed by ${callback.from.first_name}`)
      const botProfile = await this.getMe()
      this.sendMessage(callback.from.id, helpText(botProfile.username))
    })
  }
}

module.exports = Bot
