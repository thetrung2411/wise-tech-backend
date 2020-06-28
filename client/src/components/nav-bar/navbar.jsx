import React, { useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import AuthenticationContext from '../../services/authenticationContextProvider';
import { ReactComponent as TreeIcon } from '../../assets/icons/icon-tree.svg';
import { ReactComponent as ArrowIcon } from '../../assets/icons/icon-arrow-left.svg';
import './navbar.scss';

export default function NavBar() {
    const { authenticationData, clearAuthenticationData } = useContext(AuthenticationContext);

    useEffect(() => {}, [authenticationData]);

    return (
        <ul className='navbar'>
            <div className='navbar-user'>
                <img src='https://placekitten.com/150/150' alt='cat' className='navbar-user-avatar' />
                <div className='navbar-user-info'>
                    <p className='navbar-user-info-name'>{authenticationData.userName}</p>
                    <p className='navbar-user-info-access'>{authenticationData.userId}</p>
                </div>
            </div>

            <NavLink to='/dashboard' exact={true} className='navbar-item'>
                <TreeIcon fill='#fff' className='navbar-item-icon' />
                <p className='navbar-item-label'>Published</p>
            </NavLink>
            <NavLink to='/drafts' className='navbar-item'>
                <TreeIcon fill='#fff' className='navbar-item-icon' />
                <p className='navbar-item-label'>Drafts</p>
            </NavLink>
            <NavLink to='/login' onClick={clearAuthenticationData} className='navbar-item'>
                <ArrowIcon fill='#fff' className='navbar-item-icon' />
                <p className='navbar-item-label'>Logout</p>
            </NavLink>
        </ul>
    );
}
