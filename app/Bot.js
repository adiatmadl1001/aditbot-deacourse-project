const TelegramBot = require("node-telegram-bot-api")
const commands = require("../libs/command")
const { helpText, invalidCommand } = require("../libs/constant")
const { checkTime } = require("../libs/utils")

class Bot extends TelegramBot {
  constructor(token, options) {
    super(token, options)
    console.log("AditBot started")
    this.on("polling_error", (error) => {
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
    this.on("callback_query", (callback) => {
      const callbackName = callback.data
      if (callbackName == "user_guide") {
        this.sendMessage(callback.from.id, helpText)
      }
    })
  }
  getGreeting() {
    this.onText(commands.greet, (callback)=>{
      console.log(`getGreeting excuted by ${callback.from.first_name}`,checkTime())
      
      const id = callback.from.id
      const greeting = `Hai i know that you ${callback.from.first_name}!`
      this.sendMessage(id, greeting)
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
      ).then(() => {
        this.once("message", (callback) => {
          if (callback.text == "makan") {
            console.log("once success")
            return
          }
          // this.sendMessage(callback.from.id, `oalah kamu ingin`)
          // if (callback.text !== ".") {
          //   this.sendMessage(callback.from.id, `oalah kamu ingin ${after[1]}`)
          //   return
          // } else {
          //   this.sendMessage(callback.from.id, "yawess")
          // }
        })
      })
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
      const quoteEndpoint = process.env.QUOTE_ENDPOINT
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
      const newsEndpoint = process.env.NEWS_ENDPOINT
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
      const earthQuakeEndPoint = process.env.QUAKE_ENDPOINT
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
      this.sendMessage(callback.from.id, helpText, {parse_mode:"Markdown"})
    })
  }
  getMenu() {
    this.onText(commands.menu, (callback) => {
      console.log(`getMenu called with ${callback.from.first_name}`)
      const buttonMenu = {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "!help",
                callback_data: "user_help",
              },
              {
                text: "!quote",
                callback_data: "user_quote",
              },
              {
                text: "!news",
                callback_data: "user_news",
              },
              {
                text: "!quake",
                callback_data: "user_quake",
              },
              {
                text: "!halo",
                callback_data: "user_halo",
              },
            ],
          ],
        },
        parse_mode: "Markdown",
      }
      this.sendMessage(callback.from.id, helpText, buttonMenu)
    })
    this.on("callback_query", async (callback) => {
      const callbackName = callback.data
      switch (callbackName) {
        case "user_help":
          console.log("user clicked help")
          this.sendMessage(callback.from.id, helpText,{parse_mode:"Markdown"})
          break
        case "user_quote":
          console.log("user clicked quote")
          const quoteEndpoint = process.env.QUOTE_ENDPOINT
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
          break
        case "user_news":
          console.log("user clicked news")
          const newsEndpoint = process.env.NEWS_ENDPOINT
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
          break
        case "user_quake":
          console.log("user clicked quake")
          const earthQuakeEndPoint = process.env.QUAKE_ENDPOINT
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
              -----------------------\nINFO GEMPA\n-----------------------\n ${Tanggal}||${Jam}\nWilayah: ${Wilayah}\nKedalaman: ${Kedalaman}\nMagnitude: ${Magnitude}\n\nSumber: Badan Meteorologi, Klimatologi, dan Geofisika(BMKG)
              `,
            })
          } catch (err) {
            this.sendMessage(callback.from.id, "Error Fetching Earth Quakes 🙏")
          }
          break
        case "user_halo":
          console.log("user clicked halo")
          this.sendMessage(
            callback.from.id,
            "halo dit ~~~ apa yang ingin kamu lakukan?"
          )
          break
        default:
          console.log(callbackName)
          break
      }
    })
  }
  getProvinces() {
    this.onText(commands.province, async(callback) => {
      console.log(`getProvinces excecuted by  ${callback.from.first_name}`)
      const id = callback.from.id
      const provinceEndpoint = process.env.PROVINSI_ENDPOINT
      try{
        const apiCall = await fetch(provinceEndpoint)
        const {value} = await apiCall.json()
        const province = value.map((prov) => prov.name)
        const verticalList = province.join("\n")

        this.sendMessage(id, `List of ${value.length} Provinces in Indonesia:\n${verticalList}`)
      }
      catch(err) {
        this.sendMessage(id, "Fetching province endpoint failed")
      }
    })
  }
}

module.exports = Bot
