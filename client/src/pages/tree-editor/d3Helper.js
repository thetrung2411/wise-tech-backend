const classNameArray = ['.description', '.descriptionNode', '.node', '.label', '.tactics', '.tacticsNode', '.link'];
const classHideDescription = ['.description', '.descriptionNode', '.tactics', '.tacticsNode'];
const classRemoveDuplicate = ['description', 'label', 'tactics'];
const classHideEmtyClassText = ['tacticsText', 'tacticsText'];
const classHideEmtyClassNode = ['tacticsNode', 'tactics'];

export function renderNode(ref, tree, nodeX, nodeY, color, zoomState) {
    return ref
        .selectAll('.node')
        .data(tree.descendants())
        .join('rect')
        .attr('class', 'node')
        .attr('id', 'node')
        .attr('width', 180)
        .attr('height', 80)
        .attr('x', nodeX)
        .attr('y', nodeY)
        .attr('border-radius', '8px 8px 0')
        .attr('fill', color)
        .attr('transform', 'scale(' + zoomState + ')');
}

export function renderDescriptionNode(ref, tree, nodeX, nodeY, color, zoomState) {
    return ref
        .selectAll('.descriptionNode')
        .data(tree.descendants())
        .join('rect')
        .attr('class', 'descriptionNode')
        .attr('id', 'descriptionNode')
        .attr('width', 180)
        .attr('height', 140)
        .attr('x', nodeX)
        .attr('y', nodeY)
        .attr('fill', '#f2f2f2')
        .attr('transform', 'scale(' + zoomState + ')');
}

export function renderLabel(ref, tree, nodeX, nodeY, zoomState, name, color) {
    return ref
        .selectAll('.label')
        .data(tree.descendants())
        .join('foreignObject')
        .attr('class', 'label')
        .attr('ref', 'labeling')
        .attr('x', nodeX)
        .attr('y', nodeY)
        .attr('width', 180)
        .attr('height', 80)
        .attr('transform', 'scale(' + zoomState + ')')
        .append('xhtml:div')
        .attr('class', 'labelText')
        .text(name)
        .raise();
}

export function renderDescription(ref, tree, nodeX, nodeY, zoomState, description) {
    return ref
        .selectAll('.description')
        .data(tree.descendants())
        .join('foreignObject')
        .attr('class', 'description')
        .attr('x', nodeX)
        .attr('y', nodeY)
        .attr('width', 180)
        .attr('height', 140)
        .attr('transform', 'scale(' + zoomState + ')')
        .append('xhtml:div')
        .attr('class', 'descriptionText')
        .text(description)
        .raise();
}

export function renderTactics(ref, tree, nodeX, nodeY, zoomState, description) {
    return ref
        .selectAll('.tactics')
        .data(tree.descendants())
        .join('foreignObject')
        .attr('class', 'tactics')
        .attr('x', nodeX)
        .attr('y', nodeY)
        .attr('width', 180)
        .attr('height', 140)
        .attr('transform', 'scale(' + zoomState + ')')
        .append('xhtml:div')
        .attr('class', 'tacticsText')
        .text(description)
        .raise();
}

export function renderTacticsNode(ref, tree, nodeX, nodeY, zoomState) {
    return ref
        .selectAll('.tacticsNode')
        .data(tree.descendants())
        .join('rect')
        .attr('class', 'tacticsNode')
        .attr('id', 'tacticsNode')
        .attr('width', 180)
        .attr('height', 140)
        .attr('x', nodeX)
        .attr('y', nodeY)
        .attr('fill', '#f2f2f2')
        .attr('transform', 'scale(' + zoomState + ')');
}

export function renderPath(svg, tree, generator, zoomState) {
    svg.selectAll('.link')
        .data(tree.links())
        .join('path')
        .attr('class', 'link')
        .attr('d', generator)
        .attr('transform', 'scale(' + zoomState + ')')
        .lower();
}

export function transformWhenZoom(svg, currentZoomState) {
    classNameArray.forEach(item => {
        svg.selectAll(item).attr(
            'transform',
            'translate(' + currentZoomState.x + ',' + currentZoomState.y + ') scale(' + currentZoomState.k + ')'
        );
    });
}

export function hideDescriptionAndTacticsWhenZoom(svg) {
    classHideDescription.forEach(item => {
        svg.selectAll(item).remove();
    });
}

function removeDuplicate(dom) {
    for (let i = 0; i < dom.length; i++) {
        if (dom[i].childNodes.length > 1) {
            dom[i].removeChild(dom[i].firstChild);
        }
    }
}

export function removeDuplicateDOM() {
    classRemoveDuplicate.forEach(item => {
        removeDuplicate(document.getElementsByClassName(item));
    });
}

function getIndexEmtyElement(textClass) {
    let z = 0;
    let arrSaveIndexRemove = [];
    for (let i of document.getElementsByClassName(textClass)) {
        i.id = z;
        z += 1;
        if (i.innerHTML === '') arrSaveIndexRemove.push(i.id);
    }
    return arrSaveIndexRemove;
}

function getIndexNonEmptyElement(textClass) {
    let z = 0;
    let arrSaveIndex = [];
    for (let i of document.getElementsByClassName(textClass)) {
        i.id = z;
        z += 1;
        if (i.innerHTML !== '') arrSaveIndex.push(i.id);
    }
    return arrSaveIndex;
}

function hideEmptyNodesByClassName(textClass, background) {
    let classArray = getIndexEmtyElement(textClass);
    for (let k of classArray) {
        document.getElementsByClassName(background)[k].style.display = 'none';
    }
}

export function hideEmptyDescriptionTactics() {
    for (let i = 0; i < classHideEmtyClassText.length; i++) {
        hideEmptyNodesByClassName(classHideEmtyClassText[i], classHideEmtyClassNode[i]);
    }
}

export function expandLabelCoverTactics(label, background) {
    let classArray = getIndexNonEmptyElement(label);
    for (let element of classArray) {
        document.getElementsByClassName(background)[element].width.baseVal.value = 360;
        document.getElementsByClassName('tactics')[element].style.display = 'block';
        document.getElementsByClassName('tacticsNode')[element].style.display = 'block';
    }
}
