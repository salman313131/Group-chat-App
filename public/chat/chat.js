const items = document.getElementById('items')
const token = localStorage.getItem('token')
const button = document.getElementById('sendButton')
const headers = {
        'Content-Type': 'application/json',
        'Authorization': token 
};

document.addEventListener('DOMContentLoaded',async ()=>{
    try {
        const response = await axios.get('/api/v1/chat/get',{headers})
        console.log(response)
        const li = document.createElement('li')
        li.textContent = `${response.data.name} joined`
        items.appendChild(li)
    } catch (error) {
        console.log(error)
    }
})

button.addEventListener('click',async(e)=>{
    e.preventDefault()
    try {
        const msg = document.getElementById('inputData')
        const response = await axios.post('/api/v1/chat/message',{chat:msg.value},{headers})
        const li = document.createElement('li')
        li.textContent = `${response.data.name} : ${msg.value}`
        items.appendChild(li)
        msg.value = ''
    } catch (error) {
        console.log(error)
    }
})

document.addEventListener('DOMContentLoaded',async()=>{
    try {
        const response = await axios.get('/api/v1/chat/getall',{headers})
    } catch (error) {
        console.log(error)
    }
})