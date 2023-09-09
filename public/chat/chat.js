const items = document.getElementById('items')
const token = localStorage.getItem('token')
const button = document.getElementById('sendButton')
const groupListButton = document.getElementById('add-Buttons')
const createGroupButton = document.getElementById('create-group-column')
const createGroupForm = document.getElementById('create-group-form')
const inputContainer = document.getElementById('input-container')
const admin = document.getElementById('admin')
const groupMemberAdd = document.getElementById('groupMemberAdd')
const groupMemberList = document.getElementById('group-members-list')

const headers = {
        'Content-Type': 'application/json',
        'Authorization': token 
};

document.addEventListener('DOMContentLoaded',async ()=>{
    try {
        const response = await axios.get('/api/v1/group/getgroup',{headers})
        for(let i=0;i<response.data.groups.length;i++){
            groupDisplay(response.data.groups[i])
        }
    } catch (error) {
        console.log(error)
    }
})

//add newGroup-button
function groupDisplay(group){
    const button = document.createElement('button')
    button.id = group.id
    button.textContent = group.name
    button.classList.add('groupButton')
    groupListButton.appendChild(button)
}

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
    const data = {
        name:gname.value
    }
    const response = await axios.post('/api/v1/group/create',data,{headers})
    createGroupForm.style.display = 'none'
    groupDisplay(response.data)
    alert('group created')
    createGroupForm.style.display = 'none'
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
        if(localStorageData == null || JSON.parse(localStorageData).length == 0){
            localStorageChats = [{id:-1}]
        }else{
            localStorageChats = JSON.parse(localStorageData)
        }
        const groupId = e.target.id;
        const response = await axios.get(`/api/v1/group/getchat/?groupId=${groupId}&lastchatId=${localStorageChats[localStorageChats.length-1].id}`,{headers})
        const data = response.data.chats.reverse()
        const currentUser = response.data.currentUser
        if(localStorageData == null || JSON.parse(localStorageData).length == 0){
            displayChats([],{data:data,currentUser:currentUser})
        }
        else{
            displayChats(localStorageChats,{data:data,currentUser:currentUser})
        }
        inputContainer.style.display = ''
        if(response.data.admin){
            admin.style.display = '';
            userListDisplay()
        }
        else{
            admin.style.display = 'none'
        }
        } catch (error) {
          console.log(error)   
        }
    }
}

//
async function userListDisplay(){
    const groupId = localStorage.getItem('group')
    const response = await axios.get(`/api/v1/group/userdis/${groupId}`,{headers})
    console.log(response)
    for(let i=0;i<response.data.length;i++){
        const li = document.createElement('li')
        li.textContent = `${response.data[i].name}`
        const button1 = document.createElement('button')
        button1.textContent = 'delete'
        button1.classList.add('groupDelete')
        button1.id = response.data[i].id
        li.appendChild(button1)
        const button2 = document.createElement('button')
        button2.textContent='Make admin'
        button2.classList.add('admin-button')
        button2.setAttribute('data-unique-id', `${response.data[i].id}`);
        li.appendChild(button2)
        groupMemberList.appendChild(li)
    }
}

//group member-add
groupMemberAdd.addEventListener('click',async (e)=>{
    e.preventDefault();
    const selectValue = document.getElementById('addToGroupSelect')
    const inputValue = document.getElementById('addToGroupInput')
    if(!selectValue.value || !inputValue.value){
        alert('values are missing')
    }else{
        const groupid=localStorage.getItem('group')
        data = {
            attrName:selectValue.value,
            attrValue:inputValue.value,
            groupId:groupid
        }
        const response = await axios.post('/api/v1/group/adduser',data)
        addToUserList(response.data)
    }
})

function addToUserList(user){
        const li = document.createElement('li')
        li.textContent = `${user.name}`
        const button = document.createElement('button')
        button.textContent = 'delete'
        button.classList.add('groupDelete')
        button.id = user.id
        li.appendChild(button)
        const button2 = document.createElement('button')
        button2.textContent='Make admin'
        button2.classList.add('admin-button')
        button2.setAttribute('data-unique-id', `${user.id}`);
        li.appendChild(button2)
        groupMemberList.appendChild(li)
}

//delete from group
groupMemberList.addEventListener('click',groupDelete)

async function groupDelete(e){
    e.preventDefault();
    if(e.target.classList.contains('groupDelete')){
        const id = e.target.id
        const li = e.target.parentElement
        await axios.delete(`/api/v1/group/delete/${id}`)
        groupMemberList.removeChild(li)
    }
}
