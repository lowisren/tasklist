var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');
var path = require('path');
var router = express.Router();


//Bring in Db Models
require('../models/task');
require('../models/user');

var Task = mongoose.model('tasks');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}


router.get('/', ensureAuthenticated, function(req, res){
    console.log(req.session.passport.user);
    var User = mongoose.model('users'), userData;
    User.find({ _id: req.session.passport.user}, function(err, user){
      console.log(user);
      userData = user; return true;
    });
    console.log(userData);
    Task.find({user: req.session.passport.user}), function(err, result) {
      if (err) {
      return console.log(err);
      }
      res.render('index', {task: result, user: userData});
  };
});

router.get('/tasks', ensureAuthenticated, function(req, res, next) {
   Task.find(function(err, tasks) {
        if(err){
          return console.log(err);
        }
        else{
              if (Array.isArray({task: 1, _id: 0}))
                return tasks.length;
            
            var html = `<html lang="en">
          <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>PNTS-TSK LST|API</title>

           <!-- Latest compiled and minified CSS -->
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
            <link rel="stylesheet" href="/css/style.css" />
            <style>
                p { background: #C1CDC1; }
                #tasks{ background: #D3D3D3;
                       color: #003300;
                       font-variant: small-caps;
                       font-weight: 500;
                       margin-left: auto;
                       margin-right:auto;
                       width: 80%;
                       max-width: 600px; 
                       }
            </style>
          </head>
          <body>
             <!-- Collect the nav links, forms, and other content for toggling -->
            <nav class="navbar navbar-inverse">
              <div class="container-fluid">
                <!-- Brand and toggle get grouped for better mobile display -->
                <div class="navbar-header">
                  <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#inverseNavbar1" aria-expanded="false"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>
                  <a class="navbar-brand" href="/tasks">
                    <img src="/images/trousers_logo.png" width="20" height="40"/>
                    <h5>PANTS TASK SERVICES</h5>
                  </a>
                </div>
                    <!-- Collect the nav links, forms, and other content for toggling -->
                  <div class="collapse navbar-collapse" id="inverseNavbar1">
                    <ul class="nav navbar-nav navbar-right">
                        <li><a href="/">TSK LIST</a></li>
                        <li><a href="/users/logout">Logout</a></li>
                        <li><a href="/users/login">Login</a></li>
                        <li><a href="/users/register">Register</a></li>
                    </ul>
                    </div>
                    <!-- /.navbar-collapse -->
              </div>
                <!-- /.container-fluid -->
                  </nav>
                  <div class="container-fluid">
                  <h3 class="text-muted">PANTSLAND - TO/DO LIST</h3>
                            <h2 class="page-header">TSK LIST</h2>
                    
                    <div class="form-group"> 
                    <form action="/tasks" method="post">
                        <input type="text" class="form-control" placeholder="enter task" name="task">
                        <button id="btnTask"class="btn btn-default" type="submit">Submit</button>
                    </form>
                    </div>
                </div>
                  
                </div>
            </div> <!-- /container -->
            <footer class="footer">
                  <h4>Lauren Etheridge</h4>
                  <h5>ITD212 | Programming Assignment 3 | Task List API</h5>
                </footer>
            <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
              <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
              <!-- Include all compiled plugins (below), or include individual files as needed -->
              <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script></body></html>`;
            var i;
            for(i = 0; i < tasks.length; i++)
            {
              html = html + `<div class="card">
                            <div class="card-block">
                            <div="list-group">
                                <h4 id="tasks" class="text-muted list-group-item">`+tasks[i].task + 
                                `</h4></div></div></div>`;
            }                
            res.send(html);
        }
}); //end find
});

router.post('/tasks', function (req, res){
  new Task({task:req.body.task, user: req.session.passport.user}).save(
    function(err, document) {
    if(err) 
    {
      return console.log(err);
    }
    else
    {
      console.log(req.body.task + " is saved to the list");
    }
    res.redirect('/tasks');
  });
});


module.exports = router;