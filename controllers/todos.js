const Todo = require('../models/Todo')
const User = require('../models/User')

module.exports = {
    getTodos: async (req, res) => {
        // console.log(req.user)
        try {
            const todoItems = await Todo.find({ userId: req.user.id })
            const itemsLeft = await Todo.countDocuments({
                userId: req.user.id,
                completed: false
            })
            res.render('todos.ejs', {
                todos: todoItems,
                left: itemsLeft,
                user: req.user
            })
        } catch (err) {
            console.log(err)
        }
    },
    shareTodo: async (req, res) => {
        // console.log(req.user)
        // console.log(req.user.userName)
        try {
            const shareCreator = req.user.userName
            const shareCreatorId = req.user._id // MongoDb User Id for creator of the share
            const shareRecipient = req.body.shareReceiver // userName used to search DB from form
            // function to search the DB and find a userName that matches input from form, responds with entire user object
            const recipientData = await User.findOne({
                userName: shareRecipient
            })
            // creating a todo for the recipient of the todo
            await Todo.create({
                todo: 'Sharing todo test', // this is a test todo item will change later
                completed: false,
                userId: recipientData._id, // Mongo DB Id for recipient
                sharedId: shareCreatorId // Added a share creator id for later use
            })
            console.log(
                `${shareCreator} has shared ${todo} todo with ${shareRecipient}`
            )
            res.redirect('/todos')
        } catch (err) {
            console.log(err)
        }
    },
    createTodo: async (req, res) => {
        try {
            await Todo.create({
                todo: req.body.todoItem,
                completed: false,
                userId: req.user.id
            })
            console.log('Todo has been added!')
            res.redirect('/todos')
        } catch (err) {
            console.log(err)
        }
    },
    markComplete: async (req, res) => {
        try {
            await Todo.findOneAndUpdate(
                { _id: req.body.todoIdFromJSFile },
                {
                    completed: true
                }
            )
            console.log('Marked Complete')
            res.json('Marked Complete')
        } catch (err) {
            console.log(err)
        }
    },
    markIncomplete: async (req, res) => {
        try {
            await Todo.findOneAndUpdate(
                { _id: req.body.todoIdFromJSFile },
                {
                    completed: false
                }
            )
            console.log('Marked Incomplete')
            res.json('Marked Incomplete')
        } catch (err) {
            console.log(err)
        }
    },
    deleteTodo: async (req, res) => {
        console.log(req.body.todoIdFromJSFile)
        try {
            await Todo.findOneAndDelete({ _id: req.body.todoIdFromJSFile })
            console.log('Deleted Todo')
            res.json('Deleted It')
        } catch (err) {
            console.log(err)
        }
    }
}
