const express = require('express');
const { route } = require('../../app');
const router = express.Router();
const mongoose=require('mongoose');
const bcrypt= require('bcrypt');
const User=require('./../models/user')
const jwt= require('jsonwebtoken')


/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNo:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *                email: user@examplee.com
 *                firstName: Robin
 *                lastName: Hood
 *                password: password123
 * 
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 Result:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *             example:
 *               message: User created
 *               Result:
 *                 _id: 1234567890
 *                 email: user@examplee.com
 *                 firstName: Robin
 *                 lastName: Hood
 *                 phoneNo: 78564567
 *       409:
 *         description: Mail exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: Mail exists
 */
router.post('/signup',(req,res,next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length>=1)
        {
            return res.status(409).json({
                message:'Mail exists'

            });
        }else{
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err){
                    return res.status(500).json({
                        error:err
                    })
                }else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        phoneNo: req.body.phoneNo
                
                    });
                    user
                        .save()
                        .then(result=>{
                            console.log(result);
                            res.status(201).json({
                                message:'User created',
                                Result:result
                            })
                        })
                        .catch(err=>{
                            console.log(err);
                            res.status(500).json({
                                error:err
                            });
                        })
                    
                }
            })
        }
    })
    
    
    
});
/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: user@example.com
 *               password: password123
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *             example:
 *               message: Auth Successful
 *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJ1c2VySWQiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.4k4LUwA-V4IDrFpHGn4b6Tq2h9_Qv6oLbbz5zUMgjR8
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: Auth failed
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
router.post('/login',(req,res,next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length<1)
        {
            return res.status(401).json({
                message:'Mail Not found, user doesn\'t exist'

            });
        }
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
            if(err){
                return res.status(401).json({
                    message:'Auth failed'
    
                });
            }
            if(result){
                const token=jwt.sign({
                    email:user[0].email,
                    userId:user[0].userId
                },process.env.JWT_KEY,
                {
                    expiresIn:"1h"
                })
                return res.status(200).json({
                    messaege: 'Auth Successful',
                    token:token
                })
            }
            return res.status(401).json({
                message:'Auth failed'

            });
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    })
});
/**
 * @swagger
 * /user/{userId}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 Data:
 *                   $ref: '#/components/schemas/User'
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
router.delete('/:userId',(req,res,next)=>{
    User.deleteOne({_id:req.params.userId})
        .exec()
        .then(result =>{
            res.status(200).json({
                message:"User Deleted",
                Data : result
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        })
        
})
module.exports = router;
