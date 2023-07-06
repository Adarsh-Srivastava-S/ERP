const express = require('express');
const { route } = require('../../app');
const router = express.Router();
const mongoose=require('mongoose');
const checkAuth= require('../middleware/check-auth')
const Todos= require('../models/todos');
/**
 * @swagger
 * /todos/:
 *   get:
 *     summary: Retrieve all Todos.
 *     tags: [todos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of Todos.
 *       '500':
 *         description: Internal server error.
 */
router.get('/',(req,res,next)=>{
    Todos.find().exec().then(docs => {
     console.log(docs);
     res.status(200).json(docs);
    }).catch(err=>{
     console.log(err);
     res.status(500).json({
         error:err
     });
 
    });
 });
 /**
 * @swagger
 * /todos/:
 *   post:
 *     summary: Create a new Todo.
 *     tags: [todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *             example:
 *               title: Todos 1
 *               description: This is final work
 *               _id: 1234567890
 *     responses:
 *       '201':
 *         description: Todo created successfully.
 *       '500':
 *         description: Internal server error.
 */

 router.post('/',(req,res,next)=>{
   
    const todos=new Todos({
        
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        date: req.body.date
    });
    todos.save().then(result =>{
        console.log(result);
        res.status(201).json({
            message: 'Created Todos Successfully',
            createdTodos:{
                _id:result.id,
                title: result.title,
                description: result.description,
                date: result.date,
                request:{
                    type:'GET',
                    url:"http://localhost:3000/todos/"+result._id
                }

            }
    })
       
    });
});
/**
 * @swagger
 * /todos/{todosId}:
 *   get:
 *     summary: Get a Todo by ID.
 *     tags: [todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: todosId
 *         in: path
 *         description: ID of the Todo.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the Todo.
 *       '404':
 *         description: Todo not found.
 *       '500':
 *         description: Internal server error.
 */
router.get('/:todosId',(req,res,next)=>{
    const id=req.params.todosId;
    Todos.findById(id)
    .select('name price _id')
    .exec()
    .then(doc =>{
        console.log("From Database",doc);
        // res.status(200).json(doc);
        if(doc){
            res.status(200).json(doc);
        }
        else{
             res.status(404).json({message:"No valid entry found for provide ID"});
        }
    }).catch(err=> {
        console.log(err);
        res.status(500).json({error:err})
    });
});
/**
 * @swagger
 * /todos/{todosId}:
 *   patch:
 *     summary: Update a Todo by ID.
 *     tags: [todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: todosId
 *         in: path
 *         description: ID of the Todo.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 propName:
 *                   type: string
 *                 value:
 *                   type: string
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the updated Todo.
 *       '500':
 *         description: Internal server error.
 */
router.patch('/:todosId',(req,res,next)=>{
    const id=req.params.todosId;
    const updateOps={};
     for (const ops of req.body ){
         updateOps[ops.propName]=ops.value;
     }
    // {name: req.body.newName,price: req.body.newPrice}
     Todos.updateOne({_id:id},{$set:updateOps}).exec().then(result =>{
        res.status(200).json(result);
    }).catch(err=> {
        console.log(err);
        res.status(500).json({error:err})
    });
});
/**
 * @swagger
 * /todos/{todosId}:
 *   delete:
 *     summary: Delete a Todo by ID.
 *     tags: [todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: todosId
 *         in: path
 *         description: ID of the Todo.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the deletion result.
 *       '500':
 *         description: Internal server error.
 */

router.delete('/:todosId',(req,res,next)=>{
    const id=req.params.todosId;
    Todos.deleteOne({_id:id}).exec().then(result =>{
        res.status(200).json(result);
    }).catch(err=> {
        console.log(err);
        res.status(500).json({error:err})
    });
  });
  module.exports = router;