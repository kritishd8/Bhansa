import React, { useEffect, useState, useRef } from 'react';
import { useContext } from 'react';
import { UserContext } from '../../UserContext';
import { useNavigate } from 'react-router-dom'; // Import Link
import axios from 'axios';
import Card from '../Card/Card';
import Footer from '../Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSort, faPlus } from '@fortawesome/free-solid-svg-icons';
import './Dashboard.scss';

const Dashboard = () => {
    const { user } = useContext(UserContext);
    console.log(user)
    const userId = user?._id;
    const role = user?.role;
    const navigate = useNavigate();

    const [recipes, setRecipes] = useState([]);
    const [mealPlans, setMealPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortType, setSortType] = useState(null);
    const [filterCategory, setFilterCategory] = useState('');

    const sortRef = useRef(null);
    const filterRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                };

                if (role === 'Cook') {
                    const response = await axios.get(`http://localhost:5000/api/recipes/filter?author=${userId}`, config);
                    setRecipes(response.data);
                } else if (role === 'Meal Planner') {
                    const response = await axios.get(`http://localhost:5000/api/meal-plans/filter?author=${userId}`, config);
                    setMealPlans(response.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, role]);

    const sortItems = (items) => {
        if (sortType === 'name') {
            return [...items].sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortType === 'date') {
            return [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortType === 'rating') {
            return [...items].sort((a, b) => b.averageRating - a.averageRating);
        }
        return items;
    };

    const filterItems = (items) => {
        if (filterCategory.trim()) {
            return items.filter(item =>
                item.category?.some(cat => cat.toLowerCase().includes(filterCategory.toLowerCase()))
            );
        }
        return items;
    };

    const handleClickOutside = (event) => {
        if (sortRef.current && !sortRef.current.contains(event.target)) {
            setIsSortOpen(false);
        }
        if (filterRef.current && !filterRef.current.contains(event.target)) {
            setIsFilterOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const filteredRecipes = filterItems(recipes);
    const sortedRecipes = sortItems(filteredRecipes);
    const filteredMealPlans = filterItems(mealPlans);
    const sortedMealPlans = sortItems(filteredMealPlans);

    return (
        <>
            <div className="dashboard">
                <div className='top'>
                    {role === 'Cook' && (
                        <label>Your Recipes</label>
                    )}

                    {role === 'Meal Planner' && (
                        <label>Your Meal Plans</label>
                    )}

                    <div className="actions">
                        <div className="sort" ref={sortRef} style={{ position: 'relative' }}>
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

                        <div className="filter" ref={filterRef} style={{ position: 'relative' }}>
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

                        {role === 'Cook' && (
                            <a href="/new-recipe">
                                <h4><FontAwesomeIcon icon={faPlus} /> New Recipe</h4>
                            </a>

                        )}
                        {role === 'Meal Planner' && (
                            <a href="/new-meal-plan">
                                <h4><FontAwesomeIcon icon={faPlus} /> New Meal Plan</h4>
                            </a>
                        )}

                    </div>
                </div>

                {role === 'Cook' && (
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
                                        link={`/edit-recipe/${recipe._id}`}
                                    />
                                ))
                            ) : (
                                <p>No recipes found.</p>
                            )}
                        </div>
                    </section>
                )}

                {role === 'Meal Planner' && (
                    <section>
                        <div className="results-container">
                            {sortedMealPlans.length > 0 ? (
                                sortedMealPlans.map(mealPlan => (
                                    <Card
                                        key={mealPlan._id}
                                        id={mealPlan._id}
                                        title={mealPlan.title}
                                        stars={mealPlan.averageRating}
                                        img={mealPlan.image}
                                        link={`/edit-meal-plan/${mealPlan._id}`}
                                    />
                                ))
                            ) : (
                                <p>No meal plans found.</p>
                            )}
                        </div>
                    </section>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Dashboard;
