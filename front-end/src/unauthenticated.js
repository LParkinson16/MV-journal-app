import SignUp from './signUp'
import Login from './login'

export default function Unauthenticated (props){
    return(
        <div className='App'>
            <h1>You aren't authenticated</h1>
            <SignUp onLogin={props.onLogin}/>
            {<Login onLogin={props.onLogin}/>}
        </div> 
    )
}