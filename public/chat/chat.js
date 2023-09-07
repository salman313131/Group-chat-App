const items = document.getElementById('items')
const token = localStorage.getItem('token')

document.addEventListener('DOMContentLoaded',async ()=>{
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token 
    };
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