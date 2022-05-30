const express = require('express')
const app = express()
const bodyParser = require('body-parser') // somewhat depricated & built in
const MongoClient = require('mongodb').MongoClient
// what we use to talk to our mongo DataBase - Use MongoDB Atlas 

var db, collection;

// set DB as a variable
const url = "";
const dbName = "";

// API --> listening and generating a response.
// line 15-22 sets up mongo database
app.listen(4040, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

// ejs ??
app.set('view engine', 'ejs')
// throw back to MVC - views are the things the user sees
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))
// public folder and when we request it express handles it for us

// GET request -> '/' = main route/root -> here's the function/code that's going to run
// when building out a route we leave our params as (req, res)
// we are displaying the messages 
// messages stored in the DB -> finding the messages stored in the collection in DB --> find all documents in those collection -> make an array (holds all of our documents/objects from DB in array)

app.get('/', (req, res) => {
  // name of array is result inside this scope
  db.collection('zeldaMessages').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {fact: result})

    // respond with the rendering of our ejs (we've passed all of our array/objects into messages)..which ejs responds with HTML and includes all the content we got back from out database

    // ejs is a templating language -> job is to have a template that we plug data into and then gives us an HTML file that displays to the user. 
    // can't build out data if we hardcode out HTML 
  })
})

// POST Request -> '/' = main route/root -> here's the function/code that's going to run
// we want data stored in the DataBase (used to send data to the server)
// go to DB -> find message collection -> insert one (insertOne) document -> request sends a lot of data -> 
// we can grab everything that gets sent along using the (req, res) params...use req.body.<name> (says Name (in DB): is now equal to name)
// wanna get data from the form SO we can hardcode heart up and heart down

app.post('/zeldaMessages', (req, res) => {
  db.collection('zeldaMessages').insertOne({
    email: req.body.email, 
    msg: req.body.msg, 
    // addHeart: 0,
    favorited: false}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
    // redirect refreshes and triggers new GET request and there will be a new document. Get and post work together.
  })
})

// app.post('/zeldaMessages', (req, res) => {
//   db.collection('zeldaMessages').insertOne({email: req.body.email, msg: req.body.msg, addHeart: 0}, (err, result) => {
//     if (err) return console.log(err)
//     console.log('saved to database')
//     res.redirect('/')

    
//     // insertOne creates the document that happens inside of collection and we're getting that from the request that gets sent along (body.name, body.msg)

//     // redirect refreshes and triggers new GET request and there will be a new document. Get and post work together.
//   })
// })

// PUT - find one and update so add hearts up 
app.put('/zeldaMessages', (req, res) => {
  db.collection('zeldaMessages')
  // updates first mathcing document in the collection that matches 
  .findOneAndUpdate({
    email: req.body.email, 
    msg: req.body.msg}, {
    $set: {
      // addHeart:req.body.addHeart + 1,
      favorited: true
    }
  }, {
    // sorts how it finds things (top to bottom, bottom to top in DB)
    sort: {_id: -1},
    upsert: true
    // tries to find a match so it creates one for you - can be set to false
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

// PUT request 2 - thumps up and hearts down 
// added hearts down same as above but changed to subtract 1
// takes every name 
// app.put('/messagesTDown', (req, res) => {
//   db.collection('messages')
//   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
//     $set: {
//       addHeart:req.body.addHeart - 1,
//       // heartDown:req.body.heartDown - 1, //added at first 
//     }
//   }, {
//     sort: {_id: -1},
//     upsert: true
//   }, (err, result) => {
//     if (err) return res.send(err)
//     res.send(result)
//   })
// })

// DELETE request - trash can to delete messages
// The req. body object allows you to access data in a string or JSON object from the client side. use to receive data through POST and PUT requests in the Express server.

app.delete('/zeldaMessages', (req, res) => {
  db.collection('zeldaMessages').findOneAndDelete({email: req.body.email, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
