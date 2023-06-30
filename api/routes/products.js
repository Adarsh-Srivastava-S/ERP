const express = require('express');
const { route } = require('../../app');
const router = express.Router();
const mongoose=require('mongoose');
const checkAuth= require('../middleware/check-auth')
const Product= require('../models/product');

/**
 * @swagger
 * /products/:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     description: Retrieve all products from the database.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.get('/',checkAuth,(req,res,next)=>{
   Product.find().exec().then(docs => {
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
 * /products/:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *             example:
 *               name: Product 1
 *               price: 9.99
 *     responses:
 *       201:
 *         description: Created Product Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 createdProduct:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     request:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                         url:
 *                           type: string
 *             example:
 *               message: Created Product Successfully
 *               createdProduct:
 *                 _id: "1234567890"
 *                 name: Product 1
 *                 price: 9.99
 *                 request:
 *                   type: GET
 *                   url: "http://localhost:3000/products/1234567890"
 */

router.post('/',checkAuth,(req,res,next)=>{
   
    const product=new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description:req.body.description,
        price: req.body.price
    });
    product.save().then(result =>{
        console.log(result);
        res.status(201).json({
            message: 'Created Product Successfully',
            createdProduct:{
                _id:result.id,
                name:result.name,
                price: result._id,
                request:{
                    type:'GET',
                    url:"http://localhost:3000/products/"+result._id
                }

            }
    })
       
    });
});
/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 _id:
 *                   type: string
 *             example:
 *               name: Product 1
 *               price: 9.99
 *               _id: 1234567890
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: No valid entry found for provided ID
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/:productId',checkAuth,(req,res,next)=>{
    const id=req.params.productId;
    Product.findById(id)
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
 * /products/{productId}:
 *   patch:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product
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
 *             example:
 *               - propName: name
 *                 value: New Product Name
 *               - propName: price
 *                 value: 19.99
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 n:
 *                   type: number
 *                 nModified:
 *                   type: number
 *                 ok:
 *                   type: number
 *             example:
 *               n: 1
 *               nModified: 1
 *               ok: 1
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.patch('/:productId',checkAuth,(req,res,next)=>{
    const id=req.params.productId;
    const updateOps={};
     for (const ops of req.body ){
         updateOps[ops.propName]=ops.value;
     }
    // {name: req.body.newName,price: req.body.newPrice}
     Product.updateOne({_id:id},{$set:updateOps}).exec().then(result =>{
        res.status(200).json(result);
    }).catch(err=> {
        console.log(err);
        res.status(500).json({error:err})
    });
});
/**
 * @swagger
 * /products/{productId}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []     
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 n:
 *                   type: number
 *                 ok:
 *                   type: number
 *                 deletedCount:
 *                   type: number
 *             example:
 *               n: 1
 *               ok: 1
 *               deletedCount: 1
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.delete('/:productId',checkAuth,(req,res,next)=>{
    const id=req.params.productId;
    Product.deleteOne({_id:id}).exec().then(result =>{
        res.status(200).json(result);
    }).catch(err=> {
        console.log(err);
        res.status(500).json({error:err})
    });
  });
module.exports = router;
