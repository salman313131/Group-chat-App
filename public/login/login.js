const myForm = document.getElementById('myForm')
const message = document.getElementById('message')
myForm.addEventListener('submit',onSumbit)

async function onSumbit(e){
    e.preventDefault();
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    if(!email || !password){
        message.style.color = 'red';
        message.textContent="Please Fill all the deatils"
    }
    setTimeout(()=>{
        message.textContent=''
        message.style.color = 'black'
    },1500)
    try {
        const response = await axios.post('/api/v1/get',{email:email,password:password})
        message.textContent = response.data.token
         setTimeout(()=>{
        message.textContent=''
        message.style.color = 'black'
    },1500)
    } catch (error) {
        console.log(error)
        message.style.color = 'red'
        message.textContent = error.message
    }
}