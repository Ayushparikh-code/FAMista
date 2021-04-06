import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext';
import '../../css/Product.css'
import db from '../../firebase'
import ShareProductModal from './ShareProductModal';
import ShareIcon from '@material-ui/icons/Share';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import GroupAddIcon from '@material-ui/icons/GroupAdd';

function Product({id, title, image, price, rating, quantity, userId, setLength}) {
    const {currentUser} = useAuth();
    const [twinCount, setTwinCount]  = useState(0);
    const [twins, setTwins] = useState([]);
    const [show, setShow] = useState(false);

    const addToBasket = (event) => {
        event.preventDefault();

        db.collection("users").doc(userId).collection("basketItems").doc(id).get().then((doc) => {
            if (doc.exists) {
                quantity  = doc.data().itemQuantity;
                db.collection("users").doc(userId).collection("basketItems").doc(id).update({
                    itemId: id,
                    itemName: title,
                    itemImage: image,
                    itemPrice: price,
                    itemRating: rating,
                    itemQuantity: quantity + 1,
                });
            }
            else {
                db.collection("users").doc(userId).collection("basketItems").doc(id).set({
                    itemId: id,
                    itemName: title,
                    itemImage: image,
                    itemPrice: price,
                    itemRating: rating,
                    itemQuantity: quantity + 1,
                });
            }
        })

        db.collection("users").doc(userId).get().then(docc => {
            const data = docc.data()
            db.collection("users").doc(userId).update({
                subtotal: data.subtotal + price,
                noItems: data.noItems + 1
            })
            setLength(data.noItems + 1);
        })
    }


    const seeTwinCount = (event) => {
        event.preventDefault();
        var count = 0;
        db.collection("users").doc(currentUser.uid).collection("friends").get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                console.log(doc.id);
                db.collection("users").doc(doc.id).collection("basketItems").doc(id).get().then((docc) => { 
                    if (docc.exists) { 
                        setTwins(twins => [...twins, doc.data().friendName]);
                        console.log("Document data:", docc.data()); 
                        count = count + 1;
                    } 
                    else { 
                        // doc.data() will be undefined in this case 
                        console.log("No such document!"); 
                    }
                    setTwinCount(count);
                }).catch((error) => { 
                    console.log("Error getting document:", error); 
                });
                    
            })
        })
        setTwinCount(0);
        setTwins([]);
    }

    const showModal = () => {
        setShow(true);
    };
    
    const hideModal = () => {
        setShow(false);
    };

    return (
        <div className="product">
            <div className="product_info">
                <p>{title}</p>
                <p className="product_price">
                    <small>$</small>
                    <strong>{price}</strong>    
                </p>
                <p className="product_price">
                    <small>💖</small>
                    <strong>{twinCount}</strong>
                </p> 
                <div className="product_rating">
                    {Array(rating)
                        .fill()
                        .map((_, i) => (
                        <p className="star">⭐</p>
                    ))}
                </div>
                <div className="product__options">
                    {/* <button onClick={seeTwinCount}>Twin Count</button> */}
                    <GroupAddIcon fontSize="large" onClick={seeTwinCount} style={{color:"#440a67", cursor:"pointer", pointerEvents:"auto", marginBottom:10, marginTop:10}}/> <br />
                    {/* <button onClick={addToBasket}>Add to Basket</button> */}
                    <AddShoppingCartIcon fontSize="large" onClick={addToBasket} style={{color:"#440a67", cursor:"pointer", marginBottom:10}}/> <br/>
                    <ShareIcon fontSize="large" onClick={showModal} style={{color:"#440a67", cursor:"pointer", marginBottom:10}}/><br/>
                    {/* <button onClick={showModal}>Share Product</button> */}
                </div>
                <div>{twins.map( e =>
                    <div>{ e }</div>
                  )}
                  </div>
            </div>
            <img
            alt="Lean Startup"
            src={image}
            />
            <ShareProductModal show={show} handleClose={hideModal} image={image} id={id} title={title} userid={currentUser.uid}>
                <p>Modal</p>
            </ShareProductModal>
            <div>
            <center  className="product__options">
<<<<<<< HEAD
            <button onClick={seeTwinCount}>Twin Count</button>
            <button onClick={addToBasket}>Add to Basket</button>
            <button onClick={showModal}>Share Product</button>
=======
                <button onClick={seeTwinCount}>Twin Count</button>
                <button onClick={addToBasket}>Add to Basket</button>
                <button onClick={showModal}>Share Product</button>
>>>>>>> 5708c763276317b0d5e1363913135e0d99dc1f86
            </center>
            </div>
        </div>
    )
}

export default Product
