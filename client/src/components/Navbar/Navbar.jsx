import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import Logo from '../../assets/logo.svg';
import './Navbar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Navbar = ({ openAuthModal }) => {
    const { user } = useContext(UserContext);
    const [profileImage, setProfileImage] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const navigate = useNavigate();
    const popupRef = useRef(null);
    const { logoutUser } = useContext(UserContext);


    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user?.token) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/profiles`, {
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    });
                    setProfileImage(response.data.profilePicture || 'https://th.bing.com/th/id/OIP.yhqkR9B2hKbtwwZ8bPNbQQHaHw?rs=1&pid=ImgDetMain');
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            }
        };

        fetchUserProfile();
    }, [user]);

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search/${encodeURIComponent(searchTerm)}`);
            setSearchTerm('');
            setIsSearchOpen(false);
        }
    };

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setIsPopupOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [popupRef]);

    return (
        <nav className="navbar">
            <div className="start">
                <a href="/recipes">Recipes</a>
                <a href="/mealplans">Meal Plans</a>
            </div>

            <div className="center">
                <Link to="/">
                    <img src={Logo} alt="Bhansa Logo" className='bhansa-logo' />
                    <label>Bhansa</label>
                </Link>
            </div>

            <div className="end">

                <div className={`search-container ${isSearchOpen ? 'open' : ''}`}>
                    <form onSubmit={handleSearchSubmit}>
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className='search-icon'
                            onClick={toggleSearch}
                        />
                        {isSearchOpen && (
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setIsSearchOpen(true)}
                            />
                        )}
                    </form>
                </div>

                {user ? (
                    <div className="user-avatar-container">
                        <img
                            src={profileImage}
                            alt="User Avatar"
                            className="user-avatar"
                            onClick={togglePopup}
                        />
                        {isPopupOpen && (
                            <div className="user-popup" ref={popupRef}>
                                {user.role !== "Food Enthusiast" && (
                                    <p onClick={() => navigate('/dashboard')}>Dashboard</p>
                                )}
                                <p onClick={() => navigate('/edit-profile')}>Edit Profile</p>
                                <p onClick={handleLogout}>Logout</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <a onClick={() => openAuthModal('login')}>Login</a>
                        <a onClick={() => openAuthModal('signup')}>Sign up</a>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
