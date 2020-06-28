const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLBoolean } = graphql;
const { nodeEntityTypeEnum, nodeStatusEnum } = require('../graphql-typings/enums');

//Node Type relates to all the nodes of our trees
module.exports = new GraphQLObjectType({
    name: 'node',
    fields: () => ({
        and: { type: GraphQLString },
        because: { type: GraphQLString },
        childrenIds: { type: new GraphQLList(GraphQLID) },
        description: { type: GraphQLString },
        entityType: { type: nodeEntityTypeEnum },
        id: { type: GraphQLID },
        if: { type: GraphQLString },
        isRoot: { type: GraphQLBoolean },
        lastUpdated: { type: GraphQLString },
        logic: { type: GraphQLString },
        name: { type: GraphQLString },
        necessity: { type: GraphQLString },
        optionalityAndSequence: { type: GraphQLString },
        parentId: { type: GraphQLID },
        referenceId: { type: GraphQLString },
        status: { type: nodeStatusEnum },
        sufficiency: { type: GraphQLString },
        tactic: { type: GraphQLString },
        then: { type: GraphQLString },
        treeId: { type: GraphQLString },
    }),
});
