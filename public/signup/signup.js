const form = document.getElementById('myForm')
const message = document.getElementById('message')

form.addEventListener('submit',onSumbit)

async function onSumbit(e){
    e.preventDefault();
    const myName = document.getElementById('name').value
    const email = document.getElementById('email').value
    const number = document.getElementById('number').value
    const password = document.getElementById('password').value
    if (!myName || !email || !number || !password){
        alert('Single or many Data is missing')
    }
    else{
        try {
            data={
                name:myName,
                email:email,
                number:number,
                password:password
            }
            await axios.post('/api/v1/add',data)
            message.textContent = 'User added Successfully'
        } catch (error) {
            message.style.color = 'red';
            message.textContent=error.message
            console.log(error)
    }
    }
}