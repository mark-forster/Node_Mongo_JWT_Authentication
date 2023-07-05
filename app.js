const express = require('express');
const morgan = require('morgan');
const httperrors=require('http-errors');
const app= express();
const mongoose = require('mongoose');
require('dotenv').config();
const AuthRoute= require('./routes/auth.route');
const bodyParser = require('body-parser');
const {verifyAccessToken}= require('./utils/jwt');
app.use(morgan('dev'));




app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect(process.env.DB_URL,
    { useNewUrlParser: true,
      useUnifiedTopology: true
    })
.then(()=>{
    console.log('connected to database');
})




app.get('/', verifyAccessToken, async (req, res) => {
    res.send('hello from express');
});
app.use('/api/auth',AuthRoute);


app.use(async (req, res,next)=>{
    // const error= new Error('Not Found');
    // error.status=404;
    // next(error);
    next(httperrors.NotFound('Page Not Found'));
});

app.use(async(err,req,res,next)=>{
    res.status(err.status || 500);
   return res.send({
      error:{
        status:err.status || 500,
        error_msg:err.message
      }
    })
})


app.listen(process.env.PORT || 3000,()=>{
    console.log('server is running');
});