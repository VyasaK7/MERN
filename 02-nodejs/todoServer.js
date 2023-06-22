const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

let listOfTodos = [];

function createID() {
  if(listOfTodos.length===0){
    return 1;
  }
  return listOfTodos.at(-1).id+1;
}

app.get("/todos", (req, res) => {
  res.send(listOfTodos);
});

app.get("/todos/:id", (req, res) => {
  let no = parseInt(req.params.id, 10);
  listOfTodos.forEach((listItem) => {
    if (listItem.id === no) {
      res.send(listItem);
    }
  });
  res.status(404).send();
});

app.post("/todos", (req, res) => {
  let newTitle = req.body.title;
  let newDescription = req.body.description;
  if (!newTitle || !newDescription) {
    res.status(400).send("Title and description are required");
    return;
  }
  let newId = createID();
  let newToDoItem = {
    id: newId,
    title: newTitle,
    description: newDescription,
    completed: "false"
  };
  listOfTodos.push(newToDoItem);
  res.status(201).json({ id: newToDoItem.id });
});

app.put("/todos/:id",(req,res)=>{
  let newId = parseInt(req.params.id,10);
  // let newTitle = req.body.title;
  // let newDescription = req.body.description;
  // let newStatus = req.body.completed;
  listOfTodos.forEach(item => {
    if (item.id === newId) {
      item.completed = "true";
      res.status(200).send();
    }
  })
  res.status(404).send("Id not found. Please enter the correct ID");
})

app.delete("/todos/:id", (req, res) => {
  const idToDelete = parseInt(req.params.id, 10);
  const index = listOfTodos.findIndex((item) => item.id === idToDelete);
  if (index !== -1) {
    listOfTodos.splice(index, 1);
    res.status(200).send("Todo item deleted successfully.");
  } else {
    res.status(404).send("Id not found. Please enter the correct ID.");
  }
});


app.listen(3000, () => console.log("Server Started on Port 3000"));

module.exports = app;
