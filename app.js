const express = require('express');
const app =express();
const bodyParser=require('body-parser');
const mongoose =require('mongoose');
const productRoutes=require('./api/routes/products');
const checkAuth= require('./api/middleware/check-auth');
const todosRoutes=require('./api/routes/todos');
const swaggerJSDoc = require ('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express');
const userRoutes=require('./api/routes/user')
//MongoDB Connectivity
mongoose.connect('mongodb+srv://adarshsri800:vpZgPAeA1Hh1mD6Q@erpcluster.1vbdgbl.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

//Swagger Ui
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Node JS API Project',
        version: '1.0.0'
      },
      servers: [
        {
          url: 'http://localhost:3000/'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    },
    apis: ['./api/routes/products.js', './api/routes/user.js', './api/routes/todos.js']
  };
  
const swaggerSpec= swaggerJSDoc(options)
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

 
//Diffrent routes
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))
app.use('/products',productRoutes);
app.use("/user",userRoutes);
app.use("/todos",todosRoutes);

module.exports=app;