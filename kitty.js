const _ = require('lodash')

// mixins1 are from the lodash-mixins package. Credits to jonschlinkert and doowb
const mixins1 = {
	// Slugify a string. Makes lowercase, and converts dots and spaces to dashes.
	slugifier: function (urlString) {
		return urlString.replace(/ /g, '-').replace(/\./, '').toLowerCase()
	}
}

// mixins2 are from the lodash-deep package. Credits to marklagendijk
const mixins2 = {
	/**
	 * Maps all values in an object tree and returns a new object with the same structure as the original.
	 * @param {Object} object - The object to map.
	 * @param {Function} callback - The function to be called per iteration on any non-object value in the tree.
	 *   Callback is invoked with 2 arguments: (value, propertyPath)
	 *   propertyPath is the path of the current property, in array format.
	 * @returns {Object}
	 */
	deepMapValues: function (object, callback, propertyPath) {
		propertyPath = propertyPath || ''
		if (_.isArray(object)) {
			return _.map(object, deepMapValuesIteratee)
		} else if (
			_.isObject(object) &&
			!_.isDate(object) &&
			!_.isRegExp(object) &&
			!_.isFunction(object)
		) {
			return _.extend({}, object, _.mapValues(object, deepMapValuesIteratee))
		} else {
			return callback(object, propertyPath)
		}

		function deepMapValuesIteratee(value, key) {
			var valuePath = propertyPath ? propertyPath + '.' + key : key
			return _.deepMapValues(value, callback, valuePath)
		}
	}
}

// mixins3 are from the lodash-deeper package. Credits to dustin.tinney, mike.testdouble, and searls.
const mixins3 = (() => {
	function deeplyFilters(collection, predicate, visited) {
		if (_.isObject(collection)) {
			return _.filter(collection, predicate).concat(
				_.flatten(
					_.map(collection, function (val) {
						if (notYetTraversed(val, visited)) {
							return deeplyFilters(
								val,
								predicate,
								visited.concat(collection)
							)
						} else {
							return []
						}
					})
				)
			)
		} else {
			return []
		}
	}

	function notYetTraversed(val, visited) {
		return !_.some(visited, function (other) {
			return other === val
		})
	}

	return {
		filterDeep: function filterDeep(collection, predicate) {
			predicate = predicate || _.identity
			collection = { parent: collection }
			return deeplyFilters(collection, predicate, [])
		}
	}
})()

// mixins4 are from the lodash-addons package. Credits to viveliroi and others
const mixins4 = require('lodash-addons')

