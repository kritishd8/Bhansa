import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../Footer/Footer';
import './ViewRecipe.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalf, faCartShopping, faDownload, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faClock, faUser, faShareFromSquare } from '@fortawesome/free-regular-svg-icons';

function ViewRecipe() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
    const shoppingListRef = useRef(null);

    useEffect(() => {
        fetch(`http://localhost:5000/api/recipes/${id}`)
            .then(response => response.json())
            .then(data => {
                setRecipe(data);
                console.log(data);
            })
            .catch(error => console.error('Error fetching recipe:', error));
    }, [id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (shoppingListRef.current && !shoppingListRef.current.contains(event.target)) {
                setIsShoppingListOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!recipe) {
        return <div>Loading...</div>;
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: recipe.title,
                url: window.location.href,
            }).catch(error => console.error('Error sharing:', error));
        } else {
            alert('Sharing is not supported in this browser.');
        }
    };

    const handleDownload = () => {
        const ingredients = recipe.ingredients;

        //? Binary Large OBject (Binary Data)
        const blob = new Blob([ingredients.join('\n')], { type: 'text/plain' });

        const link = document.createElement('a'); //? This will act as a hidden download link

        link.href = URL.createObjectURL(blob); //? creating the download link to download our blob

        link.download = `${recipe.title}_ingredients.txt`; //? Setting the name of the downloaded file

        link.click(); //? Clicking the hidden download link automatically
    };

    return (
        <>
            <div className="recipe">
                <img src={recipe.image || "https://via.placeholder.com/1080"} alt={recipe.title} />
                <div className="top">
                    <h1>{recipe.title}</h1>
                    <span className="stars">
                        {[...Array(Math.floor(recipe.averageRating))].map((_, i) => (
                            <FontAwesomeIcon key={i} icon={faStar} className="star" />
                        ))}
                        {recipe.averageRating % 1 !== 0 && (
                            <FontAwesomeIcon icon={faStarHalf} className="star" />
                        )}
                        <span className="amount">({recipe.reviews.length})</span>
                    </span>
                    <span className='time'>
                        <p><FontAwesomeIcon icon={faClock} className="star" /> Ready in {recipe.timeToPrepare} minutes</p>
                        <p>.</p>
                        <p><FontAwesomeIcon icon={faUser} className="star" /> {recipe.createdBy.name}</p>
                    </span>
                </div>
                <div className="description">
                    <label>Description</label>
                    <p>{recipe.description}</p>
                </div>
                <div className="ingredients">
                    <label>Ingredients</label>
                    <ul>
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </div>
                <div className="instructions">
                    <label>Instructions</label>
                    <p>{recipe.instructions}</p>
                </div>
                <div className="buttons">
                    <button className="btn-primary" onClick={handleShare}>
                        <FontAwesomeIcon icon={faShareFromSquare} className="star" /> Share
                    </button>
                    <button className="btn-primary" onClick={() => setIsShoppingListOpen(true)}>
                        <FontAwesomeIcon icon={faCartShopping} className="star" /> Generate Shopping List
                    </button>
                    <button className="btn-primary"><FontAwesomeIcon icon={faStar} className="star" /> Write a Review</button>
                </div>
            </div>
            <Footer />

            {isShoppingListOpen && (
                <div className="shopping-list-overlay">
                    <div className="shopping-list-popup" ref={shoppingListRef}>
                        <h2>Shopping List</h2>
                        <ul>
                            {recipe.ingredients.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>
                        <div className="buttons">
                            <button className='btn-secondary' onClick={handleDownload}><FontAwesomeIcon icon={faDownload} /> Download</button>
                            <button className='btn-primary' onClick={() => setIsShoppingListOpen(false)}><FontAwesomeIcon icon={faXmark} /> Close</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ViewRecipe;
