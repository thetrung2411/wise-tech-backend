import React from 'react';
import PropTypes from 'prop-types';

ViewingContent.propTypes = {
    formData: PropTypes.object,
    toggleViewingMode: PropTypes.func,
    resetPreviewBarAndDialogOpen: PropTypes.func,
};

function ViewingContent(props) {
    const { formData } = props;
    return (
        <div className='previewBar'>
            <div className='previewBar-fieldsContainer'>
                <div className='previewBar-verticalContainer'>
                    <div
                        className={
                            formData.entityType
                                ? `previewBar-verticalContainer-rowTopRadius ${formData.entityType}`
                                : 'previewBar-verticalContainer-rowTopRadius tree'
                        }
                    >
                        <h4 className='previewBar-label'>Reference ID</h4>
                        <p className='previewBar-content'>{formData.referenceId}</p>
                        <h4 className='previewBar-label'>Name</h4>
                        <p className='previewBar-content'>{formData.name}</p>
                        <h4 className='previewBar-label'>Description</h4>
                        <p className='previewBar-content'>{formData.description}</p>
                    </div>

                    {formData.tactic ? (
                        <div className='previewBar-verticalContainer-rowBottomRadius'>
                            <h4 className='previewBar-label'>Tactic</h4>
                            <p className='previewBar-content'>{formData.tactic}</p>
                        </div>
                    ) : null}
                </div>

                {formData.necessity || formData.logic ? (
                    <div className='previewBar-horizontalContainer'>
                        {formData.necessity ? (
                            <div className='previewBar-horizontalContainer-column'>
                                <h4 className='previewBar-label'>Necessity</h4>
                                <p className='previewBar-content'>{formData.necessity}</p>
                            </div>
                        ) : null}
                        {formData.logic ? (
                            <div className='previewBar-horizontalContainer-column'>
                                <h4 className='previewBar-label'>Logic</h4>
                                <p className='previewBar-content'>{formData.logic}</p>
                            </div>
                        ) : null}
                    </div>
                ) : null}

                {formData.if || formData.and || formData.then || formData.because ? (
                    <div className='previewBar-verticalContainer'>
                        {formData.if ? (
                            <div className='previewBar-inputGroup'>
                                <h4 className='previewBar-label'>If</h4>
                                <p className='previewBar-content'>{formData.if}</p>
                            </div>
                        ) : null}

                        {formData.and ? (
                            <div className='previewBar-inputGroup'>
                                <h4 className='previewBar-label'>and</h4>
                                <p className='previewBar-content'>{formData.and}</p>{' '}
                            </div>
                        ) : null}

                        {formData.then ? (
                            <div className='previewBar-inputGroup'>
                                <h4 className='previewBar-label'>then</h4>
                                <p className='previewBar-content'>{formData.then}</p>
                            </div>
                        ) : null}

                        {formData.because ? (
                            <div className='previewBar-inputGroup'>
                                <h4 className='previewBar-label'>because</h4>
                                <p className='previewBar-content'>{formData.because}</p>
                            </div>
                        ) : null}
                    </div>
                ) : null}

                {formData.sufficiency || formData.optionalityAndSequence ? (
                    <div className='previewBar-horizontalContainer'>
                        {formData.sufficiency ? (
                            <div className='previewBar-horizontalContainer-column'>
                                <h4 className='previewBar-label'>Sufficiency</h4>
                                <p className='previewBar-content'>{formData.sufficiency}</p>
                            </div>
                        ) : null}

                        {formData.optionalityAndSequence ? (
                            <div className='previewBar-horizontalContainer-column'>
                                <h4 className='previewBar-label'>Optionality&amp;Sequence</h4>
                                <p className='previewBar-content'>{formData.optionalityAndSequence}</p>
                            </div>
                        ) : null}
                    </div>
                ) : null}
            </div>
            <div className='previewBar-ctaGroup'>
                <button
                    className='previewBar-ctaGroup-button previewBar-ctaGroup-button--negative'
                    onClick={props.resetPreviewBarAndDialogOpen}
                >
                    Close Preview
                </button>
                <button
                    className='previewBar-ctaGroup-button previewBar-ctaGroup-button--positive'
                    onClick={props.toggleViewingMode}
                >
                    Edit Node
                </button>
            </div>
        </div>
    );
}

export default ViewingContent;
