const Bot = require("./app/Bot")
require("dotenv").config()
const token = process.env.TELE_TOKEN
const options = {
  polling: true,
}

const gempaBot = new Bot(token, options)

//listener for messages whatever it is
// bot.on("message", async (data) => {
//   if (data.text !== "!halo") {
//     const botProfile = await bot.getMe()
//     bot.sendMessage(
//       data.from.id,
//       `Hallo selamat datang di ${botProfile.first_name}\nAda yang bisa dibantu??`
//     )
//   }
// })

//listener for messages sticker
bot.on("sticker", (data) => {
  bot.sendMessage(data.from.id, data.sticker.emoji)
})

bot.onText(/^!halo$/, (data) => {
  bot.sendMessage(data.from.id, "Halo dit~~~")
})

bot.onText(/^!follow(.+)/, (data, after) => {
  bot.sendMessage(data.from.id, `your friend: ${after[1]}`)
})

//fetching quotes api
bot.onText(/^!quote$/, async (data) => {
  const quoteEndpoint = "https://api.kanye.rest/"
  try {
    const apiCall = await fetch(quoteEndpoint)
    const { quote } = await apiCall.json()
    bot.sendMessage(data.from.id, quote)
  } catch (e) {
    bot.sendMessage(data.from.id, "Maaf silahkan ulangi lagi 🙏")
  }

  // console.log(response)
})

//fetching news
bot.onText(/^!news$/, async (data) => {
  const newsEndpoint = "https://jakpost.vercel.app/api/category/indonesia"
  bot.sendMessage(data.from.id, "please wait... ")
  try {
    const apiCall = await fetch(newsEndpoint)
    const { posts } = await apiCall.json()
    for (let i = 0; i < 2; i++) {
      const news = posts[i]
      const { title, image, headline } = news

      bot.sendPhoto(data.from.id, image, {
        caption: `Judul: ${title}\n\nHeadline: ${headline}`,
      })
    }
  } catch (e) {
    bot.sendMessage(data.from.id, "Error fetching category 🙏")
  }
})
