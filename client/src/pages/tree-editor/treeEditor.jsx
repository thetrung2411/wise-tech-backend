import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { select, hierarchy, tree, linkHorizontal, zoom, zoomTransform } from 'd3';
import { getNodeById, treeFormatter, getNodeColorByEntityType } from './treeEditorHelper';
import { GET_TREE_BY_ID } from '../../services/graphQL/editorApiHelper';
import {
    renderNode,
    renderLabel,
    renderPath,
    renderDescription,
    renderDescriptionNode,
    removeDuplicateDOM,
    renderTactics,
    renderTacticsNode,
    transformWhenZoom,
    expandLabelCoverTactics,
    hideDescriptionAndTacticsWhenZoom,
    hideEmptyDescriptionTactics,
} from './d3Helper';
import useResizeObserver from './treeResizeObserver';
import { PreviewBar } from '../../components/preview-bar/previewBar';
import Menu from '../../components/editor-dropdown-menu/dropdownMenu';
import DeleteAlert from '../../components/delete-node-alert/deleteAlert';
import ErrorLayout from '../../components/error-layout/errorLayout';
import LoadingLayout from '../../components/loading-layout/loadingLayout';
import ReturnButton from '../../components/return-button/returnButton';
import './treeEditor.scss';

function TreeEditor() {
    const history = useHistory();
    const treeId = history.location.pathname.substring(6);
    const { data, error, refetch } = useQuery(GET_TREE_BY_ID, {
        variables: {
            id: treeId,
        },
        pollInterval: 10000,
    });

    // Handle D3 Graph Generation & MouseControl Logic
    const [currentZoomState, setCurrentZoomState] = useState({
        k: 0.5,
        x: 400,
        y: 300,
    });
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);
    const zoomBehavior = zoom().scaleExtent([0.1, 1]).on('zoom', handleZoom);

    function handleZoom() {
        if (isDeleteDialogOpen === false) {
            const zoomState = zoomTransform(svgRef.current);
            setCurrentZoomState(zoomState);
            setIsDialogOpen(false);
        }
    }
    // Handles Node Manipulation Logic
    const [toolTip, setToolTip] = useState({ show: false, x: 0, y: 0 });
    const [currentPreviewNode, setCurrentPreviewNode] = useState({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isPreviewBarOpen, setIsPreviewBarOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [viewMode, updateViewMode] = useState('viewing');
    const [formattedTree, setFormattedTree] = useState('');
    const toggleIsDialogOpen = useCallback(() => {
        if (!isPreviewBarOpen) setIsDialogOpen(!isDialogOpen);
    }, [isDialogOpen, isPreviewBarOpen]);
    const toggleIsPreviewBarOpen = useCallback(() => setIsPreviewBarOpen(!isPreviewBarOpen), [isPreviewBarOpen]);
    const toggleDeleteDialog = useCallback(() => setIsDeleteDialogOpen(!isDeleteDialogOpen), [isDeleteDialogOpen]);
    const resetPreviewBarAndDialogOpen = useCallback(() => {
        setIsPreviewBarOpen(false);
        setIsDialogOpen(false);
        updateViewMode('viewing');
    }, []);

    function setPreviewMode(view) {
        updateViewMode(view);
    }
    function updateCurrentNode(node) {
        setCurrentPreviewNode(node);
    }

    const refetchTree = () => refetch();

    useEffect(() => {
        function toggleToolTip(x, y) {
            setToolTip({ show: isDialogOpen, x: x, y: y });
        }

        function triggerMenu(node) {
            if (!isDeleteDialogOpen) {
                setCurrentPreviewNode(getNodeById(node.data.id, data.getTreeById));
                toggleIsDialogOpen();
                toggleToolTip(node.y + currentZoomState.x + 50, node.x + currentZoomState.y + 200, true);
            }
        }
        if (data) {
            if (!dimensions) return;
            setFormattedTree(treeFormatter(data.getTreeById));
            const svg = select(svgRef.current);
            const root = hierarchy(formattedTree);
            root.x = currentZoomState.x;
            root.y = currentZoomState.y;
            var h = 275;
            var w = 600;
            if (currentZoomState.k < 0.6) {
                h = 100;
                w = 300;
            }
            const treeLayout = tree()
                .nodeSize([h, w])
                .separation(function (a, b) {
                    return a.parent === b.parent ? 1 : 1.25;
                });
            treeLayout(root);

            if (currentZoomState) {
                const linkGenerator = linkHorizontal()
                    .x(node => node.y + currentZoomState.x + 180)
                    .y(node => node.x + currentZoomState.y + 200);
                renderPath(svg, root, linkGenerator, currentZoomState.k);
                renderNode(
                    svg,
                    root,
                    node => node.y + currentZoomState.x + 50,
                    node => node.x + currentZoomState.y + 160,
                    node => getNodeColorByEntityType(node.data.entityType),
                    currentZoomState.k
                );

                renderDescriptionNode(
                    svg,
                    root,
                    node => node.y + currentZoomState.x + 50,
                    node => node.x + currentZoomState.y + 240,
                    node => getNodeColorByEntityType(node.data.entityType),
                    currentZoomState.k
                );

                renderLabel(
                    svg,
                    root,
                    node => node.y + currentZoomState.x + 50,
                    node => node.x + currentZoomState.y + 160,
                    currentZoomState.k,
                    node => {
                        return `[${node.data.referenceId}] ${node.data.name}`;
                    },
                    node => getNodeColorByEntityType(node.data.entityType)
                ).on('click', node => {
                    triggerMenu(node);
                });

                renderDescription(
                    svg,
                    root,
                    node => node.y + currentZoomState.x + 50,
                    node => node.x + currentZoomState.y + 240,
                    currentZoomState.k,
                    node => node.data.description
                ).on('click', node => {
                    triggerMenu(node);
                });
                renderTacticsNode(
                    svg,
                    root,
                    node => node.y + currentZoomState.x + 230,
                    node => node.x + currentZoomState.y + 240,
                    currentZoomState.k,
                    node => node.data.tactic
                );
                renderTactics(
                    svg,
                    root,
                    node => node.y + currentZoomState.x + 230,
                    node => node.x + currentZoomState.y + 240,
                    currentZoomState.k,
                    node => node.data.tactic
                ).on('click', node => {
                    triggerMenu(node);
                });
                if (currentZoomState.k < 0.6) {
                    hideDescriptionAndTacticsWhenZoom(svg);
                }
                svg.selectAll('.dropdownHolder').raise();
                svg.selectAll('.deleteDialogHolder').raise();
            }
            removeDuplicateDOM();
            expandLabelCoverTactics('tacticsText', 'node');
            expandLabelCoverTactics('tacticsText', 'label');
            hideEmptyDescriptionTactics();
            svg.call(zoomBehavior);
            transformWhenZoom(svg, currentZoomState);
        }
    }, [
        currentZoomState,
        dimensions,
        zoomBehavior,
        currentPreviewNode,
        toggleIsDialogOpen,
        formattedTree,
        isDeleteDialogOpen,
        data,
        isDialogOpen,
    ]);
    if (data) {
        return (
            <div ref={wrapperRef} className='treeEditor'>
                <ReturnButton />
                <dialog open={isPreviewBarOpen}>
                    {currentPreviewNode.id ? (
                        <PreviewBar
                            rootNodeId={formattedTree.id}
                            nodeData={currentPreviewNode}
                            refreshView={refetchTree}
                            handleNodeAttributesUpdate={updateCurrentNode}
                            closeForm={toggleIsPreviewBarOpen}
                            chooseMode={viewMode}
                            closePreview={resetPreviewBarAndDialogOpen}
                        />
                    ) : null}
                </dialog>
                <svg ref={svgRef} className='treeEditor-canvas'>
                    <foreignObject
                        width='200'
                        height='122'
                        x={toolTip.x + 50}
                        y={toolTip.y}
                        className='dropdownHolder'
                        transform={`translate(${currentZoomState.x}, ${currentZoomState.y}) scale(${currentZoomState.k})`}
                        style={{ visibility: isDialogOpen ? 'visible' : 'hidden' }}
                    >
                        <Menu
                            togglePreviewBar={toggleIsPreviewBarOpen}
                            closeForm={toggleIsDialogOpen}
                            togglePreviewMode={setPreviewMode}
                            toggleDeleteDialog={toggleDeleteDialog}
                        />
                    </foreignObject>
                    <foreignObject
                        width='300'
                        height='125'
                        className='deleteDialogHolder'
                        x={toolTip.x}
                        y={toolTip.y}
                        transform={`translate(${currentZoomState.x}, ${currentZoomState.y})scale(${currentZoomState.k})`}
                        style={{ visibility: isDeleteDialogOpen ? 'visible' : 'hidden' }}
                    >
                        <DeleteAlert
                            nodeData={currentPreviewNode}
                            toggleDeleteDialog={toggleDeleteDialog}
                            refreshView={refetch}
                        />
                    </foreignObject>
                </svg>
            </div>
        );
    } else if (error) {
        return (
            <div ref={wrapperRef}>
                <ErrorLayout isStandAlonePage={true} />
            </div>
        );
    } else {
        return (
            <div ref={wrapperRef}>
                <LoadingLayout isStandAlonePage={true} />
            </div>
        );
    }
}

export default TreeEditor;
