const express = require("express");
const morgan = require("morgan")
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());


morgan.token('content', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :content - :response-time ms'))

let persons = [
  { name: "Jane Smith", number: "333-242424", id: 1 },
  { name: "Ella Weiss", number: "123-242424", id: 2 },
  { name: "Lina Devon", number: "123-141414", id: 3 },
  { name: "Alice Boyd", number: "13-228393", id: 4 },
  { name: "Mae Fay", number: "323-123334", id: 5 },
  { name: "Lisa Dane", number: "323-123334", id: 6 },
];

// ROUTES
app.get("/", (req, res) => {
  res.send("<h1>phonebook-backend <br>REST API</h1>");
});

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
 <br>
 <p>${new Date()}</p>`);
});

// GET ALL PERSONS
app.get("/api/persons", (req, res) => {
 //console.log(req.body)
  res.json(persons);
});

// GET PERSON BY ID
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

// DELETE PERSON BY ID
app.delete("/api/persons/:id", (req, res) => {
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
});

const generateId = () => {
  let newId = Math.floor(Math.random() * 10000);
  return newId;
};

//ADD NEW PERSON
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

// Cathing requests made to non-existent routes.

const unknownEndpoint = (request, response) => {
 response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