// mixins5 are from the lodash-mix package. Credits to steinfletcher
var mixins5 = (function () {
	var extendWith = {};

	/**
	 * _.immutableMerge
	 *
	 * Merges two objects without mutating the two objects
	 * Usage:
	 *    var src = {a: 1, b: 2};
	 *    var dest = {c: 3, d: 4};
	 *    var merged = _.immutableMerge(src, dest);
	 * Produces:
	 *    src -> { a: 1, b: 2 }
	 *    dest -> { c: 3, d: 4 }
	 *    merged -> { a: 1, b: 2, c: 3, d: 4 }
	 *
	 * @param {Object} src - the source object
	 * @param {Object} dest - the destination object
	 * @returns {Object} a new object constructed from properties of src and dest
	 */
	extendWith.immutableMerge = function (src, dest) {
		return _.merge(_.cloneDeep(src), dest);
	};

	/**
	 * _.upsert
	 *
	 * Replaces the element with the new element if it exists (given the matcher)
	 * Inserts the element if the match fails
	 *
	 * Usage:
	 *    var base = [{id: 1, data: 2}, {id: 2, data: 3}, {id: 3, data: {nested: 4}}];
	 *    var matcher = {id: 3, data: {nested: 4}}
	 *    var newElement = {id: 3, data: 5}
	 *    _.upsert(base, matcher, newElement);
	 * Produces:
	 *    [{id: 1, data: 5}, {id: 2, data: 3}, {id: 3, data: 5}]
	 *
	 * @param {Object} base - the base object to act upon
	 * @param {Object} match - the object to search for in base
	 * @param {Object} replacement - the object to replace the match
	 *    with if match is truthy, else push the object to base (which
	 *    increases the length by one)
	 * @returns {Object} the new replaced object
	 */
	extendWith.upsert = function (base, match, replacement) {
		var removed = _.reject(base, match);
		removed.push(replacement);
		return removed;
	};

	/**
	 * _.format
	 *
	 * Formats a string with given parameters.
	 * Usage:
	 *    _.format('Other {} are {}', 'people', 'good plumbers')
	 * Produces:
	 *    'Other people are good plumbers'
	 *
	 * Usage:
	 *    _.format('/{categ}/{isbn}', 'books', '034038204X')
	 * Produces:
	 *    '/books/034038204X'
	 *
	 * Usage:
	 *    _.format('/{categ}/{isbn}', {categ: 'books', isbn: '034038204X'})
	 * Produces:
	 *    '/books/034038204X'
	 *
	 * @param {String} template - the template to format
	 * @param {Object} params - the replacement parameters
	 * @returns {String} the formatted string
	 */
	extendWith.format = function (template, params) {
		var i = 1,
			args = arguments;
		return template.replace(/{[a-zA-Z_$]?[0-9a-zA-Z_$]*}/g, function (match) {
			if (_.isObject(params)) {
				var paramName = match.slice(1, match.length - 1);
				var paramVal = params[paramName];
				return typeof paramVal !== 'undefined' ? paramVal : '';
			} else {
				return typeof args[i] !== 'undefined' ? args[i++] : '';
			}
		});
	};

	/**
	 * _.ordinal
	 *
	 * Usage:
	 *    _.ordinal(142)
	 * Produces:
	 *    'nd'
	 *
	 * Returns the English ordinal suffix of a number
	 * @param {Number} number - the number under test
	 * @returns {String} the ordinal suffix
	 */
	extendWith.ordinal = function (number) {
		number = Math.floor(number);
		var hundredRem = number % 100,
			tenRem = number % 10;
		if (hundredRem - tenRem === 10) {
			return 'th';
		}
		switch (tenRem) {
			case 1:
				return 'st';
			case 2:
				return 'nd';
			case 3:
				return 'rd';
			default:
				return 'th';
		}
	};

	/**
	 * _.uuid
	 *
	 * Usage:
	 *    _.uuid()
	 * Produces:
	 *    '9716498c-45df-47d2-8099-3f678446d776'
	 *
	 * Generates an RFC 4122 version 4 uuid
	 * @see http://stackoverflow.com/a/8809472
	 * @returns {String} the generated uuid
	 */
	extendWith.uuid = function () {
		var d = new Date().getTime();
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
	};

	/**
	 * _.isUuid
	 *
	 * Usage:
	 *    _.isUuid(_.uuid())
	 * Produces:
	 *    true|false
	 *
	 * Validates a version 4 uuid string
	 * @param {String} uuid - the uuid under test
	 * @returns {Boolean} true if the uuid under test is a valid uuid
	 **/
	extendWith.isUuid = function (uuid) {
		var re = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		return re.test(uuid);
	};

	/**
	 * _.compactObject
	 *
	 * Usage:
	 *    var obj = {a: false, b: 3, c: ''};
	 *    _.compactObject(obj)
	 * Produces:
	 *    {b: 3}
	 *
	 * Removes properties from an object where the value is falsy.
	 * Like _.compact but for objects
	 * @param {Object} obj - the object to remove falsy properties from
	 * @returns {Object} the object with falsy properties removed
	 **/
	extendWith.compactObject = function (obj, isDeep) {
		var clone = _.cloneDeep(obj);
		if (isDeep) {
			function traverse(o) {
				for (i in o) {
					if (_.isObject(o[i])) {
						traverse(o[i]);
					} else {
						if (_.isArray(o)) {
							if (!o.length) {
								delete o;
							}
						} else {
							if (!o[i]) {
								delete o[i];
							}
						}
					}
				}
			}

			traverse(clone);
		} else {
			_.each(clone, function (val, key) {
				if (!val) {
					delete clone[key];
				}
			});
		}
		return clone;
	};

	return extendWith;
})();

_.mixin(mixins1)
_.mixin(mixins2)
_.mixin(mixins3)
_.mixin(mixins4)
_.mixin(mixins5)

const kitty = _

module.exports = kitty
