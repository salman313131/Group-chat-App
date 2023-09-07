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
        const localStorageData = localStorage.getItem('chat')
        const localStorageChats = JSON.parse(localStorageData)
        const response = await axios.get(`/api/v1/chat/:${localStorageChats[localStorageChats.length-1].id}`,{headers})
        displayChats(localStorageChats,response.data)
    } catch (error) {
        console.log(error)
    }
}


function displayChats(localdata,data){
    items.innerHTML=''
    for(let i=0;i<localdata.length;i++){
        const li = document.createElement('li')
        if(localdata[i].userId == data.currentUser){
            li.textContent = `You : ${localdata[i].chat}`
        }else{
            li.textContent = `${localdata[i].name} : ${localdata[i].chat}`
        }
        items.appendChild(li)
    }
    for(let i=0;i<data.chats.length;i++){
        const li = document.createElement('li')
        if(data.chats[i].userId == data.currentUser){
            li.textContent = `You : ${data.chats[i].chat}`
        }else{
            li.textContent = `${data.chats[i].name} : ${data.chats[i].chat}`
        }
        items.appendChild(li)
    }
    localdata.push(...data)
    const startIndex = localdata.length > 10 ? localdata.length - 10 : 0;
    localStorage.setItem('chat',localdata.slice(startIndex))
}

setInterval(fetchingData, 1000);