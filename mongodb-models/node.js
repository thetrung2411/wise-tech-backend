const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nodeSchema = new Schema({
    //_id: Internal Mongo ID
    and: String,
    because: String,
    childrenIds: [mongoose.ObjectId],
    description: String,
    entityType: String,
    if: String,
    isRoot: Boolean,
    lastUpdated: Date,
    logic: String,
    name: String,
    necessity: String,
    optionalityAndSequence: String,
    parentId: mongoose.ObjectId,
    referenceId: String,
    status: String,
    sufficiency: String,
    tactic: String,
    then: String,
    treeId: mongoose.ObjectId,
});

module.exports = mongoose.model('Node', nodeSchema);
