const units = {
  cup: ['c', 'c.', 'C', 'Cups'],
  gallon: ['gal'],
  ounce: ['oz', 'oz.'],
  pint: ['pt', 'pts', 'pt.'],
  pound: ['lb', 'lb.', 'lbs'],
  quart: ['qt', 'qt.', 'qts'],
  tablespoon: ['tbs', 'tbsp', 'tbspn', 'T', 'T.', 'Tablespoons', 'Tablespoon', 'Tbsp.', 'tbsp.'],
  teaspoon: ['tsp', 'tspn', 't', 't.', 'tsp.'],
  gram: ['g', 'g.'],
  kilogram: ['kg', 'kg.'],
  liter: ['l', 'l.'],
  milligram: ['mg', 'mg.'],
  milliliter: ['ml', 'ml.'],
  package: ['pkg', 'pkgs'],
  stick: ['sticks', 'stick'],
  sprig: ['sprigs', 'sprig', 'long sprigs'],
  clove: ['cloves', 'clove'],
  large: ["large"],
  medium: ["medium"],
  small: ["small"],
  half: ["half"],
  inch: ['inch', '"']
};

const pluralUnits = {
  cup: 'cups',
  gallon: 'gallons',
  ounce: 'ounces',
  pint: 'pints',
  pound: 'pounds',
  quart: 'quarts',
  tablespoon: 'tablespoons',
  teaspoon: 'teaspoons',
  gram: 'grams',
  kilogram: 'kilograms',
  liter: 'liters',
  milligram: 'milligrams',
  milliliter: 'milliliters',
  clove: 'cloves',
  bag: 'bags',
  box: 'boxes',
  pinch: 'pinches',
  can: 'cans',
  slice: 'slices',
  sprig: 'sprigs',
  clove: 'cloves'
};

const unitEquivalence = {
  cup: {
    tablespoon: 16,
    teaspoon: 48,
    liter: 0.236588,
    ounce: 8,
    'fluid ounce': 8,
    pint: 0.5,
    milliliter: 236.588
  },
  tablespoon: {
    cup: 0.0625,
    teaspoon: 3,
    ounce: 0.5,
    "fluid ounce": 0.5,
    milliliter: 14.7868,
  },
  teaspoon: {
    cup: 0.0205,
    tablespoon: 0.3333,
    milliliter: 4.9289
  }
}

//unit will be the final changed unit
const changeUnitTo = (ingredient, unit) => {
  return Object.assign( {}, ingredient, 
    {
      unit: unit,
      quantity: (unitEquivalence[ingredient.unit][unit] * Number(ingredient.quantity)).toString()
    }
  )
}

/**
 * Volume:
 *  Cup = 
 *    0.0625 gallons
 *    16 tablespoons
 *    48 teaspoons
 *    0.236588 liters
 *    8 fluid oz
 * 
 *  Gallon = 
 *    120 fluid oz (fl)
 *    3.785 liters
 *    16 cups
 * 
 */

module.exports = {
  units: units,
  pluralUnits: pluralUnits,
  convertUnits: changeUnitTo
}
