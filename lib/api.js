"use strict";

const request = require('request');

exports.HOST = 'https://api.wizr.io/';
exports.ENDPOINT_QUERIES = 'api/resources/queries';
exports.ENDPOINT_PROJECTS = 'api/resources/projects';

exports.query = function (endpoint, qs)
{
    let params = {
        uri: exports.HOST+endpoint
    };
    if (qs) params.qs = qs;

    return request.getAsync(params)
    .then(function (response)
    {
        if (response.statusCode != 200) throw new Error (response.body);
        let data = JSON.parse (response.body);
        if (data.error) throw new Error (data.error);
        if (data.hasOwnProperty('error') && data.hasOwnProperty('data'))
        {
            return data.data;
        }
        else return data;
    });
};