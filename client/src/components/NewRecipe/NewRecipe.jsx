import React, { useContext, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import './NewRecipe.scss';
import Footer from '../Footer/Footer';
import { UserContext } from '../../UserContext';
import { useNavigate } from 'react-router-dom';


const commonCategories = [
    'non-veg', 'vegetarian', 'vegan', 'healthy',
    'breakfast', 'lunch', 'dinner', 'snacks', 'dessert', 'drink'
];

const NewRecipe = () => {
    const [title, setTitle] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [categories, setCategories] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const [categoryInput, setCategoryInput] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);

    const { user } = useContext(UserContext);
    const navigate = useNavigate();


    const handleAddCategory = (e) => {
        if (e.key === 'Enter' && categoryInput) {
            setCategories([...categories, categoryInput]);
            setCategoryInput('');
            setFilteredCategories([]);
        }
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file); // Store the actual file object
        }
    };

    const handleDeleteProfileImage = () => {
        setProfileImage(null); // Reset to placeholder
    };

    const handleRemoveCategory = (catToRemove) => {
        setCategories(categories.filter(cat => cat !== catToRemove));
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        let imageUrl = '';

        // Upload image to ImgBB
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

        const recipeData = {
            title,
            timeToPrepare: prepTime,
            description,
            ingredients: ingredients.split(',').map(ing => ing.trim()),
            instructions,
            category: categories,
            image: imageUrl,
            createdBy: user?.id,
        };

        try {
            const response = await axios.post('http://localhost:5000/api/recipes', recipeData, {
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });

            alert('Recipe added successfully!');
            navigate('/dashboard');

        } catch (error) {
            console.error('Error submitting recipe:', error);
        }
    };


    return (
        <>
            <div className="new-recipe">
                <div className='top'>
                    <label>
                        <FontAwesomeIcon icon={faEdit} /> New Recipe
                    </label>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="recipe-form">
                        <div className="image-section">
                            <h5>Recipe Image</h5>
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
                            <div className="flex-row">
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
                                    <h5>Preparation Time</h5>
                                    <input
                                        type="text"
                                        placeholder="Preparation Time (minutes/hours)"
                                        value={prepTime}
                                        onChange={(e) => setPrepTime(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex-row">
                                <div className="input-group">
                                    <h5>Description</h5>
                                    <textarea
                                        placeholder="Description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                                <div className="input-group">
                                    <h5>Ingredients</h5>
                                    <textarea
                                        placeholder="Ingredients (comma-separated)"
                                        value={ingredients}
                                        onChange={(e) => setIngredients(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <h5>Recipe Instructions</h5>
                                <textarea
                                    placeholder="Recipe Instructions"
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                />
                            </div>

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

export default NewRecipe;
