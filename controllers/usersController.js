// getAll, create,  show, update, put/patch, destroy

var User = require('../models/User');

function authorize () {
  const userParams = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    type: req.body.type
  }
  if (!userParams.email || !userParams.password) return res.status(422).json({message: "Invalid Data"});
  User.find({email: userParams.email}, function (err, user) {
    if (user) {
      user.authenticate(userParams.password, function (err, isMatch) {
        if (err) throw err;
        if (!isMatch) return res.status(401).json( {message: "Authorization Failed."});
        res.status(200).json( { user: user, token: user.generateToken() });
      })
    } else {
      user = new User( userParams );
      user.save(function (err, user) {
        if (err) return res.status(422).json({errors: Util.mongooseErrMessages(err)});
        res.status(201).json( {user: user, token: user.generateToken() });
      });
    }
  })
}

// GET
function getAllUser(request, response) {
  User.find( (error, user) => {
    if (error) {
      var res = {
        message: 'User Not Found'
      }
      response.json(res)
      return
    }
    response.render('user', {users: users})
  })
}
// CREATE
function createUser(request, response){
var user = new User();
user.name = request.body.name
user.email = request.body.email
user.password = request.body.password
user.type = "admin";
user.save( error => {
  if (error) {
    return res.json({message: 'Could Not Create User'});
  }
  response.send("success");
});
}


// SHOW
function getUser(request, response) {
  var id = request.params.id;
  User.findById({_id: id}, function(error, listing) {
    if(error) response.json({message: 'Could Not Find User Because' + error});
    response.json({data: user});
  });
}
//Update
function updateUser(request, response) {
  var id = request.params.id;
  User.findById({_id: id}, function(error, user) {
    if(error) response.json({message: 'Could Not Find User Because' + error})
    if(request.body.email) user.email = request.body.email;
    user.save(function(error) {
      if(error) response.json({messsage: 'Could Not Update User Because' + error});
      response.json({message: 'User Updated Successfully'});
    });
  });
}
//Destroy
function removeUser(request, response) {
  var id = request.params.id;
  User.remove({_id: id}, function(error) {
    if(error) response.json({message: 'Could Not Delete User Because' + error});
    response.render('user')
  });
}

module.exports = {
  getAllUser: getAllUser,
  createUser: createUser,
  getUser: getUser,
  updateUser: updateUser,
  removeUser: removeUser,
  authorize: authorize
}
