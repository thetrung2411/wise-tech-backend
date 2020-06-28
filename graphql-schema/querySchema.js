/**
 * This file is for querying data from mongodb
 */

const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLList } = graphql;
const _ = require('lodash');
const Node = require('../mongodb-models/node');

const nodeType = require('../graphql-typings/nodeType');

module.exports = new GraphQLObjectType({
    name: 'NodeQuery',
    fields: {
        //Function to return a single node given an ID
        getNodeById: {
            type: nodeType,
            args: {
                id: {
                    type: GraphQLID,
                },
            },
            resolve(parent, args) {
                return Node.findById(args.id);
            },
        },
        // Function to return all the root nodes
        getAllNodes: {
            type: GraphQLList(nodeType),
            resolve() {
                return Node.find();
            },
        },
        getAllRootNodes: {
            type: new GraphQLList(nodeType),
            resolve() {
                return Node.find({ isRoot: true });
            },
        },
        getTreeById: {
            type: new GraphQLList(nodeType),
            args: {
                id: {
                    type: GraphQLID,
                },
            },
            resolve(parent, args) {
                return Node.find({ treeId: args.id });
            },
        },
    },
});
