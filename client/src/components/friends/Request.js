import React from 'react'
import '../../css/Users.css';
import db from '../../firebase';
import {useAuth} from '../../contexts/AuthContext';
import { Avatar } from '@material-ui/core';
import likeIcon from '../../resources/like-16x16(1).png';
import emailIcon from '../../resources/email.png';

function Request({key, id, emailAdd, name, profilePic}) {
    const {currentUser} = useAuth();

    const acceptRequest = (event) => {
        event.preventDefault();

        db.collection("users").doc(id).collection("friends").doc(currentUser.uid).set({
            friendEmail: currentUser.email,
            friendName: currentUser.displayName,
            friendProfilePic: currentUser.photoURL
        });

        db.collection("users").doc(currentUser.uid).collection("friends").doc(id).set({
            friendEmail: emailAdd,
            friendName: name,
            friendProfilePic: profilePic
        }).then(() => {
            db.collection("users").doc(currentUser.uid).collection("friendRequests").doc(id).delete();
        });
    }

    const declineRequest = (event) => {
        event.preventDefault();

        db.collection("users").doc(id).collection("friendRequests").doc(currentUser.uid).delete().then(() => {
            console.log("Item successfully deleted!");
        }).catch((error) => {
            console.error("Error removing item: ", error);
        });
    }

    return (
        <div class="card">
            <div class="card-header">
                <h1>Image</h1>
                
            </div>
            <div class="card-body">
                <div className='card-inline'><Avatar src={profilePic} />&nbsp;&nbsp;
                    <h3>{name}</h3>
                </div>
                {/* <p><span><img src={likeIcon} alt="like" style={{height:16, width:16, marginRight:10}} /></span>{gender}</p> */}
                <p><span><img src={emailIcon} alt="like" style={{height:22, width:22, marginRight:5}} /></span>{emailAdd}</p>
                <button onClick={acceptRequest} style={{marginBottom:20}}>Accept</button> <br/>
                <button onClick={declineRequest}>Decline</button>
            </div>
        </div>
    )
}

export default Request
