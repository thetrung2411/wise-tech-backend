const graphql = require('graphql');
const { GraphQLSchema } = graphql;

const querySchema = require('./querySchema');
const mutationSchema = require('./mutationSchema');

module.exports = new GraphQLSchema({
    query: querySchema,
    mutation: mutationSchema
});
