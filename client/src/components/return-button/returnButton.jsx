import React from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as ArrowIcon } from '../../assets/icons/icon-arrow-left.svg';

import './returnButton.scss';

export default function ReturnButton() {
    const history = useHistory();
    const returnToPreviousPage = () => history.push('/dashboard');
    return (
        <div className='returnButton' onClick={returnToPreviousPage}>
            <ArrowIcon fill='#fff' className='returnButton-icon' />
            <span className='returnButton-text'>Return to Dashboard</span>
        </div>
    );
}
