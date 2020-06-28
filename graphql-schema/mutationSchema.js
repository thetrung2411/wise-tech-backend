/**
 * This file is for creating/updating data from mongodb
 */

const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;
const Node = require('../mongodb-models/node');
const nodeType = require('../graphql-typings/nodeType');
const { nodeEntityTypeEnum, nodeStatusEnum } = require('../graphql-typings/enums');
const {
    updateTreeLastUpdated,
    deleteChildrenRecursive,
    removeChildrenIdFromParent,
} = require('./mutationHelper');

module.exports = new GraphQLObjectType({
    name: 'NodeMutation',
    fields: {
        createRootNode: {
            type: nodeType,
            args: {
                and: { type: GraphQLString },
                because: { type: GraphQLString },
                description: { type: GraphQLString },
                if: { type: GraphQLString },
                logic: { type: GraphQLString },
                name: { type: GraphQLString },
                necessity: { type: GraphQLString },
                optionalityAndSequence: { type: GraphQLString },
                sufficiency: { type: GraphQLString },
                tactic: { type: GraphQLString },
                then: { type: GraphQLString },
            },
            resolve(parent, args) {
                return (
                    new Node({
                        and: args.and,
                        because: args.because,
                        childrenIds: [],
                        description: args.description,
                        if: args.if,
                        isRoot: true,
                        lastUpdated: new Date().toISOString(),
                        logic: args.logic,
                        name: args.name,
                        necessity: args.necessity,
                        optionalityAndSequence: args.optionalityAndSequence,
                        parentId: null,
                        status: 'draft',
                        sufficiency: args.sufficiency,
                        tactic: args.tactic,
                        then: args.then,
                    })
                        .save()
                        // Set RootNode's treeId to itself after it's been created and return the updated one
                        .then(newRootNode => {
                            return Node.findByIdAndUpdate(
                                newRootNode.id,
                                { treeId: newRootNode.id },
                                () => {}
                            );
                        })
                );
            },
        },
        createChildNode: {
            type: nodeType,
            args: {
                and: { type: GraphQLString },
                because: { type: GraphQLString },
                description: { type: GraphQLString },
                entityType: { type: nodeEntityTypeEnum },
                if: { type: GraphQLString },
                logic: { type: GraphQLString },
                name: { type: GraphQLString },
                necessity: { type: GraphQLString },
                optionalityAndSequence: { type: GraphQLString },
                parentId: { type: GraphQLID },
                referenceId: { type: GraphQLString },
                sufficiency: { type: GraphQLString },
                tactic: { type: GraphQLString },
                then: { type: GraphQLString },
                treeId: { type: GraphQLID },
            },
            resolve(parent, args) {
                return (
                    // Find parent node
                    Node.findById(args.parentId)
                        .then(async parentNode => {
                            // Save new child node
                            return new Node({
                                and: args.and,
                                because: args.because,
                                childrenIds: [],
                                description: args.description,
                                entityType: args.entityType,
                                if: args.if,
                                lastUpdated: new Date().toISOString(),
                                logic: args.logic,
                                name: args.name,
                                necessity: args.necessity,
                                optionalityAndSequence: args.optionalityAndSequence,
                                parentId: args.parentId ? args.parentId : parentNode.id,
                                referenceId: args.referenceId,
                                sufficiency: args.sufficiency,
                                tactic: args.tactic,
                                then: args.then,
                                // Use parentNode.treeId and/or id if args doesn't have parentID and/or treeId
                                treeId: args.treeId ? args.treeId : parentNode.treeId,
                                type: args.type,
                            })
                                .save()
                                .then(async newChildNode => {
                                    // Add newChildNode.id to parent's childrenIds array
                                    await Node.findByIdAndUpdate(
                                        parentNode.id,
                                        {
                                            childrenIds: [
                                                ...parentNode.childrenIds,
                                                newChildNode.id,
                                            ],
                                        },
                                        () => {}
                                    );
                                    await updateTreeLastUpdated(newChildNode.treeId).catch(err => {
                                        return new Error(err);
                                    });
                                    // Return newChildNode once parentNode is done updating
                                    return newChildNode;
                                });
                        })
                        .catch(() => {
                            return new Error('Cannot find parent node');
                        })
                );
            },
        },
        updateRootNodeStatus: {
            type: nodeType,
            args: {
                id: { type: GraphQLID },
                status: { type: nodeStatusEnum },
            },
            resolve(parent, args) {
                return Node.findByIdAndUpdate(
                    args.id,
                    {
                        status: args.status,
                    },
                    { new: true },
                    () => {}
                );
            },
        },
        updateNodeAttributes: {
            type: nodeType,
            args: {
                and: { type: GraphQLString },
                because: { type: GraphQLString },
                description: { type: GraphQLString },
                entityType: { type: nodeEntityTypeEnum },
                id: { type: GraphQLID },
                if: { type: GraphQLString },
                logic: { type: GraphQLString },
                name: { type: GraphQLString },
                necessity: { type: GraphQLString },
                optionalityAndSequence: { type: GraphQLString },
                parentId: { type: GraphQLString },
                referenceId: { type: GraphQLString },
                sufficiency: { type: GraphQLString },
                tactic: { type: GraphQLString },
                then: { type: GraphQLString },
            },
            async resolve(parent, args) {
                return await Node.findByIdAndUpdate(
                    args.id,
                    {
                        and: args.and,
                        because: args.because,
                        description: args.description,
                        entityType: args.entityType,
                        if: args.if,
                        lastUpdated: new Date().toISOString(),
                        logic: args.logic,
                        name: args.name,
                        necessity: args.necessity,
                        optionalityAndSequence: args.optionalityAndSequence,
                        referenceId: args.referenceId,
                        sufficiency: args.sufficiency,
                        tactic: args.tactic,
                        then: args.then,
                    },
                    { new: true },
                    () => {}
                ).then(async updatedNode => {
                    return await updateTreeLastUpdated(updatedNode.treeId)
                        .then(() => {
                            return updatedNode;
                        })
                        .catch(err => {
                            return new Error(err);
                        });
                });
            },
        },
        deleteNodeAndAllChildren: {
            type: nodeType,
            args: {
                id: { type: GraphQLID },
            },
            async resolve(parent, args) {
                try {
                    await removeChildrenIdFromParent(args.id).catch(err => {
                        throw err;
                    });
                    // Delete Node's children
                    return await deleteChildrenRecursive(args.id)
                        .then(async res => {
                            await updateTreeLastUpdated(res.treeId);
                            // Delete this node
                            return await Node.findByIdAndDelete(res.nodeId);
                        })
                        .catch(err => {
                            throw err;
                        });
                } catch (err) {
                    return new Error(err);
                }
            },
        },
    },
});
