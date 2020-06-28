const Node = require('../mongodb-models/node');
const _ = require('lodash');

/**
 * @description Update the child node's parent and tree lastUpdated attributes
 * @param parentId node.parentId
 * @param treeId node.treeId
 * @returns void if success, error if fails
 * @todo pass the node's lastUpdated isoString and set the tree's lastUpdated from that value so that lastUpdated is synced
 */
async function updateTreeLastUpdated(treeId) {
    return new Promise(async (resolve, reject) => {
        try {
            if (treeId) {
                await Node.findByIdAndUpdate(
                    treeId,
                    {
                        lastUpdated: new Date().toISOString(),
                    },
                    () => {}
                ).catch(err => {
                    throw err;
                });
            } else {
                throw "Root Node/Tree doesn't exist";
            }
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * @description Delete a node and all of its children recursively
 * @param nodeId node.id
 * @returns an object with shape { nodeId: xxx, treeId: xxx } if success, error if fails
 */
async function deleteChildrenRecursive(nodeId) {
    return new Promise(async (resolve, reject) => {
        try {
            const nodeToDelete = await Node.findById(nodeId).lean();
            if (!nodeToDelete) {
                throw 'Node to be deleted not found';
            }
            let childIdSearchQueue = [];
            let childIdDeleteStack = [];

            childIdSearchQueue.push(nodeId);

            // Look into children ids of all nodes and add them to the delete stack
            while (childIdSearchQueue.length > 0) {
                let currentNodeId = childIdSearchQueue[0];
                childIdSearchQueue.shift();

                await Node.findById(currentNodeId)
                    .lean(true)
                    .then(currentNode => {
                        if (currentNode) {
                            let childrenIds = _.values(currentNode.childrenIds);

                            for (let childId of childrenIds) {
                                childIdSearchQueue.push(childId);
                                childIdDeleteStack.push(childId);
                            }
                        }
                    })
                    .catch(err => {
                        throw err;
                    });
            }

            // Delete all children in delete stack
            while (childIdDeleteStack.length > 0) {
                await Node.findByIdAndDelete(childIdDeleteStack[0]);
                childIdDeleteStack.shift();
            }
            resolve({
                nodeId: nodeId,
                treeId: nodeToDelete.treeId,
            });
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * @description Delete a node's id from its parent's childrenIds array
 * @param nodeId node.id
 * @returns void if success, error if fails
 */
async function removeChildrenIdFromParent(nodeId) {
    return new Promise((resolve, reject) => {
        Node.findById(nodeId)
            .then(nodeToBeDeleted => {
                Node.findById(nodeToBeDeleted.parentId)
                    .lean()
                    .then(parentNode => {
                        if (parentNode) {
                            let childrenIds = _.values(parentNode.childrenIds);
                            childrenIds = _.filter(childrenIds, id => id != nodeId);

                            Node.findByIdAndUpdate(
                                parentNode,
                                {
                                    childrenIds: childrenIds,
                                    lastUpdated: new Date().toISOString(),
                                },
                                () => {}
                            );
                            resolve();
                        } else {
                            reject('Deleting a Tree is forbidden');
                        }
                    });
            })
            .catch(() => reject('Node not found'));
    });
}

module.exports = { updateTreeLastUpdated, deleteChildrenRecursive, removeChildrenIdFromParent };
