const snailFish = require('./snailFish');
const stringUtil = require('../utils/stringUtil');

const assertEqual = function (expected, actual) {
    if (expected === actual) {
        return;
    }

    throw "assertEqual failed. Expected '" + expected + "' was '" + actual + "'";
};

const assertNull = function (value) {
    if (value == null) {
        return;
    }

    throw "assertNull failed. Expected 'null' was '" + value + "'";
};

const success = function (test) {
    console.log(test.name + " succeeded");
};

const failed = function (test) {
    console.log(test.name + " failed");
};

const snailFishTest = {
    tests: [
        {
            name: "explode() test 1",
            execute: function () {
                stringUtil.string = '[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]';
                stringUtil.position = 5;
                snailFish.stringUtil = stringUtil;
                snailFish.explode();
                assertEqual('[[[[0,7],4],[7,[[8,4],9]]],[1,1]]', stringUtil.string);
            }
        },
        {
            name: "explode() test 2",
            execute: function () {
                stringUtil.string = '[[[[0,7],4],[7,[[8,4],9]]],[1,1]]';
                stringUtil.position = 17;
                snailFish.stringUtil = stringUtil;
                snailFish.explode();
                assertEqual('[[[[0,7],4],[15,[0,13]]],[1,1]]', stringUtil.string);
            }
        },
        {
            name: "explode() test 3",
            execute: function () {
                stringUtil.string = '[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]';
                stringUtil.position = 23;
                snailFish.stringUtil = stringUtil;
                snailFish.explode();
                assertEqual('[[[[0,7],4],[[7,8],[6,0]]],[8,1]]', stringUtil.string);
            }
        },
        {
            name: "split() test 1",
            execute: function () {
                stringUtil.string = '[[[[0,7],4],[15,[0,13]]],[1,1]]';
                stringUtil.position = 13;
                snailFish.stringUtil = stringUtil;
                snailFish.split();
                assertEqual('[[[[0,7],4],[[7,8],[0,13]]],[1,1]]', stringUtil.string);
            }
        },
        {
            name: "split() test 2",
            execute: function () {
                stringUtil.string = '[[[[0,7],4],[[7,8],[0,13]]],[1,1]]';
                stringUtil.position = 22;
                snailFish.stringUtil = stringUtil;
                snailFish.split();
                assertEqual('[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]', stringUtil.string);
            }
        },
        {
            name: "run() test 1",
            execute: function () {
                snailFish.numbers = [
                    '[[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]]',
                    '[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]'
                ];
                snailFish.sum = snailFish.numbers[0];

                snailFish.run(c => {});
                assertEqual('[[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]', snailFish.sum);
            }
        },
        {
            name: "run() test 2",
            execute: function () {
                snailFish.numbers = [
                    '[[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]',
                    '[7,[5,[[3,8],[1,4]]]]'
                ];
                snailFish.sum = snailFish.numbers[0];

                snailFish.run(c => {});
                assertEqual('[[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]]', snailFish.sum);
            }
        },
        {
            name: "run() test 3",
            execute: function () {
                snailFish.numbers = [
                    '[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]',
                    '[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]',
                    '[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]',
                    '[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]',
                    '[7,[5,[[3,8],[1,4]]]]',
                    '[[2,[2,2]],[8,[8,1]]]',
                    '[2,9]',
                    '[1,[[[9,3],9],[[9,0],[0,7]]]]',
                    '[[[5,[7,4]],7],1]',
                    '[[[[4,2],2],6],[8,7]]'
                ];
                snailFish.sum = snailFish.numbers[0];
                const answers = [
                    '[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]',
                    '[[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]]',
                    '[[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]',
                    '[[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]]',
                    '[[[[6,6],[6,6]],[[6,0],[6,7]]],[[[7,7],[8,9]],[8,[8,1]]]]',
                    '[[[[6,6],[7,7]],[[0,7],[7,7]]],[[[5,5],[5,6]],9]]',
                    '[[[[7,8],[6,7]],[[6,8],[0,8]]],[[[7,7],[5,0]],[[5,5],[5,6]]]]',
                    '[[[[7,7],[7,7]],[[8,7],[8,7]]],[[[7,0],[7,7]],9]]',
                    '[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]'
                ];
                snailFish.run(c => {
                    assertEqual(answers[c], snailFish.sum);
                });

                assertEqual('[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]', snailFish.sum);
            }
        },
        {
            name: "magnitude() test 1",
            execute: function () {
                snailFish.sum = '[[1,2],[[3,4],5]]';
                assertEqual(143, snailFish.magnitude());
            }
        },
        {
            name: "magnitude() test 2",
            execute: function () {
                snailFish.sum = '[[[[0,7],4],[[7,8],[6,0]]],[8,1]]';
                assertEqual(1384, snailFish.magnitude());
            }
        },
        {
            name: "magnitude() test 3",
            execute: function () {
                snailFish.sum = '[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]';
                assertEqual(3488, snailFish.magnitude());
            }
        },
    ],
    runTests: function () {
        this.tests.forEach(test => {
            try {
                test.execute();
                success(test);
            } catch (e) { 
                console.log(e);
                failed(test);
            }
        });
    }
}

module.exports = snailFishTest;