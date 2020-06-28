/**
 * This is for declaring and exporting Enumtypes for GraphQL
 */

const graphql = require('graphql');
const { GraphQLEnumType } = graphql;

const nodeEntityTypeEnum = new GraphQLEnumType({
    name: 'nodeEntityTypeEnum',
    values: {
        horizon: { value: 'horizon' },
        injection: { value: 'injection' },
        strategy: { value: 'strategy' },
        lever: { value: 'lever' },
    },
});

const nodeStatusEnum = new GraphQLEnumType({
    name: 'nodeStatusEnum',
    values: {
        published: { value: 'published' },
        archived: { value: 'archived' },
        draft: { value: 'draft' },
    },
});

module.exports = { nodeEntityTypeEnum, nodeStatusEnum };
