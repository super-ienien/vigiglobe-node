"use strict";

const request = require ('request');
const Promise = require ('bluebird');

Promise.config({
    cancellation: true,
});

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

VigiglobeNode.parseDate = api.parseDate;
VigiglobeNode.startAt = api.startAt;
VigiglobeNode.endAt = api.endAt;


VigiglobeNode.parseDate = api.parseDate;
VigiglobeNode.timeInfos = api.timeInfos;

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

VigiglobeNode.log = function (active)
{
    if (typeof active === 'undefined') return api.log;
    api.log = active;
};