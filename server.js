'use strict'

//importing 3rd party libraries
const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


// Modularize routes to /blog-posts
const {BlogPosts} = require('./models');

//creates the new express app, no need to server up static assets as there are none
const app = express();


//log the http layer
app.use(morgan('common'));

//Adding some blog post to test functionality
BlogPosts.create("Cats are super", "BlahBlah1", "Cathy Caterson");
BlogPosts.create("Dogs are great", "BlahBlah2", "Danny Doggery");
BlogPosts.create("Bunnies are snuggly", "BlahBlah3", "Bonnie Bunyon");
BlogPosts.create("Snakes are slithery", "BlahBlah4", "Seth Slitheran");


//when this route is called, return the blog post
app.get('/blog-posts', (req, res) => {
  res.json(BlogPosts.get());
});

//when this route is called, returned blog is updated with user changes
app.post('/blog-posts', jsonParser, (req, res) => {
  const requiredFields =  ['title', 'content', 'author'];
  for(let i = 0; i<requiredFields.length; i++) {
    if(!(requiredFields[i] in req.body)) {
      const errorMessage = (`Missing \`${requiredFields[i]}\` in request body`);
      console.error(errorMessage);
      return res.status(400).send(errorMessage);
    }
  }
  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author)
  res.status(201).json(item);
});

//when this route is called, returned blog is updated to remove the item specified
app.delete('/blog-posts/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog ${req.params.id}`);
  res.status(204).end();
});

// when route is called,
// app.put('/blog-posts/:id', (req, res) => {
//
// });

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`)
});
