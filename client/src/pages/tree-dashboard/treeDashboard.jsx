import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import TreeCard from '../../components/tree-card/treeCard.jsx';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import cogoToast from 'cogo-toast';
import './treeDashboard.scss';
import NavBar from '../../components/nav-bar/navbar';
import ErrorLayout from '../../components/error-layout/errorLayout.jsx';
import LoadingLayout from '../../components/loading-layout/loadingLayout.jsx';
export default function TreeDashboard(props) {
    const { data: queryData, error: queryError, refetch } = useQuery(
        gql`
            {
                getAllRootNodes {
                    id
                    lastUpdated
                    name
                    status
                    treeId
                }
            }
        `,
        {
            pollInterval: 10000,
        }
    );

    const [mutateTreeStatus] = useMutation(
        gql`
            mutation mutateTreeStatus($treeId: ID, $newStatus: nodeStatusEnum) {
                updateRootNodeStatus(id: $treeId, status: $newStatus) {
                    id
                    status
                }
            }
        `
    );

    function modifyTreeStatus(treeId, newStatus) {
        mutateTreeStatus({
            variables: { treeId, newStatus },
        })
            .then(() => cogoToast.success(`Tree status updated to ${newStatus.toUpperCase()}`))
            .catch(() => cogoToast.error('Failed to update Tree. Please try again later'));
    }

    useEffect(() => {
        refetch();
    }, [mutateTreeStatus, refetch]);

    if (queryError) {
        return (
            <div>
                <NavBar />
                <ErrorLayout />
            </div>
        );
    } else if (queryData) {
        return (
            <div>
                <NavBar />
                <div className='treeList page-content'>
                    {queryData.getAllRootNodes
                        .filter(tree => tree.status === props.treeStatus)
                        .map(tree => {
                            return (
                                <TreeCard
                                    key={tree.treeId}
                                    name={tree.name}
                                    treeId={tree.treeId}
                                    status={tree.status}
                                    lastUpdated={tree.lastUpdated}
                                    thumbnail={tree.thumbnail}
                                    modifyTreeStatus={modifyTreeStatus}
                                />
                            );
                        })}
                    <TreeCard key='0' />
                </div>
            </div>
        );
    }

    return (
        <div>
            <NavBar />
            <LoadingLayout />;
        </div>
    );
}

TreeDashboard.propTypes = {
    treeStatus: PropTypes.string,
};
