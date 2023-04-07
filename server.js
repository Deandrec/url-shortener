// set up server
const express = require("express");
const mongoose = require('mongoose')
const app = express();
const ShortUrl = require("./models/shortUrl.js")
// connect to data base
mongoose.connect('mongodb://localhost/urlShortener', {
  useNewUrlParser: true, useUnifiedTopology: true
})

//set view template
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

// routes
app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})
//post route, save short url to data base
app.post("/shortUrls", async (req, res)=>{
    await ShortUrl.create({ full: req.body.fullUrl })

    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)
  
    shortUrl.clicks++
    shortUrl.save()
  
    res.redirect(shortUrl.full)
  })
// to run server
app.listen(process.env.PORT || 5001)