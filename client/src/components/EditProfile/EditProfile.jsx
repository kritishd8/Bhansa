import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import '../NewRecipe/NewRecipe.scss';
import Footer from '../Footer/Footer';
import { UserContext } from '../../UserContext';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [bio, setBio] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [userId, setUserId] = useState('');

    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    console.log(user)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/profiles`, {
                    headers: {
                        'Authorization': `Bearer ${user?.token}`
                    }
                });
                const userProfile = response.data;
                setFirstName(userProfile.name.split(' ')[0] || '');
                setLastName(userProfile.name.split(' ')[1] || '');
                setBio(userProfile.bio || '');
                setEmail(userProfile.email || '');
                setProfileImage(userProfile.profilePicture || null);
                setUserId(userProfile._id);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [user?.token]);

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
        }
    };

    const handleDeleteProfileImage = () => {
        setProfileImage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let imageUrl = profileImage;

        if (profileImage && typeof profileImage === 'object') {
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

        const updatedProfileData = {
            name: `${firstName} ${lastName}`,
            email,
            bio,
            profilePicture: imageUrl
        };

        //? Include password only if it is being updated
        if (password) {
            updatedProfileData.password = password;
        }

        try {
            await axios.put(`http://localhost:5000/api/profiles/`, updatedProfileData, {
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });

            alert('Profile updated successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <>
            <div className="new-recipe">
                <div className='top'>
                    <label>
                        <FontAwesomeIcon icon={faEdit} /> Edit Profile
                    </label>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="recipe-form">
                        <div className="image-section">
                            <h5>Profile Image</h5>
                            <div className="profile-image-container" style={{ backgroundColor: 'var(--primary-background)' }}>
                                <img src={profileImage ? (typeof profileImage === 'object' ? URL.createObjectURL(profileImage) : profileImage) : 'https://via.placeholder.com/150'} alt="Profile" />
                                <button type="button" className="delete-button" onClick={handleDeleteProfileImage}>Delete Image</button>
                                <button type="button" onClick={() => document.getElementById('profile-image-input').click()}>Change Image</button>
                                <input type="file" id="profile-image-input" onChange={handleProfileImageChange} accept="image/*" style={{ display: 'none' }} />
                            </div>
                        </div>

                        <div className="input-section">
                            <div className="flex-row">
                                <div className="input-group">
                                    <h5>First Name</h5>
                                    <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <h5>Last Name</h5>
                                    <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </div>
                            </div>

                            <div className="flex-row">
                                <div className="input-group">
                                    <h5>Bio</h5>
                                    <input placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <h5>Email</h5>
                                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </div>

                            <div className="flex-row">
                                <div className="input-group">
                                    <h5>Password</h5>
                                    <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <h5>Confirm Password</h5>
                                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                </div>
                            </div>

                            <div className="button-container">
                                <button type="button" className="btn-primary" onClick={() => navigate('/dashboard')}>Cancel</button>
                                <button type="submit" className="btn-secondary">Update</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default EditProfile;
