import React from 'react';
import '../App.scss';
import logo from '../images/logo_1_black.png';

const Header = () => {
  return (
    <div>
      <img className="header__logo" src={logo} alt="LOGO"></img>
    </div>
  );
};

export default Header;
