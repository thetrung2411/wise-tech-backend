import React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import cogoToast from 'cogo-toast';
import { SET_NODE_ATTRIBUTES } from '../../services/graphQL/editorApiHelper';

EditingContent.propTypes = {
    formData: PropTypes.object.isRequired,
    toggleViewingMode: PropTypes.func.isRequired,
    updateCurrentNode: PropTypes.func.isRequired,
    isParentRootNode: PropTypes.bool.isRequired,
};

function EditingContent(props) {
    const [formData, setFormData] = useState(props.formData);
    const [mutateNodeAttributes] = useMutation(SET_NODE_ATTRIBUTES);

    function handleFormChange(event) {
        const { name, value } = event.target;
        setFormData(formData => ({
            ...formData,
            [name]: value,
        }));
    }

    function updateCurrentNode(event) {
        event.preventDefault();
        mutateNodeAttributes({
            variables: {
                id: formData.id,
                and: formData.and,
                because: formData.because,
                description: formData.description,
                entityType: formData.entityType,
                if: formData.if,
                logic: formData.logic,
                name: formData.name,
                necessity: formData.necessity,
                optionalityAndSequence: formData.optionalityAndSequence,
                parentId: formData.parentId,
                referenceId: formData.referenceId,
                sufficiency: formData.sufficiency,
                tactic: formData.tactic,
                then: formData.then,
            },
        })
            .then(res => {
                setFormData(res.data.updateNodeAttributes);
                cogoToast.success(`Updated node ${formData.referenceId}`);
                props.updateCurrentNode(formData);
                props.toggleViewingMode();
            })
            .catch(() => cogoToast.error(`Failed to update node ${formData.referenceId}`));
    }

    useEffect(() => {}, [formData]);

    return (
        <div>
            <form onSubmit={updateCurrentNode} onChange={handleFormChange}>
                <input type='submit' style={{ display: 'none' }} />
                <div className='previewBar'>
                    <div className='previewBar-inputGroup'>
                        <label className='previewBar-inputGroup-label'>Reference ID</label>
                        <input
                            className='previewBar-inputGroup-input'
                            name='referenceId'
                            value={formData.referenceId}
                        ></input>
                    </div>
                    {!formData.isRoot ? (
                        <div className='previewBar-inputGroup'>
                            <label className='previewBar-inputGroup-label'>Entity Type</label>
                            <select
                                name='entityType'
                                value={formData.entityType ? formData.entityType : ''}
                                className='previewBar-inputGroup-dropdown'
                            >
                                {props.isParentRootNode ? (
                                    <option className='previewBar-inputGroup-dropdown-item' value='horizon'>
                                        Horizon
                                    </option>
                                ) : null}
                                <option className='previewBar-inputGroup-dropdown-item' value='lever'>
                                    Lever
                                </option>
                                <option className='previewBar-inputGroup-dropdown-item' value='injection'>
                                    Injection
                                </option>
                                <option className='previewBar-inputGroup-dropdown-item' value='strategy'>
                                    Strategy
                                </option>
                            </select>
                        </div>
                    ) : null}
                    <div className='previewBar-inputGroup'>
                        <label className='previewBar-inputGroup-label'>Name</label>
                        <input className='previewBar-inputGroup-input' name='name' value={formData.name}></input>
                    </div>
                    <div className='previewBar-inputGroup'>
                        <label className='previewBar-inputGroup-label'>Description</label>
                        <textarea
                            className='previewBar-inputGroup-textarea'
                            name='description'
                            value={formData.description}
                        ></textarea>
                    </div>
                    <div className='previewBar-inputGroup'>
                        <label className='previewBar-inputGroup-label'>Tactic</label>
                        <textarea
                            className='previewBar-inputGroup-textarea'
                            name='tactic'
                            value={formData.tactic}
                        ></textarea>
                    </div>
                    <div className='previewBar-inputGroup'>
                        <label className='previewBar-inputGroup-label'>Necessity</label>
                        <textarea
                            className='previewBar-inputGroup-textarea'
                            name='necessity'
                            value={formData.necessity}
                        ></textarea>
                    </div>
                    <div className='previewBar-inputGroup'>
                        <label className='previewBar-inputGroup-label'>Logic</label>
                        <textarea
                            className='previewBar-inputGroup-textarea'
                            name='logic'
                            value={formData.logic}
                        ></textarea>
                    </div>
                    <div className='previewBar-inputGroup'>
                        <label className='previewBar-inputGroup-label'>If</label>
                        <textarea
                            className='previewBar-inputGroup-textarea'
                            name='if'
                            value={formData.if}
                            placeholder={formData.necessity !== '' ? '[If] is recommended if you have [Necessity]' : ''}
                        ></textarea>
                    </div>
                    <div className='previewBar-inputGroup'>
                        <label className='previewBar-inputGroup-label'>and</label>
                        <textarea
                            className='previewBar-inputGroup-textarea'
                            name='and'
                            value={formData.and}
                            placeholder={formData.tactic !== '' ? '[And] is recommended if you have [Tactic]' : ''}
                        ></textarea>
                    </div>
                    <div className='previewBar-inputGroup'>
                        <label className='previewBar-inputGroup-label'>then</label>
                        <textarea
                            className='previewBar-inputGroup-textarea'
                            name='then'
                            value={formData.then}
                            placeholder={
                                formData.description !== '' ? '[Then] is recommended if you have [Description]' : ''
                            }
                        ></textarea>
                    </div>
                    <div className='previewBar-inputGroup'>
                        <label className='previewBar-inputGroup-label'>because</label>
                        <textarea
                            className='previewBar-inputGroup-textarea'
                            name='because'
                            value={formData.because}
                            placeholder={formData.logic !== '' ? '[Because] is recommended if you have [Logic]' : ''}
                        ></textarea>
                    </div>
                    <div className='previewBar-inputGroup'>
                        <label className='previewBar-inputGroup-label'>Sufficiency</label>
                        <textarea
                            className='previewBar-inputGroup-textarea'
                            name='sufficiency'
                            value={formData.sufficiency}
                        ></textarea>
                    </div>
                    <div className='previewBar-inputGroup'>
                        <label className='previewBar-inputGroup-label'>Optionality &amp; Sequence</label>
                        <textarea
                            className='previewBar-inputGroup-textarea'
                            name='optionalityAndSequence'
                            value={formData.optionalityAndSequence}
                        ></textarea>
                    </div>
                    <div className='previewBar-ctaGroup'>
                        <button
                            className='previewBar-ctaGroup-button previewBar-ctaGroup-button--negative'
                            onClick={props.toggleViewingMode}
                        >
                            Cancel Changes
                        </button>
                        <button
                            className='previewBar-ctaGroup-button previewBar-ctaGroup-button--positive'
                            type='submit'
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditingContent;
