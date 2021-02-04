require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

// apod
app.get('/apod', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
})

// rover manifests and latest images

const rovers = ['spirit', 'opportunity', 'curiosity'];


rovers.forEach(rover => {
    let latestSol = 0
    app.get(`/${rover}`, async (req, res) => {
        try {
            let manifest = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${process.env.API_KEY}`)
                .then(res => res.json())
                .then( manifest => manifest.photo_manifest)
            res.send({ manifest })
        } catch (err) {
            console.log('error:', err);
        }
    })
    app.get(`/${rover}/photos`, async (req, res) => {
        try {
            let pics = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${process.env.API_KEY}`)
                .then(res => res.json())
                //.then( pics => pics.photo_manifest)
            res.send({ pics })
        } catch (err) {
            console.log('error:', err);
        }
    })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))