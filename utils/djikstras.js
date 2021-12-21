const djikstras = {
    estimatedNodes: [],
    findShortestPath: function (options) {
        const startNode = options.startNode;
        const destinationNode = options.destinationNode;
        startNode.explored = true;
        startNode.totalDistance = 0;
        destinationNode.distance = 0;
        startNode.adjacentNodes.forEach(adjecent => {
            this.estimateNode(startNode, adjecent);
        });
        let currentNode = this.closestAdjacent(startNode);

        while (currentNode != destinationNode) {
            currentNode.adjacentNodes.forEach(adjecent => {
                this.estimateNode(currentNode, adjecent);
            });

            const next = this.closestAdjacent(currentNode) || this.estimatedNodes.pop();
            this.exploreNode(next);
            currentNode = next;
        }

        let result = [];
        while (currentNode != null) {
            result.push(currentNode);
            currentNode = currentNode.sourceNode;
        }

        return this.draw(result);
    },
    estimateNode: function (sourceNode, node) {
        if (sourceNode == null) {
            node.totalDistance = 0;
        } else if (node.totalDistance > sourceNode.totalDistance + node.distance) {
            node.totalDistance = sourceNode.totalDistance + node.distance;
            node.sourceNode = sourceNode;
        }
        
        if (!node.explored && !this.estimatedNodes.find(n => n == node)) {
            this.estimatedNodes.push(node);
            this.estimatedNodes.sort((a, b) => b.totalDistance - a.totalDistance);
        }
    },
    exploreNode: function (node) {
        node.explored = true;
        this.estimatedNodes.splice(this.estimatedNodes.indexOf(node), 1);
    },
    closestAdjacent(node) {
        const closest = node.adjacentNodes
            .filter(adjacent => !adjacent.explored)
            .sort((a, b) => a.totalDistance - b.totalDistance)[0];

        if (!closest) {
            return null;
        }

        return closest;
    },
    draw(result) {
        return result
            .reverse()
            .map(node => '(' + node.x + ', ' + node.y + ') Total distance: ' + node.totalDistance + '\r\n')
            .join('');
    }
};

module.exports = djikstras;
