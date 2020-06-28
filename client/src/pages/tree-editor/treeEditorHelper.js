export function getNodeById(nodeId, unformattedTreeArray) {
    return unformattedTreeArray.find(node => node.id === nodeId);
}

export function treeFormatter(data) {
    let tree = {};
    let roots = [];
    let node;
    let i;
    for (i = 0; i < data.length; i++) {
        tree[data[i].id] = i;
        data[i].children = [];
    }
    for (i = 0; i < data.length; i++) {
        node = data[i];
        if (node.parentId !== null) {
            data[tree[node.parentId]].children.push(node);
        } else {
            roots.push(node);
        }
    }
    return roots[0];
}

export function getNodeColorByEntityType(entityType) {
    switch (entityType) {
        case 'horizon':
            return '#ff7675';
        case 'injection':
            return '#fdc86e';
        case 'lever':
            return '#55efc4';
        case 'strategy':
            return '#74b9ff';
        default:
            return '#afa5f3';
    }
}
