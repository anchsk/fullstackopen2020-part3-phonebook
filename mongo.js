/**
 * $ node mongo.js <password>
 *
 */

const mongoose = require('mongoose')
/*
if (process.argv.length !== 5) {
 console.log(process.argv)
 console.log(process.argv.length)
  console.log(
    "Please provide the password and/or name and number to add to the phonebook!"
  );
  process.exit(1);
}*/

const password = process.argv[2]

const url = `mongodb+srv://mdbuser:${password}@cluster0-bhnaw.mongodb.net/phonebook_app?retryWrites=true&w=majority`

// eslint-disable-next-line no-unused-vars
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, result => {
  console.log('connected to mdb')
})


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)
/** Model is a constructor function that creates new JavaScript objects
 * based on provided parameters
 */
/*
const person = new Person({
  name: 'Anna',
  number: '342-2938444',
})*/

if (process.argv.length === 3) {

  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {

  let newPerson = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  // eslint-disable-next-line no-unused-vars
  newPerson.save().then((result) => {
    console.log(
      `added ${newPerson.name} number ${newPerson.number} to the phonebook`
    )
    mongoose.connection.close()
  })
}


/* note.save().then((result) => {
  console.log("note saved!");
  mongoose.connection.close();
}); */

// v.2 Fetching objects from the database
/*
Person.find({}).then(result => {
 result.forEach(note => {
   console.log(note)
 })
 mongoose.connection.close()
})
*/
// v.2 search query syntax
/*
Person.find({important: true}).then(result => {
 result.forEach(note => {
   console.log(note)
 })
 mongoose.connection.close()
})*/
