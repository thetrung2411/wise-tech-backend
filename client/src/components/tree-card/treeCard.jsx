import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import cogoToast from 'cogo-toast';
import { Link, useHistory } from 'react-router-dom';

import { ReactComponent as PlusIcon } from '../../assets/icons/icon-plus.svg';
import { ReactComponent as WTLogo } from '../../assets/icons/logo-brand-full.svg';
import toShortDate from '../../services/dateService';
import StatusDropdown from '../tree-status-dropdown/statusDropdown';
import { CREATE_NEW_ROOT_NODE } from '../../services/graphQL/dashboardApiHelper';
import './treeCard.scss';

export default function TreeCard(props) {
    const [createNewRootNode] = useMutation(CREATE_NEW_ROOT_NODE);
    const history = useHistory();
    const treeStatusOptions = {
        published: [
            { label: 'Unpublish', value: 'draft' },
            { label: 'Archive', value: 'archived' },
        ],
        draft: [
            { label: 'Publish', value: 'published' },
            { label: 'Archive', value: 'archived' },
        ],
    };

    function handleNewCardClick() {
        createNewRootNode()
            .then(res => {
                cogoToast.success('This can be found in Drafts', {
                    heading: 'Created a new tree',
                });
                history.replace(`/tree/${res.data.createRootNode.id}`);
            })
            .catch(() => {
                cogoToast.error('Failed to create new node');
            });
    }

    function modifyTreeStatus(selection) {
        if (selection === 'archived') {
            const { hide } = cogoToast.warn('Archived trees can only be restored by Admins', {
                heading: 'Are you sure? Click this to continue',
                onClick: () => {
                    props.modifyTreeStatus(props.treeId, selection);
                    hide();
                },
                hideAfter: 5,
            });
        } else {
            props.modifyTreeStatus(props.treeId, selection);
        }
    }

    if (props.treeId) {
        return (
            <Link to={`/tree/${props.treeId}`}>
                <div key={props.treeId} className='treeCard'>
                    <div alt={props.name} className='treeCard-thumbnail'>
                        <WTLogo fill='#1d1765' />
                    </div>
                    <div className='treeCard-title'>
                        <div className='treeCard-container'>
                            <p className='treeCard-name'>{props.name}</p>
                            <StatusDropdown
                                options={treeStatusOptions[props.status]}
                                modifyTreeStatus={modifyTreeStatus}
                            />
                        </div>
                        <p className='treeCard-info'>Last edited: {toShortDate(props.lastUpdated)}</p>
                    </div>
                </div>
            </Link>
        );
    } else {
        return (
            <div className='treeCard newCard' onClick={handleNewCardClick}>
                <div className='newCard-content'>
                    <PlusIcon fill='#0f2a46' className='newCard-icon'></PlusIcon>
                    <p className='treeCard-name'>Create a new Tree</p>
                </div>
            </div>
        );
    }
}

TreeCard.propTypes = {
    lastUpdated: PropTypes.string,
    name: PropTypes.string,
    status: PropTypes.string,
    thumbnail: PropTypes.string,
    treeId: PropTypes.string,
    modifyTreeStatus: PropTypes.func,
};
