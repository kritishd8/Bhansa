import React, { useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Card from '../Card/Card';
import './MealPlans.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faFilter, faSort } from '@fortawesome/free-solid-svg-icons';
import Footer from '../Footer/Footer';

import { UserContext } from '../../UserContext';

const MealPlans = () => {
    const [mealPlanResults, setMealPlanResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortType, setSortType] = useState(null);
    const [filterCategory, setFilterCategory] = useState('');

    const sortRef = useRef(null);
    const filterRef = useRef(null);
    const { user } = useContext(UserContext);


    useEffect(() => {
        console.log('User object:', user);
    }, [user]);

    const fetchMealPlans = async () => {
        setLoading(true);
        try {
            if (!user || !user.token) {
                console.error('No token available, cannot fetch meal plans');
                setLoading(false);
                return;
            }

            let apiUrl = 'http://localhost:5000/api/meal-plans';
            if (filterCategory) {
                apiUrl = `http://localhost:5000/api/meal-plans/filter?categories=${filterCategory}`;
            }

            const response = await axios.get(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.data && Array.isArray(response.data)) {
                setMealPlanResults(response.data);
            } else {
                setMealPlanResults([]);
            }
        } catch (error) {
            console.error('Error fetching meal plans:', error);
            setMealPlanResults([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMealPlans();
    }, [filterCategory, user]);

    const sortMealPlans = (mealPlans) => {
        if (sortType === 'name') {
            return [...mealPlans].sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortType === 'date') {
            return [...mealPlans].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortType === 'rating') {
            return [...mealPlans].sort((a, b) => b.averageRating - a.averageRating); // Sort by rating highest to lowest
        }
        return mealPlans;
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

    let sortedMealPlans = sortMealPlans(mealPlanResults);

    return (
        <>
            <div className="meal-plans-page">
                <div className='top'>
                    <label><FontAwesomeIcon icon={faUtensils} /> All Meal Plans</label>
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
                        {sortedMealPlans.length > 0 ? (
                            sortedMealPlans.map(mealPlan => (
                                <Card
                                    key={mealPlan._id}
                                    id={mealPlan._id}
                                    title={mealPlan.title}
                                    stars={mealPlan.averageRating}
                                    img={mealPlan.image}
                                    link={`/meal-plan/${mealPlan._id}`}
                                />
                            ))
                        ) : (
                            <p>No meal plans available.</p>
                        )}
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default MealPlans;
