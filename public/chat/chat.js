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
        li.textContent = `You : ${msg.value}`
        items.appendChild(li)
        msg.value = ''
    } catch (error) {
        console.log(error)
    }
})

async function fetchingData(){
    try {
        const response = await axios.get('/api/v1/chat/getall',{headers})
        displayChats(response.data)
    } catch (error) {
        console.log(error)
    }
}


function displayChats(data){
    items.innerHTML=''
    for(let i=0;i<data.chats.length;i++){
        const li = document.createElement('li')
        if(data.chats[i].userId == data.currentUser){
            li.textContent = `You : ${data.chats[i].chat}`
        }else{
            li.textContent = `${data.chats[i].name} : ${data.chats[i].chat}`
        }
        items.appendChild(li)
    }
}

setInterval(fetchingData, 1000);