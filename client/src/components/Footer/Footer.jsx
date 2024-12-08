import React from 'react'
import Logo from '../../assets/logo.svg'
import './Footer.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <>

            <footer className="footer">

                <div className="start">
                    <img src={Logo} alt="Bhansa Logo" />
                    <label>Bhansa</label>
                </div>

                <div className="end">
                    <a href="tel:+9779861918458"><FontAwesomeIcon icon={faPhone} /></a>
                    <a href="mailto:dhakalkritish7@gmail.com"><FontAwesomeIcon icon={faEnvelope} /></a>
                    <a href="https://facebook.com/KriTisHD8/" target='_blank'><FontAwesomeIcon icon={faFacebook} /></a>
                    <a href="https://instagram.com/kritishd8" target='_blank'><FontAwesomeIcon icon={faInstagram} /></a>
                    <a href="https://x.com/kritishd8" target='_blank'><FontAwesomeIcon icon={faTwitter} /></a>
                </div>

            </footer>

        </>
    )
}

export default Footer