import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Card from '../Card/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faStarOfLife, faClockRotateLeft, faCarrot, faSeedling, faMartiniGlassEmpty, faCakeCandles, faArrowRightLong, faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons';
import './HomePage.scss';
import { faClock } from '@fortawesome/free-regular-svg-icons';

function HomePage() {
    const [recipes, setRecipes] = useState([]);
    const [recipeOfTheDay, setRecipeOfTheDay] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/recipes/')
            .then(response => response.json())
            .then(data => {
                setRecipes(data);
                if (data.length > 0) {
                    setRecipeOfTheDay(data[0]);
                }
            })
            .catch(error => console.error('Error fetching recipes:', error));
    }, []);

    const getPopularRecipes = () => {
        return recipes.sort((a, b) => b.averageRating - a.averageRating).slice(0, 5);
    };

    const getNewlyAddedRecipes = () => {
        return recipes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    };

    const getQuickRecipes = () => {
        return recipes.sort((a, b) => a.timeToPrepare - b.timeToPrepare).slice(0, 5);
    };

    const getVegetarianRecipes = () => {
        return recipes.filter(recipe =>
            recipe.category.map(cat => cat.toLowerCase()).includes('vegetarian')
        ).slice(0, 5);
    };


    const getVeganRecipes = () => {
        return recipes.filter(recipe =>
            recipe.category.map(cat => cat.toLowerCase()).includes('vegan')
        ).slice(0, 5);
    };

    const getDrinks = () => {
        return recipes.filter(recipe =>
            recipe.category.map(cat => cat.toLowerCase()).includes('drink')
        ).slice(0, 5);
    };

    const getDesserts = () => {
        return recipes.filter(recipe =>
            recipe.category.map(cat => cat.toLowerCase()).includes('dessert')
        ).slice(0, 5);
    };

    const renderStars = (stars) => {
        const rating = Math.floor(stars);
        const decimal = stars - rating;
        const halfStar = decimal >= 0.3 && decimal <= 0.9;
        const fullStars = [...Array(rating).keys()].map(i => <FontAwesomeIcon key={i} icon={faStar} className="star" />);
        const halfStarIcon = halfStar ? <FontAwesomeIcon icon={faStarHalf} className="star" /> : null;

        return (
            <>
                {fullStars}
                {halfStarIcon}
            </>
        );
    };

    return (
        <>
            <section className="featured">
                {recipeOfTheDay && (
                    <>
                        <div className="left">
                            <img
                                src={recipeOfTheDay.image ? recipeOfTheDay.image : 'https://picsum.photos/400'}
                                alt={recipeOfTheDay.title}
                                style={{ height: '400px', objectFit: 'cover' }}
                            />
                        </div>
                        <div className="right">
                            <label>🎉 Recipe of the Day</label>
                            <h1>{recipeOfTheDay.title}</h1>
                            <div className="stars">
                                {recipeOfTheDay.averageRating ? (
                                    <>
                                        {renderStars(recipeOfTheDay.averageRating)} ({recipeOfTheDay.ratingCount || 0} ratings)
                                    </>
                                ) : (
                                    <p>No ratings yet</p>
                                )}
                            </div>

                            <div className="time">
                                <FontAwesomeIcon icon={faClock} />
                                <h5>Ready in {recipeOfTheDay.timeToPrepare} minutes</h5>
                            </div>
                            <p className="description">{recipeOfTheDay.description}</p>
                            <a href={`/recipe/${recipeOfTheDay._id}`}>
                                <button className="btn-secondary">View Recipe  <FontAwesomeIcon icon={faArrowRightLong} /></button>
                            </a>
                        </div>
                    </>
                )}
            </section>

            <section className="contents">
                {/* Popular Recipes */}
                <div className="title">
                    <FontAwesomeIcon icon={faArrowTrendUp} />
                    <label>Popular Recipes This Week</label>
                </div>
                <div className="cards">
                    {getPopularRecipes().map(recipe => (
                        <Card
                            key={recipe._id}
                            id={recipe._id}
                            title={recipe.title}
                            stars={recipe.averageRating}
                            img={recipe.image}
                            link={`/recipe/${recipe._id}`}
                        />
                    ))}
                </div>

                {/* Newly Added Recipes */}
                <div className="title">
                    <FontAwesomeIcon icon={faStarOfLife} />
                    <label>Newly Added Recipes</label>
                </div>
                <div className="cards">
                    {getNewlyAddedRecipes().map(recipe => (
                        <Card
                            key={recipe._id}
                            id={recipe._id}
                            title={recipe.title}
                            stars={recipe.averageRating}
                            img={recipe.image}
                            link={`/recipe/${recipe._id}`}
                        />
                    ))}
                </div>

                {/* Quick Recipes */}
                <div className="title">
                    <FontAwesomeIcon icon={faClockRotateLeft} />
                    <label>Quick Recipes</label>
                </div>
                <div className="cards">
                    {getQuickRecipes().map(recipe => (
                        <Card
                            key={recipe._id}
                            id={recipe._id}
                            title={recipe.title}
                            stars={recipe.averageRating}
                            img={recipe.image}
                            link={`/recipe/${recipe._id}`}
                        />
                    ))}
                </div>

                {/* Vegetarian Recipes */}
                <div className="title">
                    <FontAwesomeIcon icon={faCarrot} />
                    <label>Vegetarian Recipes</label>
                </div>
                <div className="cards">
                    {getVegetarianRecipes().map(recipe => (
                        <Card
                            key={recipe._id}
                            id={recipe._id}
                            title={recipe.title}
                            stars={recipe.averageRating}
                            img={recipe.image}
                            link={`/recipe/${recipe._id}`}
                        />
                    ))}
                </div>

                {/* Vegan Recipes */}
                <div className="title">
                    <FontAwesomeIcon icon={faSeedling} />
                    <label>Vegan Recipes</label>
                </div>
                <div className="cards">
                    {getVeganRecipes().map(recipe => (
                        <Card
                            key={recipe._id}
                            id={recipe._id}
                            title={recipe.title}
                            stars={recipe.averageRating}
                            img={recipe.image}
                            link={`/recipe/${recipe._id}`}
                        />
                    ))}
                </div>

                {/* Drinks */}
                <div className="title">
                    <FontAwesomeIcon icon={faMartiniGlassEmpty} />
                    <label>Drinks</label>
                </div>
                <div className="cards">
                    {getDrinks().map(recipe => (
                        <Card
                            key={recipe._id}
                            id={recipe._id}
                            title={recipe.title}
                            stars={recipe.averageRating}
                            img={recipe.image}
                            link={`/recipe/${recipe._id}`}
                        />
                    ))}
                </div>

                {/* Desserts */}
                <div className="title">
                    <FontAwesomeIcon icon={faCakeCandles} />
                    <label>Desserts</label>
                </div>
                <div className="cards">
                    {getDesserts().map(recipe => (
                        <Card
                            key={recipe._id}
                            id={recipe._id}
                            title={recipe.title}
                            stars={recipe.averageRating}
                            img={recipe.image}
                            link={`/recipe/${recipe._id}`}
                        />
                    ))}
                </div>

            </section>

            <Footer />
        </>
    );
}

export default HomePage;
