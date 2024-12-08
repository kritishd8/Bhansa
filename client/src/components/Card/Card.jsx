import React, { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons';
import './Card.scss';

const Card = ({ id, title, stars, img, link }) => {
    const rating = Math.floor(stars); //? remove decimals from rating
    const decimal = stars - rating; //? get the decimal amuont

    const halfStar = decimal >= 0.3 && decimal <= 0.9;
    const fullStars = [...Array(rating).keys()].map(i => <FontAwesomeIcon key={i} icon={faStar} className="star" />);
    const halfStarIcon = halfStar ? <FontAwesomeIcon icon={faStarHalf} className="star" /> : null;

    return (

        <>

            <a href={link} className="card">
                <img
                    src={img && img.trim() !== "" ? img : "https://picsum.photos/200"}
                    alt={title}
                />
                <div className="info">
                    <div className="stars">
                        {fullStars}
                        {halfStarIcon}
                    </div>
                    <div className="title">
                        <h5>{title}</h5>
                    </div>
                </div>
            </a>


        </>

    )
}

export default Card