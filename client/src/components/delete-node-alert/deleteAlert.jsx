import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import cogoToast from 'cogo-toast';
import { DELETE_NODE } from '../../services/graphQL/editorApiHelper';

import './deleteAlert.scss';

DeleteAlert.propTypes = {
    toggleDeleteDialog: PropTypes.func,
    nodeData: PropTypes.object,
    refreshView: PropTypes.func,
};

export default function DeleteAlert(props) {
    const [deleteNodeAndAllChildren] = useMutation(DELETE_NODE);
    function deleteNodeAndToggleDialog() {
        deleteNodeAndAllChildren({
            variables: { id: props.nodeData.id },
        })
            .then(res => {
                cogoToast.success(`Succesfully deleted node ${res.data.deleteNodeAndAllChildren.referenceId}`);
                props.refreshView();
            })
            .catch(err => cogoToast.error(err.message));
        props.toggleDeleteDialog();
    }
    return (
        <div className='deleteDialog'>
            <div className='deleteDialog-label'>Deleting this node will remove all of its children. Are you sure?</div>
            <div className='deleteDialog-buttonGroup'>
                <button onClick={props.toggleDeleteDialog} className='deleteDialog-buttonGroup--cancel'>
                    Cancel
                </button>
                <button onClick={deleteNodeAndToggleDialog} className='deleteDialog-buttonGroup--delete'>
                    Delete
                </button>
            </div>
        </div>
    );
}
