const form = document.getElementById('myForm')
const myName = document.getElementById('name').value
const email = document.getElementById('email').value
const number = document.getElementById('number').value
const password = document.getElementById('password').value

form.addEventListener('submit',onSumbit)

async function onSumbit(e){
    e.preventDefault();
    if (!email || !myName || !email || !number || !password){
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
        } catch (error) {
            console.log(error)
        }
    }
} 