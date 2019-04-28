"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = createStore;
exports.generateValues = generateValues;
exports.hasBeenChanged = hasBeenChanged;
exports.createCleanedStore = createCleanedStore;
exports.uniqueness = exports.types = void 0;

var _Object$freeze, _Object$freeze2, _Object$freeze3;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * This is a typedef, idk how to use it.
 * This would be considered an Enum.
 */
var types = Object.freeze((_Object$freeze = {}, _defineProperty(_Object$freeze, _typeof(""), [_typeof("")]), _defineProperty(_Object$freeze, _typeof([]), [_typeof([])]), _defineProperty(_Object$freeze, _typeof(1), [_typeof(1)]), _defineProperty(_Object$freeze, _typeof(true), [_typeof(true)]), _Object$freeze));
/**
 * This is an Enum, or a typedef?
 */

exports.types = types;
var uniqueness = Object.freeze((_Object$freeze2 = {}, _defineProperty(_Object$freeze2, _typeof(""), true), _defineProperty(_Object$freeze2, _typeof([]), true), _defineProperty(_Object$freeze2, _typeof(1), true), _defineProperty(_Object$freeze2, _typeof(true), false), _Object$freeze2)); //Where index is an int => map( (_, index) ) => {}

exports.uniqueness = uniqueness;
var defaultValuesStore = Object.freeze((_Object$freeze3 = {}, _defineProperty(_Object$freeze3, _typeof(""), function (index) {
  return "".concat(index);
}), _defineProperty(_Object$freeze3, _typeof(1), function (index) {
  return index;
}), _defineProperty(_Object$freeze3, _typeof([]), function (index) {
  return [index];
}), _defineProperty(_Object$freeze3, _typeof(true), function (index) {
  return true;
}), _Object$freeze3));
/**
 * Create a store, 
 * That stores an array of a single type.
 * @param valuesType - [The type of the value, based on the typedef]
 * @return {object} [{
 *      type : valuesType,
 *      hasBeenChanged : false,
 *      initialValueCount : valuesCount,
 *      values : [ ... array of values... ]
 * }]
 */

function createStore() {
  var valuesType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "string";
  var valuesCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
  return {
    type: valuesType,
    hasBeenChanged: false,
    initialValueCount: valuesCount,
    values: generateValues(valuesType, valuesCount)
  };
}

;
/**
 * Generate an array of values, of a given length and type.
 * @param valuesType - The wanted type
 * @param valuesCount - The wanted number
 * @return {Array} [ The array of the given length ]
 * @throws {TypeError} [Throws an error when given an unrecognised type.]
 */

function generateValues() {
  var valuesType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _typeof("");
  var valuesCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

  if (!(valuesType in types)) {
    throw TypeError("'".concat(valuesType, "' is not a recognised type, found in the exported types object."));
  }

  return _toConsumableArray(Array(valuesCount)).map(function (_, index) {
    return defaultValuesStore[valuesType](index);
  });
}

;
/**
 * Return whether or not the values match.
 * Recursively compares lists.
 * @param {*} a 
 * @param {*} b 
 * @return bool whether or not they matched
 */

var recursivelyCompareValue = function recursivelyCompareValue(a, b) {
  if (_typeof(a) != _typeof([])) {
    return a === b;
  } else {
    var match = a.map(function (value, index) {
      return recursivelyCompareValue(value, b[index]);
    }).reduce(function (accumulator, x) {
      return accumulator && x;
    });
    return match;
  }
};

var wereValuesAltered = function wereValuesAltered(store) {
  try {
    var expectedValues = generateValues(store.type, store.initialValueCount);
    var doAllMatch = recursivelyCompareValue(expectedValues, store.values);
    var wasOneAltered = doAllMatch != true;
    return wasOneAltered;
  } catch (err) {
    return true;
  }
};
/**
 * Check if a store has been altered since it's creation.
 * @param store - the given store from createStore
 * @returns whether or not the store was altered
 */


function hasBeenChanged(store) {
  var wasHasBeenChangedChanged = store.hasBeenChanged == true;
  var wasTypeChanged = !(store.type in types);
  var wasLengthChanged = store.values.length != store.initialValueCount;
  var doesValuesMatchExpected = wereValuesAltered(store);
  return wasHasBeenChangedChanged || wasTypeChanged || wasLengthChanged || doesValuesMatchExpected;
}
/**
 * If the store has been altered, returns a "clean" (un-altered) version of the original store.
 * @param store 
 * @returns store - A new version of the store. Never a reference to the old one.
 */


function createCleanedStore(store) {
  //Check if we actually new a new store
  var hasStoreBeenChanged = store.hasBeenChanged || hasBeenChanged(store); //Lol, this actually turned out to be all i needed!

  var cleanedStore = hasStoreBeenChanged ? createStore(store.type, store.initialValueCount) : _objectSpread({}, store);
  return cleanedStore;
}
