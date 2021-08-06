import Navbar from "../navbar";
import { useState } from 'react'
import "../login";

function ListOfEntries() {
    const id = localStorage.getItem('userId')
    const [entries, setEntries] = useState()

    const response =  fetch('/users/' + id + '/entries', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify()
    });
    if (response.ok) {
        const journalData = response.json
        setEntries(journalData)
    }

    return (
        <div className="app">
            <h1>Entries list</h1>
        </div>

    )

}

export default ListOfEntries