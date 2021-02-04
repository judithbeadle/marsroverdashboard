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

// rover manifests data

app.get('/manifests/spirit', async (req, res) => {
    try {
        let rover = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/spirit?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
            .then( rover => rover.photo_manifest)
        res.send({ rover })
    } catch (err) {
        console.log('error:', err);
    }
})
app.get('/manifests/opportunity', async (req, res) => {
    try {
        let rover = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/opportunity?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
            .then( rover => rover.photo_manifest)
        res.send({ rover })
    } catch (err) {
        console.log('error:', err);
    }
})
app.get('/manifests/curiosity', async (req, res) => {
    try {
        let rover = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
            .then( rover => rover.photo_manifest)
        res.send({ rover })
    } catch (err) {
        console.log('error:', err);
    }
})



// TODO rover photos


app.listen(port, () => console.log(`Example app listening on port ${port}!`))