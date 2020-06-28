import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import cogoToast from 'cogo-toast';
import { CREATE_CHILD_NODE } from '../../services/graphQL/editorApiHelper';

CreatingContent.propTypes = {
    createNewNode: PropTypes.func.isRequired,
    closeForm: PropTypes.func.isRequired,
    isParentRootNode: PropTypes.bool.isRequired,
    parentId: PropTypes.string.isRequired,
};

function CreatingContent(props) {
    // Define defaults for all form fields so they can be reset on form submission or cancellation
    const defaultState = {
        and: '',
        because: '',
        description: '',
        entityType: 'lever',
        if: '',
        logic: '',
        name: 'New Node',
        necessity: '',
        optionalityAndSequence: '',
        referenceId: 'Ref ID',
        sufficiency: '',
        tactic: '',
        then: '',
    };
    const [formData, setFormData] = useState(defaultState);
    const [createNewChildNode] = useMutation(CREATE_CHILD_NODE);
    const formRef = useRef();

    function handleFormChange(event) {
        const { name, value } = event.target;
        setFormData(formData => ({
            ...formData,
            [name]: value,
        }));
    }

    function createNewData(event) {
        event.preventDefault();
        createNewChildNode({
            variables: {
                and: formData.and,
                because: formData.because,
                description: formData.description,
                entityType: formData.entityType,
                if: formData.if,
                logic: formData.logic,
                name: formData.necessity,
                necessity: formData.name,
                optionalityAndSequence: formData.optionalityAndSequence,
                parentId: props.parentId,
                referenceId: formData.referenceId,
                sufficiency: formData.sufficiency,
                tactic: formData.tactic,
                then: formData.then,
            },
        })
            .then(res => {
                cogoToast.success('Created new node');
                formRef.current.scrollTop = 0;
                props.createNewNode(res.data.createChildNode);
                props.closeForm();
                setFormData(defaultState);
            })
            .catch(err => cogoToast.error(err));
    }

    function handleCloseFormClick(event) {
        event.preventDefault();
        props.closeForm();
        formRef.current.scrollTop = 0;
        setFormData(defaultState);
    }

    useEffect(() => {}, [formData]);

    return (
        <div>
            <form onSubmit={createNewData} onChange={handleFormChange}>
                <input type='submit' style={{ display: 'none' }} />
                <div ref={formRef} className='previewBar'>
                    <div className='previewBar-inputGroup'>
                        <label className='previewBar-inputGroup-label'>Reference ID</label>
                        <input
                            className='previewBar-inputGroup-input'
                            name='referenceId'
                            value={formData.referenceId}
                        ></input>
                    </div>
                    <div className='previewBar-inputGroup'>
                        <label className='previewBar-inputGroup-label'>Entity Type</label>
                        <select
                            name='entityType'
                            value={formData.entityType}
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
                            value={formData.if}
                            placeholder={formData.necessity !== '' ? '[If] is recommended if you have [Necessity]' : ''}
                            name='if'
                        ></textarea>
                    </div>
                    <div className='previewBar-inputGroup'>
                        <label className='previewBar-inputGroup-label'>and</label>
                        <textarea
                            className='previewBar-inputGroup-textarea'
                            value={formData.and}
                            placeholder={formData.tactic !== '' ? '[And] is recommended if you have [Tactic]' : ''}
                            name='and'
                        ></textarea>
                    </div>
                    <div className='previewBar-inputGroup'>
                        <label className='previewBar-inputGroup-label'>then</label>
                        <textarea
                            className='previewBar-inputGroup-textarea'
                            value={formData.then}
                            placeholder={
                                formData.description !== '' ? '[Then] is recommended if you have [Description]' : ''
                            }
                            name='then'
                        ></textarea>
                    </div>
                    <div className='previewBar-inputGroup'>
                        <label className='previewBar-inputGroup-label'>because</label>
                        <textarea
                            className='previewBar-inputGroup-textarea'
                            value={formData.because}
                            placeholder={formData.logic !== '' ? '[Because] is recommended if you have [Logic]' : ''}
                            name='because'
                        ></textarea>
                    </div>
                    <div className='previewBar-inputGroup'>
                        <label className='previewBar-inputGroup-label'>Sufficiency</label>
                        <textarea
                            className='previewBar-inputGroup-textarea'
                            value={formData.sufficiency}
                            name='sufficiency'
                        ></textarea>
                    </div>
                    <div className='previewBar-inputGroup'>
                        <label className='previewBar-inputGroup-label'>Optionality &amp; Sequence</label>
                        <textarea
                            className='previewBar-inputGroup-textarea'
                            value={formData.optionalityAndSequence}
                            name='optionalityAndSequence'
                        ></textarea>
                    </div>
                </div>
                <div className='previewBar-ctaGroup'>
                    <button
                        className='previewBar-ctaGroup-button previewBar-ctaGroup-button--negative'
                        onClick={handleCloseFormClick}
                    >
                        Cancel
                    </button>
                    <button className='previewBar-ctaGroup-button previewBar-ctaGroup-button--positive' type='submit'>
                        Create Node
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreatingContent;
