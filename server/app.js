require("dotenv").config();
const express = require("express");
const cors = require("cors"); // importiert von package.json, installiert über npm.
const mongoose = require("mongoose");
const Post = require("./models/post"); // Post in Großbuchstaben, weil es eine Convention ist, zeigt dass es sich um eine Mongo-Module handelt.

/*
  We create an express app calling
  the express function.
  Dies ist eigentlich der Server! Ein Server-Object 
*/

const app = express(); //

/*
  We setup middleware to:
  - parse the body of the request to json for us     // der body der Request = die Seite, der Post, der Eintrag nach Id. 
  https://expressjs.com/en/guide/using-middle  ware.html
*/

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  const { method, url } = req;
  console.log("My custom middleware");
  console.log(`${method} ${url} test`);
  next();
});

/*

get all blog posts 
as an array of objects 
in the body of the response. 
das passiert durch den Status Code: 200 OK ! 

Die Funtkion wird immer abgefeuert, wenn ein reqeust-call kommt. 
es muss immer den "Post-path" matchen, 

das db-module hat eine method namens findAll(), das pereits eine fetch-method enthält, 
async in node.js verfasst,; es enthält auch die JSON-Data, die geparsed werden, 
als "posts" returned. 

Das tut man nur hier, normalerweise gäbe es schon eine database. 
Hier handeln wir die get-reqeust! 

findAll = Alle posts in einem Array anzeigen! 

*/

app.get("/posts", (req, res) => {
  Post.find() // find-all-Funktion db.findAll() => wird zu Post.find; ein Filter nach Kriterien wäre: Post.find({ *some content*})
    .then((posts) => {
      res.status(200);
      res.json(posts); // dies kann auch gechained werden.
    })
    .catch((error) => {
      res.status(500);
      res.json({
        error: `Internal Server Error: ${error}`,
      });
    });
});

/* Jetzt muss noch eine post-method kommen, um eine Post-request zu handeln! 
Die reqeust passiert durch die app.use-funktion, die macht den body zu einem javascript-objekt 
aber: wir müssen die post-request anwenden, damit es eine POST-request wird. Zeile 49 ist eine GET-Request. 
IN der Database ist die "Create-Posts-Function"

 */

app.post("/posts", (req, res) => {
  Post.create(req.body) // ohne diese Eingabe wird nichts geschickt! wir setzen einen body fest! Jetzt abgeändert mit dem Mongo-Module.
    .then((newPost) => {
      res.status(201);
      res.json(newPost);
      console.log(newPost);
    })
    .catch((error) => {
      res.status(500);
      res.json({
        error: `Internal Server Error: ${error}`,
      });
    });
});

app.get("/posts/:id", (req, res) => {
  // die Einträge nach ID lesen!
  // const { id } = req.params;

  Post.findById(req.params.id)
    .then((post) => {
      res.status(200);
      res.json(post);
    })
    .catch((error) => {
      res.status(500);
      res.json({
        error: `Internal Server error ${error}`,
      });
    });
});

app.patch("/posts/:id", (req, res) => {
  Post.findByIdAndUpdate(req.params.id, req.body)
    .then((updatePost) => {
      if (updatePost) {
        res.status(200);
        res.json(updatePost);
      } else {
        res.status(400);
        res.json({
          error: `Post with ${id} not found `,
        });
      }
    })
    .catch((error) => {
      res.status(500);
      res.json({ error: `Internal Server error ${error}` });
    });
});

app.delete("/posts/:id", (req, res) => {
  // const { id } = req.params;
  Post.findByIdAndDelete(req.params.id).then((post) => {
    res.status(204);
    res.json(post);
    console.log(`Post with ${id} was deleted`);
  });
});

/*
  We have to start the server. We make it listen on the port 4000

*/

const { PORT } = process.env; // je nachdem, wo unsere app läuft, kann es sein dass ein anderer PORT aufgerufen ist, deswegen braucht es eine neue variable

/*
{
USER: "ich", 
COMMAND_MODE: "unix2003",
}
*/

mongoose.connect("mongodb://localhost/zone1", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const mongodb = mongoose.connection;

mongodb.on("open", () => {
  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`); // es könnte auch PORT.process.env heißen
  });
});
