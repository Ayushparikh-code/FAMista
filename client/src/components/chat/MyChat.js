import React, { useState, useEffect } from 'react'
import Header from '../social/Header'
import Chat from './Chat'
import Sidebar from './Sidebar'
import '../../App.css'
import {useAuth} from '../../contexts/AuthContext';
import db from '../../firebase';

function MyChat() {
    const {currentUser} = useAuth();
    const [length, setLength] = useState(0);

    useEffect(() => {
        if (currentUser) {
            db.collection("users").doc(currentUser.uid).get().then(docc => {
                const data = docc.data();
                setLength(data.noItems);
            })
        }
    })
    return (
        <div>
            <Header length = {length}/> 
            <div className="app">
                <div className="app__body">
                <Sidebar />
                <Chat />
                </div>
            </div>
        </div>
    )
}

export default MyChat
