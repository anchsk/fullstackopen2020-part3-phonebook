require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

const app = express();

app.use(express.static("build"));
app.use(express.json()); //json-parser middleware should be one of the first
//because without it res.body would be an empty object!
app.use(cors());

// Configure logger
morgan.token("content", function (req, res) {
  return JSON.stringify(req.body);
});

// Use logger
app.use(
  morgan(
    ":method :url :status :res[content-length] - :content - :response-time ms"
  )
);

/*let persons = [
  { name: "Jane Smith", number: "333-242424", id: 1 },
  { name: "Ella Weiss", number: "123-242424", id: 2 },
  { name: "Lina Devon", number: "123-141414", id: 3 },
  { name: "Alice Boyd", number: "13-228393", id: 4 },
  { name: "Mae Fay", number: "323-123334", id: 5 },
  { name: "Lisa Dane", number: "323-123334", id: 6 },
];*/

// ROUTES
app.get("/", (req, res) => {
  res.send("<h1>phonebook-backend <br>REST API</h1>");
});

app.get("/info", (req, res) => {
  Person.find({}).then((result) => {
    console.log(result.length);
    res.send(`<p>Phonebook has info for ${result.length} people</p>
 <br>
 <p>${new Date()}</p>`);
  });
});

// GET ALL PERSONS
app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((err) => next(err));
});

// GET PERSON BY ID
app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      // console.log(person)
      if (person) {
        res.json(person);
      } else {
        console.log("404");
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

// DELETE PERSON BY ID
app.delete("/api/persons/:id", (req, res, next) => {
  /*
  const id = Number(req.params.id);

  const person = persons.find((person) => person.id === id);

  //This doesn't really remove the person from the array
  //will be the same on restart
  persons.filter((person) => person.id !== id);

  if (person) {
    console.log("Person deleted");
    res.status(204).end();
  } else {
    res.status(404).end();
  }
  */
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      console.log("204");
      res.status(204).end();
    })
    .catch((err) => next(err));
});

const generateId = () => {
  let newId = Math.floor(Math.random() * 10000);
  return newId;
};

//ADD NEW PERSON
/*
app.post("/api/persons", (req, res) => {

 //sends just name and number
 // console.log(req.body);
  if (!req.body.name) {
    return res.status(400).json({
      error: "content missing",
    });
  }
  if (persons.some((person) => person.name === req.body.name)) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const newPerson = {
    name: req.body.name,
    number: req.body.number,
    id: generateId(),
  };

  // Log the person with the id
  //console.log(newPerson);

  persons = persons.concat(newPerson);

  res.json(newPerson);
});
*/

app.post("/api/persons", (req, res, next) => {
  /* Error handling for the contact  */
  if (req.body.name === undefined) {
    // 400 bad request
    return res.status(400).json({ error: "content missing" });
  }

  const person = new Person({
    name: req.body.name,
    number: req.body.number,
  });
  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson.toJSON());
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  //Here const person is that what we need to update
  const person = {
   // name: req.body.name,
    number: req.body.number,
  };
  // console.log('req.body.id', req.body.id)
  // console.log('req.params', req.params)
  // console.log('req.params.id', req.params.id)
  // console.log("0", person);
  Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true })
    .then((updatedPerson) => {
      // console.log("1", updatedPerson);
      // console.log("2", updatedPerson.toJSON());
      // console.log('PERSONS')
      // Person.find({}).then(result=>console.log(result))
      res.json(updatedPerson.toJSON());
    })
    .catch((err) => next(err));
});
/**
 * It's also important that the middleware for handling unsupported routes
 * is next to the last middleware that is loaded into Express,
 * just before the error handler.
 */

// Cathing requests made to non-existent routes.
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
  console.log(err.name)
  console.log(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
