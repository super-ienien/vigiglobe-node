"use strict";
const request = require ('request');
const API = require ('./api');

class Project
{
    constructor (id)
    {
        this.id = id;
        this._id = id;
        this.name = '';
        this.description = '';
        this.queries = null;
        this.paused = null;
        this.schedule = null;
        this.timezone = "";
        this.sources = "";
        this.topics = null;
        this.updated_at = null;
        this.draft = null;
        this.paused_at = null;
        this.languages = null;
        this.created_at = null;
        this.customerId = null;
    }

    updateDetails (opts)
    {
        opts = Object.assign({
            queryDetails: true
        ,   projectDetails: true
        }, opts || {});
        var queries = [];
        if (opts.queryDetails)
        {
            queries.push(this.query (API.ENDPOINT_QUERIES)
            .then(function (response)
            {
                this.queries = response.data;
            }));
        }
        if (opts.projectDetails)
        {
            queries.push(API.query (API.ENDPOINT_PROJECTS+'/'+this.id)
            .bind(this)
            .then(function(response)
            {
                Object.assign(this, response.data);
            }));
        }

        return Promise.all(queries);
    }

    query (endpoint, params)
    {
        let p = params && typeof params === 'object' ? params : {};
        p.project_id = this.id;

        return API.query(endpoint, p).bind(this);
    }
}

exports = module.exports = Project;