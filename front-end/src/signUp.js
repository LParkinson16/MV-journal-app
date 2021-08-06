import { useState } from 'react'

export default function SignUp(props){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    function onChangeUsername(e){
        setUsername(e.currentTarget.value)
    }

    function onChangePass(e){
        setPassword(e.currentTarget.value)
    }

    async function onSubmit(){
        const response = await fetch('/users',{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({username, password})
        });
        if(response.ok){
            const jwt = await response.text();
            localStorage.setItem('jwt', jwt)
            props.onLogin()
        }
    }

    return(
        <div className="App">
            <input onChange={onChangeUsername} value ={username}/>
            <input type="password" onChange={onChangePass} value ={password}/>
            <button onClick={onSubmit}>Sign up</button>
        </div>
    )
}

//authorization = localstorage.getItem(jwt)