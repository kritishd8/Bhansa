import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Card from '../Card/Card';
import './Search.scss';
import Footer from '../Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faFilter, faSort } from '@fortawesome/free-solid-svg-icons';

const Search = () => {
    const { query } = useParams();
    const [recipeResults, setRecipeResults] = useState([]);
    const [mealPlanResults, setMealPlanResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortType, setSortType] = useState(null);
    const [filterCategory, setFilterCategory] = useState('');

    const sortRef = useRef(null);
    const filterRef = useRef(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const [recipeResponse, mealPlanResponse] = await Promise.all([
                    axios.get(`http://localhost:5000/api/recipes/search?name=${query}`),
                    axios.get(`http://localhost:5000/api/meal-plans/search?name=${query}`)
                ]);

                setRecipeResults(recipeResponse.data || []);
                setMealPlanResults(mealPlanResponse.data || []);
            } catch (error) {
                console.error('Error fetching results:', error);
                setRecipeResults([]);
                setMealPlanResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    // Sort combined results
    const sortCombinedResults = (results) => {
        if (sortType === 'name') {
            return [...results].sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortType === 'date') {
            return [...results].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortType === 'rating') {
            return [...results].sort((a, b) => b.averageRating - a.averageRating);
        }
        return results;
    };

    const filterCombinedResults = (results) => {
        if (filterCategory.trim()) {
            return results.filter(item =>
                item.category?.some(cat => cat.toLowerCase().includes(filterCategory.toLowerCase()))
            );
        }
        return results;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const combinedResults = [...recipeResults, ...mealPlanResults];

    let filteredResults = filterCombinedResults(combinedResults);
    let sortedAndFilteredResults = sortCombinedResults(filteredResults);

    return (
        <>
            <div className="search-results">
                <div className='top'>
                    <label><FontAwesomeIcon icon={faMagnifyingGlass} /> Search Results for "{query}"</label>
                    <div className="actions">
                        {/* Sort Button */}
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

                        {/* Filter Button */}
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
                        {sortedAndFilteredResults.length > 0 ? (
                            sortedAndFilteredResults.map(item => (
                                <Card
                                    key={item._id}
                                    id={item._id}
                                    title={item.title}
                                    stars={item.averageRating}
                                    img={item.image}
                                    link={item.type === 'recipe' ? `/recipe/${item._id}` : `/meal-plan/${item._id}`}
                                />
                            ))
                        ) : (
                            <p>No results found for "{query}".</p>
                        )}
                    </div>
                    stars={item.averageRating}
                    img={item.image}
                    stars={item.averageRating}
                    img={item.image}
                    link={item.type === 'recipe' ? `/recipe/${item._id}` : `/meal-plan/${item._id}`}
                </section>
            </div>
            <Footer />
        </>
    );
};

export default Search;
