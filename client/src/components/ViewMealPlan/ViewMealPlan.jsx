import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Card from '../Card/Card';
import './ViewMealPlan.scss';
import { UserContext } from '../../UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalf, faCartShopping, faDownload, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faClock, faUser, faShareFromSquare } from '@fortawesome/free-regular-svg-icons';

function ViewMealPlan() {
    const { id } = useParams();
    const [mealPlan, setMealPlan] = useState(null);
    const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
    const shoppingListRef = useRef(null);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchMealPlan = async () => {
            if (!user?.token) {
                console.error('No user token found');
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/api/meal-plans/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data)
                setMealPlan(data);
            } catch (error) {
                console.error('Error fetching meal plan:', error);
            }
        };

        fetchMealPlan();
    }, [id, user]);

    if (!mealPlan) {
        return <div>Loading...</div>;
    }

    const renderStars = (stars) => {
        const fullStars = [...Array(Math.floor(stars))].map((_, i) => (
            <FontAwesomeIcon key={i} icon={faStar} className="star" />
        ));
        const halfStar = stars % 1 !== 0 ? <FontAwesomeIcon icon={faStarHalf} className="star" /> : null;

        return (
            <>
                {fullStars}
                {halfStar}
                <span className="amount">({mealPlan.ratingCount || 0})</span>
            </>
        );
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: mealPlan.title,
                url: window.location.href,
            }).catch(error => console.error('Error sharing:', error));
        } else {
            alert('Sharing is not supported in this browser.');
        }
    };

    const getAllIngredients = () => {
        const ingredients = mealPlan.days.flatMap(day =>
            [...day.breakfast, ...day.lunch, ...day.snacks, ...day.dinner].flatMap(item => item.ingredients)
        );
        return [...new Set(ingredients)];
    };

    const handleDownload = () => {
        const ingredients = getAllIngredients();
        const blob = new Blob([ingredients.join('\n')], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'shopping_list.txt';
        link.click();
    };

    return (
        <>
            <div className="meal-plan">
                <img src={mealPlan.image || "https://via.placeholder.com/1080"} alt={mealPlan.title} />
                <div className="top">
                    <h1>{mealPlan.title}</h1>
                    <span className="stars">
                        {renderStars(mealPlan.averageRating)}
                    </span>
                    <span className='time'>
                        <p><FontAwesomeIcon icon={faClock} className="star" /> {mealPlan.duration} days</p>
                        <p>.</p>
                        <p><FontAwesomeIcon icon={faUser} className="star" /> {mealPlan.createdBy.name}</p>
                    </span>
                    <div className="description">
                        <label>Description</label>
                        <p>{mealPlan.description}</p>
                    </div>
                </div>
                <div className="days">
                    {mealPlan.days.map(day => (
                        <div key={day.day} className="day">
                            <label>Day {day.day}</label>
                            <div className="meals">
                                <div>
                                    <h4>Breakfast</h4>
                                    <div className="cards">
                                        {day.breakfast.map(item => (
                                            <Card
                                                key={item._id}
                                                id={item._id}
                                                title={item.title}
                                                stars={item.averageRating}
                                                img={item.image}
                                                link={`/recipe/${item._id}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3>Lunch</h3>
                                    <div className="cards">
                                        {day.lunch.map(item => (
                                            <Card
                                                key={item._id}
                                                id={item._id}
                                                title={item.title}
                                                stars={item.averageRating}
                                                img={item.image}
                                                link={`/recipe/${item._id}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3>Snacks</h3>
                                    <div className="cards">
                                        {day.snacks.map(item => (
                                            <Card
                                                key={item._id}
                                                id={item._id}
                                                title={item.title}
                                                stars={item.averageRating}
                                                img={item.image}
                                                link={`/recipe/${item._id}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3>Dinner</h3>
                                    <div className="cards">
                                        {day.dinner.map(item => (
                                            <Card
                                                key={item._id}
                                                id={item._id}
                                                title={item.title}
                                                stars={item.averageRating}
                                                img={item.image}
                                                link={`/recipe/${item._id}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
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
                            {getAllIngredients().map((ingredient, index) => (
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

export default ViewMealPlan;
