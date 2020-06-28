import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthenticationContext from '../../services/authenticationContextProvider';
import { ReactComponent as LogoBrandFull } from '../../assets/icons/logo-brand-full.svg';

import './login.scss';

const dummyUser = {
    userName: 'Burt Macklin',
    userId: '8293108329032',
    authenticationToken: '127893417289-321yui31hui-1293',
    isLoggedIn: true,
};

export default function Login() {
    const { updateAuthenticationData } = useContext(AuthenticationContext);
    const history = useHistory();
    function handleLoginClick() {
        updateAuthenticationData(dummyUser).then(() => {
            history.push('/dashboard');
        });
    }

    return (
        <div className='loginPage'>
            <LogoBrandFull fill='#FFF' className='loginPage-logo' />
            <div className='loginPage-welcomeCard'>
                <h3 className='loginPage-welcomeCard-message'>Welcome to WiseTech Global Decision Tree</h3>
                <button className='loginPage-welcomeCard-loginButton' onClick={handleLoginClick}>
                    Login
                </button>
            </div>
        </div>
    );
}
