import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Card from '../Card/Card'; // Adjust the import path as needed
import './Recipes.scss';
import Footer from '../Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faFilter, faSort } from '@fortawesome/free-solid-svg-icons'; // Using utensils icon

const Recipes = () => {
    const [recipeResults, setRecipeResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSortOpen, setIsSortOpen] = useState(false); // To toggle sort menu
    const [isFilterOpen, setIsFilterOpen] = useState(false); // To toggle filter menu
    const [sortType, setSortType] = useState(null); // Sorting type state
    const [filterCategory, setFilterCategory] = useState(''); // Category filter input (single value)

    const sortRef = useRef(null);
    const filterRef = useRef(null);

    // Fetch recipes from the backend with the selected filter
    const fetchRecipes = async () => {
        setLoading(true); // Start loading
        try {
            let apiUrl = 'http://localhost:5000/api/recipes';
            if (filterCategory) {
                apiUrl = `http://localhost:5000/api/recipes/filter?categories=${filterCategory}`;
            }
            const response = await axios.get(apiUrl);
            if (response.data && Array.isArray(response.data)) {
                setRecipeResults(response.data);
            } else {
                setRecipeResults([]); // Set empty if response is unexpected
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setRecipeResults([]);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Fetch recipes whenever filterCategory changes
    useEffect(() => {
        fetchRecipes();
    }, [filterCategory]); // Re-run when filterCategory changes

    // Sort recipes by selected sortType
    const sortRecipes = (recipes) => {
        if (sortType === 'name') {
            return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortType === 'date') {
            return [...recipes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortType === 'rating') {
            return [...recipes].sort((a, b) => b.averageRating - a.averageRating); // Sort by rating highest to lowest
        }
        return recipes;
    };

    // Close popup when clicking outside
    const handleClickOutside = (event) => {
        if (sortRef.current && !sortRef.current.contains(event.target)) {
            setIsSortOpen(false);
        }
        if (filterRef.current && !filterRef.current.contains(event.target)) {
            setIsFilterOpen(false);
        }
    };

    useEffect(() => {
        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Clean up the event listener
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    let sortedRecipes = sortRecipes(recipeResults);

    return (
        <>
            <div className="recipes-page">
                <div className='top'>
                    <label><FontAwesomeIcon icon={faUtensils} /> All Recipes</label>
                    <div className="actions">

                        <div className="sort" style={{ position: 'relative' }} ref={sortRef}>
                            <a onClick={() => setIsSortOpen(!isSortOpen)}>
                                <h4><FontAwesomeIcon icon={faSort} /> Sort</h4>
                            </a>
                            {isSortOpen && (
                                <div className="sort-popup">
                                    <p onClick={() => { setSortType('name'); setIsSortOpen(false); }}>By Name</p>
                                    <p onClick={() => { setSortType('date'); setIsSortOpen(false); }}>By Date</p>
                                    <p onClick={() => { setSortType('rating'); setIsSortOpen(false); }}>By Rating</p>
                                </div>
                            )}
                        </div>

                        <div className="filter" style={{ position: 'relative' }} ref={filterRef}>
                            <a onClick={() => setIsFilterOpen(!isFilterOpen)}>
                                <h4><FontAwesomeIcon icon={faFilter} /> Filter</h4>
                            </a>
                            {isFilterOpen && (
                                <div className="filter-popup">
                                    <div className="filter-sections">
                                        <div className="meals-section">
                                            <h5>Type</h5>
                                            <p onClick={() => { setFilterCategory('breakfast'); setIsFilterOpen(false); }}>Breakfast</p>
                                            <p onClick={() => { setFilterCategory('lunch'); setIsFilterOpen(false); }}>Lunch</p>
                                            <p onClick={() => { setFilterCategory('dinner'); setIsFilterOpen(false); }}>Dinner</p>
                                            <p onClick={() => { setFilterCategory('snacks'); setIsFilterOpen(false); }}>Snacks</p>
                                            <p onClick={() => { setFilterCategory('dessert'); setIsFilterOpen(false); }}>Dessert</p>
                                            <p onClick={() => { setFilterCategory('drink'); setIsFilterOpen(false); }}>Drinks</p>
                                        </div>

                                        <div className="diets-section">
                                            <h5>Diets</h5>
                                            <p onClick={() => { setFilterCategory('healthy'); setIsFilterOpen(false); }}>Healthy</p>
                                            <p onClick={() => { setFilterCategory('vegetarian'); setIsFilterOpen(false); }}>Vegetarian</p>
                                            <p onClick={() => { setFilterCategory('vegan'); setIsFilterOpen(false); }}>Vegan</p>
                                            <p onClick={() => { setFilterCategory('non-veg'); setIsFilterOpen(false); }}>Non-Veg</p>
                                        </div>
                                    </div>

                                    <button onClick={() => { setIsFilterOpen(false); setFilterCategory(''); }}>
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <section>
                    <div className="results-container">
                        {sortedRecipes.length > 0 ? (
                            sortedRecipes.map(recipe => (
                                <Card
                                    key={recipe._id}
                                    id={recipe._id}
                                    title={recipe.title}
                                    stars={recipe.averageRating}
                                    img={recipe.image}
                                    link={`/recipe/${recipe._id}`}
                                />
                            ))
                        ) : (
                            <p>No recipes available.</p>
                        )}
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default Recipes;
