import './App.js';
import Navbar from './navbar.js';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ListOfEntries from './pages/listOfEntries.js';
import AddEntry from './pages/addEntry.js';
import SecurityInfo from './pages/security.js';



export default function Authenticated(props) {

    return (
        <div className='App'>
            <Navbar />
            <h1>Welcome</h1>
            <Router>
            <Switch>
                <Route path='/entries' exact component={ListOfEntries} /> {/**for listing entries/makes a GET request */}
                <Route path='/makeAnEntry' exact component={AddEntry} /> {/**for adding an entry/makes a POST request */}
                <Route path='/security' exact component={SecurityInfo} />
            </Switch>
            </Router>
            <button className='logoutBtn' onClick={props.onLogout}>Logout</button>

        </div>
    )
}

