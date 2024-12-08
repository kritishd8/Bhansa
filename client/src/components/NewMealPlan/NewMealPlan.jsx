import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import './NewMealPlan.scss';
import Footer from '../Footer/Footer';
import { UserContext } from '../../UserContext';
import { useNavigate } from 'react-router-dom';

const commonCategories = [
    'non-veg', 'vegetarian', 'vegan', 'healthy',
    'breakfast', 'lunch', 'dinner', 'snacks', 'dessert', 'drink'
];

const NewMealPlan = () => {
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

    useEffect(() => {
        handleAddDay();
    }, [duration]);

    const handleAddDay = () => {
        const newDays = [...Array(duration)].map((_, i) => ({
            day: i + 1,
            breakfast: '',
            lunch: '',
            snacks: '',
            dinner: '',
        }));
        setDays(newDays);
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
        }
    };

    const handleDeleteProfileImage = () => {
        setProfileImage(null);
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

    const handleSelectCategory = (cat) => {
        setCategories([...categories, cat]);
        setCategoryInput('');
        setFilteredCategories([]);
    };

    const handleRemoveCategory = (catToRemove) => {
        setCategories(categories.filter(cat => cat !== catToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let imageUrl = '';

        // Upload image to ImgBB (optional)
        if (profileImage) {
            const formData = new FormData();
            formData.append('image', profileImage);

            try {
                const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;
                const response = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, formData);
                imageUrl = response.data.data.display_url;
            } catch (error) {
                console.error('Error uploading image:', error);
                return;
            }
        }

        const mealPlanData = {
            title,
            description,
            duration,
            days: days.map(day => ({
                day: day.day,
                breakfast: day.breakfast.split(',').map(id => id.trim()),
                lunch: day.lunch.split(',').map(id => id.trim()),
                snacks: day.snacks.split(',').map(id => id.trim()),
                dinner: day.dinner.split(',').map(id => id.trim())
            })),
            createdBy: user?._id,
            image: imageUrl,
            category: categories,
        };

        try {
            await axios.post('http://localhost:5000/api/meal-plans', mealPlanData, {
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });

            alert('Meal plan created successfully!');
            navigate('/dashboard');

        } catch (error) {
            console.error('Error submitting meal plan:', error);
        }
    };


    return (
        <>
            <div className="new-meal-plan">
                <div className='top'>
                    <label>
                        <FontAwesomeIcon icon={faEdit} /> New Meal Plan
                    </label>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="meal-plan-form">
                        <div className="image-section">
                            <h5>Meal Plan Image</h5>
                            <div className="profile-image-container" style={{ backgroundColor: 'var(--primary-background)' }}>
                                <img src={profileImage ? URL.createObjectURL(profileImage) : 'https://via.placeholder.com/150'} alt="Profile" />
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
                                                    value={day[meal]}
                                                    onChange={(e) => {
                                                        const updatedDays = [...days];
                                                        updatedDays[index][meal] = e.target.value;
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

export default NewMealPlan;
