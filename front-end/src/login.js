import { useState } from 'react'

export default function Login(props){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    function onChangeUsername(e){
        setUsername(e.currentTarget.value)
    }

    function onChangePass(e){
        setPassword(e.currentTarget.value)
    }

    async function onSubmit(){
        const response = await fetch('/login',{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({username, password})
        });
        if(response.ok){
            //save token and userId to localstorage to send later
            const {userId/*jwt*/} = await response.json()
            localStorage.setItem('userId', userId)
            props.onLogin()
        }
    }

    return(
        <div className="App">
            <input onChange={onChangeUsername} value ={username}/>
            <input type="password" onChange={onChangePass} value ={password}/>
            <button onClick={onSubmit}>login</button>
        </div>
    )
}

//authorization = localstorage.getItem(jwt)