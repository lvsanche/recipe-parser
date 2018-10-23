var index = require('./index');
var expect = require('expect');

describe('combineTwoIngredients', () => {
    it('combines two ingredients when units dont need to be converted', () => {
        var i1 = {
            quantity: '11',
            unit: 'tsp',
            ingredient: 'random' ,
        };
        var i2 = {
            quantity: 12,
            unit: 'tsp',
            ingredient: 'random' ,
        };

        expect(index.combineTwoIngredients(i1, i2)).toEqual({
            quantity: "23",
            unit: 'tsp',
            ingredient: 'random' ,
        })
        expect(index.combineTwoIngredients(i2, i1)).toEqual({
            quantity: "23",
            unit: 'tsp',
            ingredient: 'random' ,
        })
    })

    it('combines two ingredients when units need to be converted (cups, tablespoons)', () => {
        var i1 = {
            quantity: '11',
            unit: 'cup',
            ingredient: 'random' ,
        };
        var i2 = {
            quantity: 12,
            unit: 'tablespoon',
            ingredient: 'random' ,
        };

        expect(index.combineTwoIngredients(i1, i2)).toEqual({
            quantity: (11+ (12*0.0625)).toString() ,
            unit: 'cup',
            ingredient: 'random' ,
        })
        expect(index.combineTwoIngredients(i2, i1)).toEqual({
            quantity: (11+ (12*0.0625)).toString() ,
            unit: 'cup',
            ingredient: 'random' ,
        })
    })

    it('combines two ingredients when units need to be converted (cups, teaspoons)', () => {
        var i1 = {
            quantity: '11',
            unit: 'cup',
            ingredient: 'random' ,
        };
        var i2 = {
            quantity: 12,
            unit: 'teaspoon',
            ingredient: 'random' ,
        };

        expect(index.combineTwoIngredients(i2, i1)).toEqual({
            quantity: (11+ (12*0.0205)).toString() ,
            unit: 'cup',
            ingredient: 'random' ,
        })
        expect(index.combineTwoIngredients(i1, i2)).toEqual({
            quantity: (11+ (12*0.0205)).toString() ,
            unit: 'cup',
            ingredient: 'random' ,
        })
    })

    it('combines two ingredients when units need to be converted (tablespoons, teaspoons)', () => {
        var i1 = {
            quantity: '11',
            unit: 'tablespoon',
            ingredient: 'random' ,
        };
        var i2 = {
            quantity: 12,
            unit: 'teaspoon',
            ingredient: 'random' ,
        };

        expect(index.combineTwoIngredients(i2, i1)).toEqual({
            quantity: (11+ (12*0.3333)).toString() ,
            unit: 'tablespoon',
            ingredient: 'random' ,
        })
        expect(index.combineTwoIngredients(i1, i2)).toEqual({
            quantity: (11+ (12*0.3333)).toString() ,
            unit: 'tablespoon',
            ingredient: 'random' ,
        })
    })
})

describe('combine', () => {
    it('can combine ingredients list: no converting', () => {
        var ingredList = [
            { quantity: '10', unit: 'cup', ingredient: 'walnuts' },
            { quantity: '2', unit: null, ingredient: 'large egg' },
            { quantity: '2.25', unit: 'cup', ingredient: 'vegetable oil' },
            { quantity: '1', unit: 'tablespoon', ingredient: 'walnut oil' },
            { quantity: null,    unit: null,    ingredient: 'freshly ground pepper' },
            { quantity: '0.5', unit: 'cup', ingredient: 'walnuts' },
            { quantity: '2', unit: null, ingredient: 'large egg' },
            { quantity: null,    unit: null,    ingredient: 'freshly ground pepper' },
            { quantity: '2', unit: null, ingredient: 'large egg' },
        ]

        var result = [
            { quantity: null,    unit: null,    ingredient: 'freshly ground pepper' },
            { quantity: '6', unit: null, ingredient: 'large egg' },
            { quantity: '2.25', unit: 'cup', ingredient: 'vegetable oil' },
            { quantity: '1', unit: 'tablespoon', ingredient: 'walnut oil' },
            { quantity: '10.5', unit: 'cup', ingredient: 'walnuts' }
        ];

        expect(index.combine(ingredList)).toEqual(result);
    })

    it('can combine ingredients list: with converting', () => {
        var ingredList = [
            { quantity: '4', unit: 'teaspoon', ingredient: 'vegetable oil' },
            { quantity: '4', unit: 'tablespoon', ingredient: 'vegetable oil' },
            { quantity: '4', unit: 'teaspoon', ingredient: 'vegetable oil' },
            { quantity: '1', unit: 'cup', ingredient: 'vegetable oil' },
            { quantity: '4', unit: 'teaspoon', ingredient: 'vegetable oil' },
         ]

        var cups = ((4+(0.3333*8))*0.0625) + 1 + (4 * 0.0205);
        var result = [
            { quantity: cups.toString(), unit: 'cup', ingredient: 'vegetable oil' },
        ]

        expect(index.combine(ingredList)).toEqual(result);
    })

    
})