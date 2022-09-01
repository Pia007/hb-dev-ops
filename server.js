const express = require('express')
const app = express();
// install cors
const cors = require('cors')
const path = require('path')

app.use(express.json());
//config app to use cors
app.use(cors());

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
    accessToken: '5f1d0ee27f7942da9f2f992d9a8ed3ec',
    captureUncaught: true,
    captureUnhandledRejections: true,
});

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

const students = ['Jimmy', 'Timothy', 'Jimothy']

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
    //let us know that code is access
    rollbar.log("Someone Accessed HTML successfully");
    
})

app.get('/api/students', (req, res) => {
    rollbar.info("Someone got the students to populate")
    res.status(200).send(students);
    
    
})

app.post('/api/students', (req, res) => {
    let {name} = req.body

    const index = students.findIndex(student => {
        return student === name
    })

    try {
        if (index === -1 && name !== '') {
            students.push(name)

            // log and object 
            rollbar.log("Student added successfully", { author: "Pia", type: "manually"});
            
            res.status(200).send(students)
        } else if (name === ''){
            // rollbar error
            rollbar.error("No name provied");
            res.status(400).send('You must enter a name.')
        } else {
            // rollbar error
            rollbar.error("Student already exists")
            res.status(400).send('That student already exists.')
        }
    } catch (err) {
        console.log(err)
    }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    //
    rollbar.info("Student was deleted");
    students.splice(targetIndex, 1)
    res.status(200).send(students)
})

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Server listening on ${port}`))
