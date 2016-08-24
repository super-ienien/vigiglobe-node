"use strict";

const request = require ('request');
const Promise = require ('bluebird');

request.getAsync = Promise.promisify(request.get);

const api = require ('./lib/api');
const Project = require('./lib/project');

let cache = {};

exports = module.exports = VigiglobeNode;

function VigiglobeNode (projectID)
{
    return cache[projectID] || (cache[projectID] = new Project (projectID));
}

VigiglobeNode.query = api.query;

VigiglobeNode.now = api.now;

VigiglobeNode.clearCache = function (projectID)
{
    if (projectID)
    {
        delete cache[projectID];
    }
    else
    {
        cache = {};
    }
};
