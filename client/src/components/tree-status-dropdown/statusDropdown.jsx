import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { ReactComponent as Ellipsis } from '../../assets/icons/icon-ellipsis.svg';
import './statusDropdown.scss';

export default function StatusDropdown(props) {
    const [showMenu, setShowMenu] = useState(false);
    const menu = useRef();

    function toggleShowMenu(event) {
        event.preventDefault();
        if (showMenu) {
            setShowMenu(false);
        } else {
            setShowMenu(true);
        }
    }

    function handleOutsideClick(event) {
        if (!menu.current.contains(event.target)) {
            setShowMenu(false);
        }
    }

    function handleSelection(event) {
        event.preventDefault();
        setShowMenu(false);
        props.modifyTreeStatus(event.target.value);
    }

    useEffect(() => {
        if (showMenu) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [showMenu, props.options]);

    if (props.options) {
        return (
            <div ref={menu} className='statusDropdown'>
                <Ellipsis className='statusDropdown-ellipsis' onClick={toggleShowMenu} />
                <div className={showMenu ? 'statusDropdown-options is-visible' : 'statusDropdown-options'}>
                    {props.options.map((option, index) => (
                        <button
                            className='statusDropdown-options-button'
                            key={index}
                            value={option.value}
                            onClick={handleSelection}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        );
    }
}

StatusDropdown.propTypes = {
    options: PropTypes.array,
    modifyTreeStatus: PropTypes.func,
};
