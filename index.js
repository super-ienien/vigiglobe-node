"use strict";

const request = require ('request');
const Promise = require ('bluebird');

request.getAsync = Promise.promisify(request.get);

const api = require ('./lib/api');
const Project = require('./lib/project');


exports = module.exports = VigiglobeNode;

function VigiglobeNode (projectID)
{
    return new Project (projectID);
}

VigiglobeNode.query = api.query;