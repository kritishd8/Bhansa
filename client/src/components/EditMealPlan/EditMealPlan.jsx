import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import '../NewMealPlan/NewMealPlan.scss';
import Footer from '../Footer/Footer';
import { UserContext } from '../../UserContext';
import { useNavigate, useParams } from 'react-router-dom';

const commonCategories = [
    'non-veg', 'vegetarian', 'vegan', 'healthy',
    'breakfast', 'lunch', 'dinner', 'snacks', 'dessert', 'drink'
];

const EditMealPlan = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState(3);
    const [days, setDays] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [categoryInput, setCategoryInput] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (!user?.token) return;

        const fetchMealPlan = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/meal-plans/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const mealPlan = response.data;
                console.log(mealPlan)

                setTitle(mealPlan.title);
                setDescription(mealPlan.description);
                setDuration(mealPlan.duration);
                setDays(mealPlan.days);
                setCategories(mealPlan.category);
                setProfileImage(mealPlan.image);
            } catch (error) {
                console.error('Error fetching meal plan:', error);
            }
        };

        fetchMealPlan();
    }, [id, user]);

    useEffect(() => {
        handleAddDay();
    }, [duration]);

    const handleAddDay = () => {
        const newDays = [...Array(duration)].map((_, i) => ({
            day: i + 1,
            breakfast: [],
            lunch: [],
            snacks: [],
            dinner: [],
        }));
        setDays(newDays);
    };

    const handleProfileImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await axios.post('https://api.imgbb.com/1/upload?key=eb147ff57a5ea1733f49c617a7bb64a0', formData);
                const imageUrl = response.data.data.display_url;
                setProfileImage(imageUrl);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    const handleDeleteProfileImage = () => {
        setProfileImage(null);
    };

    const handleSelectCategory = (cat) => {
        if (!categories.includes(cat)) {
            setCategories([...categories, cat]);
        }
        setCategoryInput('');
        setFilteredCategories([]);
    };

    const handleCategoryInputChange = (e) => {
        const value = e.target.value;
        setCategoryInput(value);
        if (value) {
            const filtered = commonCategories.filter(cat =>
                cat.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredCategories(filtered);
        } else {
            setFilteredCategories([]);
        }
    };

    const handleAddCategory = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            const trimmedInput = categoryInput.trim(); //? removing spaces

            if (trimmedInput && !categories.includes(trimmedInput)) {
                setCategories([...categories, trimmedInput]);
                setCategoryInput('');
                setFilteredCategories([]);
            }
        }
    };

    const handleRemoveCategory = (catToRemove) => {
        setCategories(categories.filter(cat => cat !== catToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let imageUrl = '';

        if (profileImage && typeof profileImage !== 'string') {
            const formData = new FormData();
            formData.append('image', profileImage);

            try {
                const response = await axios.post('https://api.imgbb.com/1/upload?key=eb147ff57a5ea1733f49c617a7bb64a0', formData);
                imageUrl = response.data.data.display_url;
            } catch (error) {
                console.error('Error uploading image:', error);
                return;
            }
        } else if (typeof profileImage === 'string') {
            imageUrl = profileImage;
        }

        const mealPlanData = {
            title,
            description,
            duration,
            days: days.map(day => ({
                day: day.day,
                breakfast: day.breakfast.map(recipe => recipe._id),
                lunch: day.lunch.map(recipe => recipe._id),
                snacks: day.snacks.map(recipe => recipe._id),
                dinner: day.dinner.map(recipe => recipe._id)
            })),
            createdBy: user?._id,
            image: imageUrl,
            category: categories,
        };

        try {
            await axios.put(`http://localhost:5000/api/meal-plans/${id}`, mealPlanData, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            alert('Meal plan updated successfully!');
            navigate('/dashboard');

        } catch (error) {
            console.error('Error updating meal plan:', error);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this meal plan?');
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:5000/api/meal-plans/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                alert('Meal plan deleted successfully!');
                navigate('/dashboard');
            } catch (error) {
                console.error('Error deleting meal plan:', error);
            }
        }
    };

    return (
        <>
            <div className="new-meal-plan">
                <div className='top'>
                    <label>
                        <FontAwesomeIcon icon={faEdit} /> Edit Meal Plan
                    </label>
                </div>
                <form onSubmit={handleSubmit} onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                        e.preventDefault();
                    }
                }}>
                    <div className="meal-plan-form">
                        <div className="image-section">
                            <h5>Meal Plan Image</h5>
                            <div className="profile-image-container" style={{ backgroundColor: 'var(--primary-background)' }}>
                                <img src={typeof profileImage === 'string' ? profileImage : 'https://via.placeholder.com/150'} alt="Profile" />
                                <button
                                    type="button"
                                    className="delete-button"
                                    onClick={handleDeleteProfileImage}
                                >
                                    Delete Image
                                </button>
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('profile-image-input').click()}
                                >
                                    Change Image
                                </button>
                                <input
                                    type="file"
                                    id="profile-image-input"
                                    onChange={handleProfileImageChange}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>

                        <div className="input-section">
                            <div className="input-group">
                                <h5>Title</h5>
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="input-group">
                                <h5>Description</h5>
                                <textarea
                                    placeholder="Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="input-group">
                                <h5>Duration (Days)</h5>
                                <input
                                    type="number"
                                    min="1"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                />
                            </div>

                            {days.map((day, index) => (
                                <div key={index} className="day-section">
                                    <h5>Day {day.day}</h5>
                                    <div className="meal-inputs">
                                        {['breakfast', 'lunch', 'snacks', 'dinner'].map(meal => (
                                            <div key={meal} className="meal-input">
                                                <input
                                                    type="text"
                                                    placeholder={`${meal.charAt(0).toUpperCase() + meal.slice(1)} Recipe ID`}
                                                    value={Array.isArray(day[meal]) ? day[meal].map(item => item._id).join(', ') : ''} // Extract IDs
                                                    onChange={(e) => {
                                                        const updatedDays = [...days];
                                                        updatedDays[index][meal] = e.target.value.split(',').map(id => ({ _id: id.trim() }));
                                                        setDays(updatedDays);
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className="categories-section">
                                <h5>Categories</h5>
                                <input
                                    type="text"
                                    placeholder="Search Category"
                                    value={categoryInput}
                                    onChange={handleCategoryInputChange}
                                    onKeyDown={handleAddCategory}
                                />
                                {filteredCategories.length > 0 && (
                                    <div className="autocomplete-list">
                                        {filteredCategories.map((cat, index) => (
                                            <div key={index} onClick={() => { handleSelectCategory(cat) }}>
                                                {cat}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="added-categories">
                                    {categories.map((cat, index) => (
                                        <span
                                            key={index}
                                            className="category"
                                            onClick={() => handleRemoveCategory(cat)}
                                        >
                                            {cat}
                                        </span>
                                    ))}
                                </div>

                            </div>

                            <div className="button-container">
                                <button type="button" className="btn-delete" onClick={handleDelete}>Delete</button>
                                <button type="button" className="btn-primary" onClick={() => navigate('/dashboard')}>Cancel</button>
                                <button type="submit" className="btn-secondary">Publish</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default EditMealPlan;
