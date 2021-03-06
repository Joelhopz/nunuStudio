"use strict";

/**
 * Geometry loader can be used to load geometry files.
 * 
 * @class GeometryLoader
 * @module Loaders
 * @param {Object} manager
 */
function GeometryLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;

	this.shapes = {};
}

/**
 * Set list of shapes to be used by this loader.
 *
 * @method setShapes
 * @param {Array} shapes
 */
GeometryLoader.prototype.setShapes = function(shapes)
{
	this.shapes = shapes;
	return this;
};


/**
 * Load geometry json file from URL.
 *
 * @method load
 * @param {string} url
 * @param {Function} onLoad
 * @param {Function} onProgress
 * @param {Function} onError
 */
GeometryLoader.prototype.load = function(url, onLoad, onProgress, onError)
{
	var loader = new THREE.FileLoader(this.manager);
	loader.load(url, function(text)
	{
		onLoad(self.parse(JSON.parse(text)));
	}, onProgress, onError);
};

/**
 * Parse geometry json.
 *
 * @method parse
 * @param {Object} json
 * @return {Geometry} Geometry loaded from json.
 */
GeometryLoader.prototype.parse = function(data)
{
	var geometry = null;
	
	if(data.type === "CapsuleBufferGeometry")
	{
		geometry = new CapsuleBufferGeometry(data.radiusTop, data.radiusBottom, data.height, data.radialSegments, data.heightSegments, data.capsTopSegments, data.capsBottomSegments, data.thetaStart, data.thetaLength);
	}
	else if(data.type === "RoundedBoxBufferGeometry")
	{
		geometry = new RoundedBoxBufferGeometry(data.width, data.height, data.depth, data.radius, data.radiusSegments);
	}
	else if(data.type === "Geometry")
	{
		var loader = new LegacyGeometryLoader();
		geometry = loader.parse(data.data).geometry;
	}
	else
	{
		var geometries = THREE.ObjectLoader.prototype.parseGeometries([data], this.shapes);
		for(var i in geometries)
		{
			geometry = geometries[i];
			break;
		}
	}

	geometry.uuid = data.uuid;
	geometry.name = data.name !== undefined ? data.name : "geometry";

	return geometry;
};
