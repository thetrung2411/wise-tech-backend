import { gql } from 'apollo-boost';

export const SET_TREE_STATUS = gql`
    mutation mutateTreeStatus($treeId: ID, $newStatus: nodeStatusEnum) {
        updateRootNodeStatus(id: $treeId, status: $newStatus) {
            id
            status
        }
    }
`;

export const GET_ALL_TREES = gql`
    {
        getAllRootNodes {
            id
            lastUpdated
            name
            status
            treeId
        }
    }
`;

export const CREATE_NEW_ROOT_NODE = gql`
    mutation {
        createRootNode(
            name: "New Tree"
            description: ""
            tactic: ""
            necessity: ""
            logic: ""
            if: ""
            and: ""
            then: ""
            because: ""
            sufficiency: ""
            optionalityAndSequence: ""
        ) {
            id
        }
    }
`;
