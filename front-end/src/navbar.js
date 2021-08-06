import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ListOfEntries from './pages/listOfEntries'
import AddEntry from './pages/addEntry'
import SecurityInfo from "./pages/security";


export default function Navbar() {

    const id = localStorage.getItem('userId')

    return (
        <div className="App">
            <Router>
                <div className='nav'>
                    <section>
                        <Link to='/entries'>
                            <button className="navbtn">Journal entries</button>
                        </Link>

                        <Link to='/makeAnEntry'>
                            <button className="navbtn">Make an entry</button>
                        </Link>

                        <Link to='/security'>
                            <button className="navbtn">security</button>
                        </Link>
                    </section>

                   {/**  <Switch>
                        <Route path='/entries' exact component={ListOfEntries} /> 
                        <Route path='/makeAnEntry' exact component={AddEntry} /> 

                    </Switch>
                   <Route path= '/security' exact component={SecurityInfo} /> **/}
                </div>
            </Router>
        </div>
    )
}