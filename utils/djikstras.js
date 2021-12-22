const djikstras = {
    estimatedNodes: [],
    findShortestPath: function (options) {
        const startNode = options.startNode;
        const destinationNode = options.destinationNode;
        startNode.explored = true;
        startNode.totalDistance = 0;
        startNode.distance = 0;

        let currentNode = startNode;

        while (currentNode != destinationNode) {
            currentNode.adjacentNodes.forEach(adjecent => {
                this.estimateNode(currentNode, adjecent);
            });

            const next = this.estimatedNodes.pop();
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
    },
    draw(result) {
        return result
            .reverse()
            .map(node => '(' + node.x + ', ' + node.y + ') Distance: ' + node.distance + ' Total distance: ' + node.totalDistance + '\r\n')
            .join('');
    }
};

module.exports = djikstras;
