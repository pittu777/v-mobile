const Todo = require("../models/todoModel");


const getTodos = async(req,res)=>{
    try{
        const todos = await Todo.find();
        res.status(200).json(todos)
    }catch(error){
        res.status(500).json({message:error.message})
    }
};

const createTodo = async (req, res) => {
    try {
      const { title } = req.body;
      const todo = new Todo({ title });
      await todo.save();
      res.status(201).json(todo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
const deleteTodo = async(req,res)=>{
  try{
    const {id} = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if(!deletedTodo){
      return res.status(404).json({message:"todo not found"})
    }
    res.status(200).json({message:"deleted successfully"})
  }catch(error){
    console.log("error while deleteing", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, completed },
      { new: true } // Return the updated document
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    console.log("Error while updating:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {getTodos,createTodo,deleteTodo, updateTodo};