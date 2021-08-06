import './App.css';
import { useState } from 'react'
import Unauthenticated from './unauthenticated'
import Authenticated from './authenticated'

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('jwt'))
  if (loggedIn) {
    return <Authenticated onLogout={()=>setLoggedIn(false)} />
  } else {
    return <Unauthenticated  onLogin={()=>setLoggedIn(true)}/>
  }
}

export default App;
