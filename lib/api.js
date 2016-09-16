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
            let n = new Date();
            console.log (n.toJSON() + ' - ' + response.request.href);
        }
        if (response.statusCode != 200) throw new VigiglobeError(response, response.body);
        if (response.headers.hasOwnProperty('date')) serverTimeDelta = Date.parse(response.headers.date)-Date.now();
        let data = JSON.parse (response.body);
        if (data.error) throw VigiglobeError(response.url, params, response, data.error);
        if (data.hasOwnProperty('error') && data.hasOwnProperty('data'))
        {
            return {endpoint: endpoint, query: qs, response: response, data: data.data};
        }
        else return {endpoint: endpoint, query: qs, response: response, data: data};
    });
};

function formatDate (date)
{
    switch (typeof date)
    {
        case 'number':
            if (date < 0) return exports.now(date).toJSON();
        break;
        case 'string':
            if (date === 'now') return exports.now().toJSON();
            if (date.startsWith(':'))
            {
                if (date.startsWith(':from-'))
                {
                    let timeFrom = moment.utc(Number(date.substr(6)));
                    if (!timeFrom.isValid()) return '';
                    let time = moment();
                    time.hours (timeFrom.hours());
                    time.minutes (timeFrom.minutes());
                    time.seconds (timeFrom.seconds());
                    time.milliseconds (timeFrom.milliseconds());
                    if (time.isAfter(exports.now(-30000))) time.subtract(1, 'day');
                    return time.toJSON();
                }
            }
        break;
        case 'object':
            if (date instanceof Date) return date.toJSON();
    }
    return date;
}

exports.parseDate = formatDate;
exports.timeInfos = function (timeFrom, timeTo)
{
    let r = {startAt: null, endAt: null, resetAt: null};

    switch (typeof timeFrom)
    {
        case 'string':
            if (timeFrom.startsWith(':'))
            {
                if (timeFrom.startsWith(':from-'))
                {
                    timeFrom = moment.utc(Number(timeFrom.substr(6)));
                    if (timeFrom.isValid())
                    {
                        let time = moment();
                        time.hours (timeFrom.hours());
                        time.minutes (timeFrom.minutes());
                        time.seconds (timeFrom.seconds());
                        time.milliseconds (timeFrom.milliseconds());
                        if (time.isAfter(exports.now(-30000))) time.subtract(1, 'day');
                        r.resetAt = time.add(1, 'day').toDate();
                    }
                }
            }
            break;
        case 'object':
            if (timeFrom instanceof Date) r.startAt = timeFrom;
    }

    switch (typeof timeTo)
    {
        case 'object':
            if (timeTo instanceof Date) r.endAt = timeTo;
    }

    return r;
};

exports.startAt = function ()
{

};

