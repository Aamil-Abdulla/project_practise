const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

function adminAuthentication(req,res,next){
  const admin = ADMINS.find(a=>a.username === username && a.password === password )
  if (admin){
    next()
  }
  else{
    res.status(403).json({message: 'Admin aunthentication failed' })
  }
}

function userAuthentication(req,res,next){
  const user = USERS.find(u=>u.username === username && u.password === password)
  const {username ,password} = req.headers
  if (user) {
    req.user = user
    next()
  }
  else{res.status(200).json({message:'User authentication is invalid'})}
}
// Admin routes
app.post('/admin/signup', (req, res) => {

  const admin = req.body
  const existingAdmin = ADMINS.find(a=>a.username === admin.username)
  
  if (existingAdmin){
    res.status(403).json({message : 'The admin is already signed in'})
  }
  else{
    ADMINS.push(admin)
    res.json(201).json({message : 'it is successfully created'})
  }
});

app.post('/admin/login', adminAuthentication, (req, res) => {
  res.json({message  : " Logged in Succesfully"})
});

app.post('/admin/courses', adminAuthentication, (req, res) => {
  const course = req.body;
  course.id = Date.now()
  if (!course.title){
    res.status(411).json({message : "please give the title"})
  }
    COURSES.push(course)
    res.status(201).json({message : 'the course is succesfully created', courseId : course.id })
  }
);

app.put('/admin/courses/:courseId',adminAuthentication,(req, res) => {
  const courseId = parseInt(req.params.courseId)
  const course =  COURSES.find(c=>c.courseId === courseId)
  if (course) {
    Object.assign(course,req.body)
    res.json({message: "Course updated Succesfuly" })    
  }
  else{
    res.status(403).json("Course not found")
  }
});

app.get('/admin/courses',adminAuthentication, (req, res) => {
  res.json({courses : COURSES})
});

// User routes
app.post('/users/signup', (req, res) => {
  const userExist = USERS.find(u=>u.username === username && u.password === password)
  if (userExist){
    res.status(403).json({message : "User already Signed up"})
  }
  else{
    const user = {... req.body,purchasedCourses : []}
    USERS.push(user)
    res.status(201).json({message : "User succesfully Signed up"})

  }
});

app.post('/users/login',userAuthentication ,(req, res) => {
  const user = req.body
  res.status(200).json({message : "User logged in succesfully"})

}); 

app.get('/users/courses',userAuthentication, (req, res) => {
  COURSES.filter(c=> c.published)
  res.json({course : COURSES})
});

app.post('/users/courses/:courseId',userAuthentication, (req, res) => {
  const courseId = Number(req.params.courseId)
  const course = COURSES.find(c=>c.id === courseId && c.published)
  if (course){
    req.user.purchasedCourses.push(courseId)
    res.json({message : "Course is succesfully purchased"})
  } 
  else{
    res.status(404).json({message : "THE Course is not found or it is not available"})
}});

app.get('/users/purchasedCourses',userAuthentication, (req, res) => {
  const purchasedCourses = COURSES.filter(c=>req.user.purchasedCourses.includes(c.id))
  res.json({purchasedCourses})
  });

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
