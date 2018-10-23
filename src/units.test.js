var units = require('./units');
var expect = require('expect');

describe ('changeUnitTo', () => {
    it('converts tablespoons to cups', () => {
        var ingre = {
            quantity: 5,
            unit: 'tablespoon'            
        };
        expect(units.convertUnits(ingre, 'cup')).toEqual({
            quantity: (5*0.0625).toString(),
            unit: 'cup'
        });
    })
    it('converts teaspoons to cups', () => {
        var ingre = {
            quantity: 48,
            unit: 'teaspoon'            
        };
        expect(units.convertUnits(ingre, 'cup')).toEqual({
            quantity: "0.984",
            unit: 'cup'
        });
    })
})
