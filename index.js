const express = require('express')
const uuid = require('uuid')
const port = 3002
const app = express()
app.use(express.json())

// MIDDLEWARES - Serve para INTERCEPTAR as nossas requisições e tem o poder de PARAR ou ALTERAR dados da requisição

const users = []

const checkUserId = (request, response, next) => {
    const {id} = request.params

    const index = users.findIndex(user => user.id === id)

    if(index < 0){
        return response.status(404).json({error:"User not found"})
    }

    request.userIndex = index
    request.userId = id

    next()
}

app.get('/users' , (request , response)=>{
    return response.json(users)

})

app.post('/users' , (request , response)=>{
    const { name , age } = request.body
   
    const user = { id:uuid.v4(), name, age }

    users.push(user)

    return response.status(201).json(user)
  
   
})

app.put('/users/:id' ,checkUserId, (request , response)=>{
    const {name, age} = request.body
    const index = request.userIndex
    const id = request.userId

    const updateUsers = {id, name, age}

  
    users[index] = updateUsers

    return response.status(202).json(updateUsers)

})

app.delete('/users/:id' , checkUserId, (request , response)=>{
    const index = request.userIndex

    users.splice(index,1)

    return response.status(204).json()

})

app.listen(port, ()=>{
    console.log(`🚀 Server is runing at port ${port}`)
})