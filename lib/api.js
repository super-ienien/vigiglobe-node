"use strict";

const request = require('request');
const moment = require('moment');
const VigiglobeError = require('./vigiglobe-error');

let serverTimeDelta = 0;

exports.HOST = 'https://api.wizr.io/';
exports.ENDPOINT_QUERIES = 'api/resources/queries';
exports.ENDPOINT_PROJECTS = 'api/resources/projects';

exports.log = false;

exports.now = function (delta)
{
    delta = delta || 0;
    return new Date(delta + Date.now() + (isNaN(serverTimeDelta) ? 0:serverTimeDelta)).toJSON();
};

function _now (delta)
{
    delta = delta || 0;
    return moment(delta + Date.now() + (isNaN(serverTimeDelta) ? 0:serverTimeDelta));
};

exports.query = function (endpoint, qs)
{
    let params = {
        uri: exports.HOST+endpoint
    };
    if (qs)
    {
        params.qs = qs;
        if (qs.hasOwnProperty('timeFrom')) qs.timeFrom = formatDate(qs.timeFrom);
        if (qs.hasOwnProperty('timeTo')) qs.timeTo = formatDate(qs.timeTo);
    }

    return request.getAsync(params)
    .then(function (response)
    {
        if (exports.log)
        {
            let now = new Date();
            console.log (now.toJSON() + ' - ' + response.request.href);
        }
        if (response.statusCode != 200) throw new VigiglobeError(response, response.body);
        if (response.headers.hasOwnProperty('date')) serverTimeDelta = Date.parse(response.headers.date)-Date.now();
        let data = JSON.parse (response.body);
        if (data.error) throw VigiglobeError(response.url, params, response, data.error);
        if (data.hasOwnProperty('error') && data.hasOwnProperty('data'))
        {
            return data.data;
        }
        else return data;
    });
};

function formatDate (date)
{
    switch (typeof date)
    {
        case 'number':
            if (date < 0) return exports.now(date);
        break;
        case 'string':
            if (date === 'now') return exports.now();
            if (date.startsWith(':'))
            {
                if (date.startsWith(':from-'))
                {
                    let time = moment.utc(Number(date.substr(6)));
                    if (!time.isValid()) return '';
                    if (time.isAfter(_now())) time.substract(1, 'day');
                    return time.toJSON();
                }
            }
        break;
        case 'object':
            if (date instanceof Date) return date.toJSON();
    }
    return date;
}