import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import EditNodeLayout from './editNode.layout';
import ViewNode from './viewNode.layout';
import CreateNodeLayout from './createNode.layout';
import './previewBar.scss';

export function PreviewBar(props) {
    const [viewingMode, setViewingMode] = useState(props.chooseMode);
    const [formData, setFormData] = useState(props.nodeData);

    useEffect(() => {
        setFormData(props.nodeData);
        setViewingMode(props.chooseMode);
    }, [props.nodeData, props.chooseMode]);

    function toggleViewingMode() {
        viewingMode === 'viewing' ? setViewingMode('editing') : setViewingMode('viewing');
    }

    if (viewingMode === 'viewing') {
        return (
            <ViewNode
                resetPreviewBarAndDialogOpen={props.closePreview}
                toggleViewingMode={toggleViewingMode}
                formData={formData}
            />
        );
    } else if (viewingMode === 'editing') {
        return (
            <EditNodeLayout
                updateCurrentNode={props.handleNodeAttributesUpdate}
                toggleViewingMode={toggleViewingMode}
                formData={formData}
                isParentRootNode={formData.parentId === props.rootNodeId}
            />
        );
    } else if (viewingMode === 'creating') {
        return (
            <CreateNodeLayout
                createNewNode={props.refreshView}
                closeForm={props.closeForm}
                isParentRootNode={!formData.parentId}
                parentId={formData.id}
            />
        );
    } else return null;
}

PreviewBar.propTypes = {
    rootNodeId: PropTypes.string.isRequired,
    nodeData: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        entityType: PropTypes.string,
        description: PropTypes.string,
        tactic: PropTypes.string,
        necessity: PropTypes.string,
        logic: PropTypes.string,
        if: PropTypes.string,
        and: PropTypes.string,
        then: PropTypes.string,
        because: PropTypes.string,
        sufficiency: PropTypes.string,
        optionalityAndSequence: PropTypes.string,
        nodeDataColor: PropTypes.string,
        customProperty: PropTypes.string,
        parentId: PropTypes.string,
        children: PropTypes.array,
    }),
    closeForm: PropTypes.func.isRequired,
    handleNodeAttributesUpdate: PropTypes.func.isRequired,
    chooseMode: PropTypes.string.isRequired,
    closePreview: PropTypes.func.isRequired,
    refreshView: PropTypes.func.isRequired,
};
