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
const uploadFile = document.getElementById('uploadFile')
const socket = io();

const headers = {
        'Content-Type': 'application/json',
        'Authorization': token 
};

const headers1 = {
        'Content-Type': 'multipart/form-data',
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
        await axios.post('/api/v1/chat/message',{chat:msg.value,groupId:groupId},{headers})
        const dataToEmit = {msg:msg.value,name:localStorage.getItem('name'),file:false}
        socket.emit('chat message', dataToEmit);
        msg.value = ''
    } catch (error) {
        console.log(error)
    }
})


function displayChats(localdata,data){
    items.innerHTML=''
    for(let i=0;i<localdata.length;i++){
        const li = document.createElement('li')
        if(localdata[i].filetype != 'chat'){

        if(localdata[i].userId == data.currentUser){
            li.textContent = `You`
        }else{
            li.textContent = `${localdata[i].name}`
        }

        if (localdata[i].chat.endsWith('.jpg') || localdata[i].chat.endsWith('.jpeg') || localdata[i].chat.endsWith('.png')) {
        const image = document.createElement('img');
        image.src = localdata[i].chat;
        li.appendChild(image);
      } else if (localdata[i].chat.endsWith('.pdf')) {
        const pdfObject = document.createElement('object');
        pdfObject.data = localdata[i].chat;
        pdfObject.type = 'application/pdf';
        pdfObject.width = '100%';
        pdfObject.height = '500px';
        li.appendChild(pdfObject);
      } else {
        const unsupportedFileMessage = document.createElement('p');
        unsupportedFileMessage.textContent = 'Unsupported file type';
        li.appendChild(unsupportedFileMessage);
      }

        }else{
            if(localdata[i].userId == data.currentUser){
            li.textContent = `You : ${localdata[i].chat}`
        }else{
            li.textContent = `${localdata[i].name} : ${localdata[i].chat}`
        }
        }
        items.appendChild(li)
    }
    for(let i=0;i<data.data.length;i++){
        const li = document.createElement('li')
        if(data.data[i].filetype!='chat'){

            if(data.data[i].userId == data.currentUser){
            li.textContent = `You`
        }else{
            li.textContent = `${data.data[i].name}`
        }

        if (data.data[i].chat.endsWith('.jpg') || data.data[i].chat.endsWith('.jpeg') || data.data[i].chat.endsWith('.png')) {
        const image = document.createElement('img');
        image.src = data.data[i].chat;
        li.appendChild(image);
      } else if (data.data[i].chat.endsWith('.pdf')) {
        const pdfObject = document.createElement('object');
        pdfObject.data = data.data[i].chat;
        pdfObject.type = 'application/pdf';
        pdfObject.width = '100%';
        pdfObject.height = '500px';
        li.appendChild(pdfObject);
      } else {
        const unsupportedFileMessage = document.createElement('p');
        unsupportedFileMessage.textContent = 'Unsupported file type';
        li.appendChild(unsupportedFileMessage);
      }

        }else{
            if(data.data[i].userId == data.currentUser){
            li.textContent = `You : ${data.data[i].chat}`
        }else{
            li.textContent = `${data.data[i].name} : ${data.data[i].chat}`
        }
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
        if(localStorage.getItem('group')!=e.target.id){
            localStorage.removeItem('chat')
            localStorage.setItem('group',e.target.id)
        }
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
    groupMemberList.innerHTML = ''
    const groupId = localStorage.getItem('group')
    const response = await axios.get(`/api/v1/group/userdis/${groupId}`,{headers})
    for(let i=0;i<response.data.length;i++){
        const li = document.createElement('li')
        li.appendChild(document.createTextNode(`${response.data[i].name}`))
        const button1 = document.createElement('button')
        button1.textContent = 'delete'
        button1.classList.add('groupDelete')
        button1.id = response.data[i].id
        li.appendChild(button1)
        if(response.data[i].admin == false){
        const button2 = document.createElement('button')
        button2.textContent='Make admin'
        button2.classList.add('admin-button')
        button2.setAttribute('data-unique-id', `${response.data[i].id}`);
        li.appendChild(button2)
        }else{
            li.appendChild(document.createTextNode('admin'))
        }
        
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
    if(e.target.classList.contains('admin-button')){
        const target = e.target
        const parent = target.parentElement
        const id = target.getAttribute('data-unique-id')
        const data = {id:id}
        await axios.patch('/api/v1/group/admin',data)
        parent.removeChild(target)
        parent.appendChild(document.createTextNode('admin'))
    }
}

 socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    if(msg.file==true){
        if (localStorage.getItem('name') == msg.name){
            item.textContent = `You`
        }else{
            
            item.textContent = `${msg.name}`;
        }
        if (msg.msg.endsWith('.jpg') || msg.msg.endsWith('.jpeg') || msg.msg.endsWith('.png')) {
        const image = document.createElement('img');
        image.src = msg.msg;
        item.appendChild(image);
      } else if (msg.msg.endsWith('.pdf')) {
        const pdfObject = document.createElement('object');
        pdfObject.data = msg.msg;
        pdfObject.type = 'application/pdf';
        pdfObject.width = '100%';
        pdfObject.height = '500px';
        item.appendChild(pdfObject);
      } else {
        const unsupportedFileMessage = document.createElement('p');
        unsupportedFileMessage.textContent = 'Unsupported file type';
        item.appendChild(unsupportedFileMessage);
      }

    }
    else{

        if (localStorage.getItem('name') == msg.name){
            item.textContent = `You : ${msg.msg}`
        }else{
            
            item.textContent = `${msg.name} : ${msg.msg}`;
        }
    }
    items.appendChild(item);
  });

//upload file 
uploadFile.addEventListener('click',onUpload)

async function onUpload(e){
    e.preventDefault();
    try {
        const file = document.getElementById('file')
        if(file.files.length>0){
            const groupId = localStorage.getItem('group')
            const formData = new FormData()
            formData.append('file',file.files[0])
            formData.append('group',groupId)
            const response = await axios.post('/api/v1/chat/file',formData,{headers:headers1})
            const dataToEmit = {msg:response.data.url,name:localStorage.getItem('name'),file:true}
            socket.emit('chat message', dataToEmit);
        }else{
            alert('Please select file to send')
        }
    } catch (error) {
        console.log(error)
    }
}