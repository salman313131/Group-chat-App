const items = document.getElementById('items')
const token = localStorage.getItem('token')
const button = document.getElementById('sendButton')
const groupListButton = document.getElementById('add-Buttons')
const createGroupButton = document.getElementById('create-group-column')
const createGroupForm = document.getElementById('create-group-form')
const inputContainer = document.getElementById('input-container')

const headers = {
        'Content-Type': 'application/json',
        'Authorization': token 
};

document.addEventListener('DOMContentLoaded',async ()=>{
    try {
        const response = await axios.get('/api/v1/group/getgroup',{headers})
        console.log(response.data.groups)
        for(let i=0;i<response.data.groups.length;i++){
            const button = document.createElement('button')
            button.id = response.data.groups[i].id
            button.textContent = response.data.groups[i].name
            button.classList.add('groupButton')
            groupListButton.appendChild(button)
        }
    } catch (error) {
        console.log(error)
    }
})

button.addEventListener('click',async(e)=>{
    e.preventDefault()
    try {
        const groupId = localStorage.getItem('group')
        const msg = document.getElementById('inputData')
        const response = await axios.post('/api/v1/chat/message',{chat:msg.value,groupId:groupId},{headers})
        const li = document.createElement('li')
        li.textContent = `You : ${msg.value}`
        items.appendChild(li)
        msg.value = ''
    } catch (error) {
        console.log(error)
    }
})


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
    for(let i=0;i<data.data.length;i++){
        const li = document.createElement('li')
        if(data.data[i].userId == data.currentUser){
            li.textContent = `You : ${data.data[i].chat}`
        }else{
            li.textContent = `${data.data[i].name} : ${data.data[i].chat}`
        }
        items.appendChild(li)
    }
    const newData = [...localdata,...data.data]
    const startIndex = newData.length > 10 ? newData.length - 10 : 0;
    storageData = JSON.stringify(newData.slice(startIndex))
    localStorage.setItem('chat',storageData)
}


//adding group
createGroupButton.addEventListener('click',createGroup)

function createGroup(e){
    e.preventDefault()
    items.style.display = 'none'
    createGroupForm.style.display = ''
}

//create group form
createGroupForm.addEventListener('submit',groupCreated)

async function groupCreated(e){
    e.preventDefault()
    const gname = document.getElementById('gname')
    const gmembers = document.getElementById('gmembers')
    const members = gmembers.value.split(',')
    const data = {
        name:gname.value
    }
    await axios.post('/api/v1/group/create',data,{headers})
    createGroupForm.style.display = 'none'
    items.style.display = ''
    alert('group created')
}

//group button list
groupListButton.addEventListener('click',chatScreen)

async function chatScreen(e){
    e.preventDefault()
    if(e.target.classList.contains('groupButton')){
        localStorage.setItem('group',e.target.id)
        try {
            const localStorageData = localStorage.getItem('chat')
        let localStorageChats;
        if(localStorageData == null){
            localStorageChats = [{id:-1}]
        }else{
            localStorageChats = JSON.parse(localStorageData)
        }
        const groupId = e.target.id;
        const response = await axios.get(`/api/v1/group/getchat/?groupId=${groupId}&lastchatId=${localStorageChats[localStorageChats.length-1].id}`,{headers})
        const data = response.data.chats.reverse()
        const currentUser = response.data.currentUser
        if(localStorageData == null){
            displayChats([],{data:data,currentUser:currentUser})
        }
        else{
            displayChats(localStorageChats,{data:data,currentUser:currentUser})
        }
        inputContainer.style.display = ''
        } catch (error) {
          console.log(error)   
        }
    }
}