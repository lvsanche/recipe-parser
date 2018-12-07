var convert = require('./convert');
var allUnits = require('./units');
var units = allUnits.units;
var pluralUnits = allUnits.pluralUnits;
var convertUnits = allUnits.convertUnits;
var repeatingFractions = require('./repeatingFractions');
var Natural = require('natural');

const nounInflector = new Natural.NounInflector();

function getUnit(input) {
  if (units[input] || pluralUnits[input]) {
    return [input];
  }
  for (const unit of Object.keys(units)) {
    for (const shorthand of units[unit]) {
      if (input === shorthand) {
        return [unit, input];
      }
    }
  }
  for (const pluralUnit of Object.keys(pluralUnits)) {
    if (input === pluralUnits[pluralUnit]) {
      return [pluralUnit, input];
    }
  }
  return [];
}

function parse(recipeString) {
  const ingredientLine = recipeString.trim();
  
  let [quantity, noQuantity] = convert.findQuantityAndConvertIfUnicode(ingredientLine);//as string[];
  
  quantity = convert.convertFromFraction(quantity);

  let extraInfo;
  if (convert.getFirstMatch(noQuantity, /\(([^\)]+)\)/)) {
    extraInfo = convert.getFirstMatch(noQuantity, /\(([^\)]+)\)/);
    noQuantity = noQuantity.replace(extraInfo, '').trim();
  }
  // console.log(noQuantity);
  const [unit, shorthand] = getUnit(noQuantity.split(' ')[0]); //as string[];
  
  const ingredient = !!shorthand ? noQuantity.replace(shorthand, '').trim() : noQuantity.replace(unit, '').trim();

  return {
    quantity,
    unit: !!unit ? unit : null,
    ingredient: extraInfo ? `${extraInfo} ${ingredient}` : ingredient
  };
}

function combine(ingredientArray) {
  const combinedIngredients = ingredientArray.reduce((acc, ingredient) => {
    const key = ingredient.ingredient // when combining different units, remove this from the key and just use the name
    
    const existingIngredient = acc[key];
  
    if (existingIngredient) {
      return Object.assign(acc, { [key]: combineTwoIngredients(existingIngredient, ingredient) });
    } else {
      return Object.assign(acc, {[key]: ingredient});
    }
  }, {})
  
  return Object.keys(combinedIngredients).reduce((acc, key) => {
    const ingredient = combinedIngredients[key];
    return acc.concat(ingredient);
  }, []).sort(compareIngredients);
}

function prettyPrintingPress(ingredient) {
  let quantity = '';
  let unit = ingredient.unit;
  if (ingredient.quantity) {
    const [whole, remainder] = ingredient.quantity.split('.');
    if (+whole !== 0 && typeof whole !== 'undefined') {
      quantity = whole;
    }
    if (+remainder !== 0 && typeof remainder !== 'undefined') {
      let fractional;
      if (repeatingFractions[remainder]) {
        fractional = repeatingFractions[remainder];
      } else {
        const fraction = '0.' + remainder;
        const len = fraction.length - 2;
        let denominator = Math.pow(10, len);
        let numerator = +fraction * denominator;
        
        const divisor = gcd(numerator, denominator);
  
        numerator /= divisor;
        denominator /= divisor;
        fractional = Math.floor(numerator) + '/' + Math.floor(denominator);
      }

      quantity += quantity ? ' ' + fractional : fractional;
    }
    if (((+whole !== 0 && typeof remainder !== 'undefined') || +whole > 1) && unit) {
      unit = nounInflector.pluralize(unit);
    }
  } else {
    return ingredient.ingredient;
  }

  return `${quantity}${unit ? ' ' + unit : ''} ${ingredient.ingredient}`;
}

function gcd(a, b) {
  if (b < 0.0000001) {
    return a;
  }

  return gcd(b, Math.floor(a % b));
}


function combineTwoIngredients(existingIngredients, ingredient) {
  //must make sure that units work
  var quantity;
  var unit;
  if ( existingIngredients.unit !== ingredient.unit){
    if ( existingIngredients.unit === 'cup' && (ingredient.unit === 'tablespoon' || ingredient.unit === 'teaspoon')){
      quantity = (Number(convertUnits(ingredient, 'cup').quantity) + Number(existingIngredients.quantity)).toString();
      unit = 'cup';
    }
    else if (ingredient.unit === 'cup' && (existingIngredients.unit === 'tablespoon' || existingIngredients.unit === 'teaspoon')){
      quantity = (Number(convertUnits(existingIngredients, 'cup').quantity) + Number(ingredient.quantity)).toString();
      unit = 'cup';
    }
    else if (existingIngredients.unit === 'tablespoon' && ingredient.unit === 'teaspoon'){
      quantity = (Number(convertUnits(ingredient, 'tablespoon').quantity) + Number(existingIngredients.quantity)).toString();
      unit = 'tablespoon';
    }
    else if ( ingredient.unit === 'tablespoon' && existingIngredients.unit === 'teaspoon'){
      quantity = (Number(convertUnits(existingIngredients, 'tablespoon').quantity) + Number(ingredient.quantity)).toString();
      unit = 'tablespoon';
    }
    else {
      //means there was no quantity
      quantity = null;
    }
  }
  else if ( existingIngredients.quantity === ingredient.quantity && ingredient.quantity === null){
    quantity = null;
    unit = null;
  }
  else {
    quantity = (Number(ingredient.quantity) + Number(existingIngredients.quantity)).toString();
    unit = existingIngredients.unit;
  }

  //time to make sure units are not too long
  if( quantity ){
    var aQua = quantity.split('.');
    if ( aQua[1].length > 3){
      quantity = aQua[0] + '.' + aQua[1].substr(0,3);
    }
  }
  

  return Object.assign({}, existingIngredients, { quantity, unit});
}

function compareIngredients(a, b) {
  if (a.ingredient === b.ingredient) {
    return 0;
  }
  return a.ingredient < b.ingredient ? -1 : 1;
}

module.exports = {
  parse: parse,
  getUnit: getUnit,
  prettyPrintingPress: prettyPrintingPress,
  combine: combine,
  combineTwoIngredients: combineTwoIngredients
}