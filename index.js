/**
 * Project: Flowlytics
 * File name: index.js
 * Created by:  joshbenner on 2/24/18.
 *
 * Outside references: request module
 *
 * Purpose: A wrapper around the Dialogflow Analytics API Calls
 */
"use strict";
const request = require( "request" );

/**
 * Hits the Dialogflow Messages API call for the analytics broken down by intent
 * @param headers - the headers for the HTTP request
 * @param daysAgo - number of days you want to grab analytics for
 * @returns {Promise}
 */
function messages( headers, daysAgo ) {
    return new Promise( function( resolve, reject ) {
        request.get( {
            url: `https://console.dialogflow.com/api/interactions/analytics/messages?timeInterval=${daysAgo}`,
            headers: headers,
            json: true
        }, function( error, response ) {
            if( response.statusCode === 200 || response.statusCode === 201 ) {
                // This is the equivalent of the Messages Object
                resolve( response.body );
            } else if( response.statusCode === 401 ) {
                console.log( `Error type: ${response.body.status.errorType}` );
                console.log( `ErrorDetails: ${response.body.status.errorDetails}` );
                // Return the error object
                reject( response.body.status );
            }
        } );
    } );
}


/**
 * Hits the Dialogflow Analytics API call for averages that were used to make the graphs
 * @param headers - the headers for the HTTP request
 * @param daysAgo - number of days you want to grab analytics for
 * @returns {Promise}
 */
function analytics( headers, daysAgo ) {
    return new Promise( function( resolve, reject ) {
        request.get( {
            url: `https://console.dialogflow.com/api/interactions/analytics?timeInterval=${daysAgo}`,
            headers: headers,
            json: true
        }, function( error, response ) {
            if( response.statusCode === 200 || response.statusCode === 201 ) {
                // This is the equivalent of the Analytics Object,
                // there's just no reason to cast this into a JS Object in case Dialogflow adds more properties
                resolve( response.body );
            } else if( response.statusCode === 401 ) {
                console.log( `Error type: ${response.body.status.errorType}` );
                console.log( `ErrorDetails: ${response.body.status.errorDetails}` );
                // Return the error object
                reject( response.body.status );
            }
        } );
    } );
}


/**
 * Example of the Messages Data Structure response
 * @type {{average_messages_per_user: {24: {current: [*], historical: [*]}, aggregated: {current: number, historical:
 *     number}}, human_timestamps: [*], num_users: {24: {current: [*], historical: [*]}, aggregated: {current: number,
 *     historical: number}}, status: number, timestamps: [*]}}
 */
const Messages = {
    // Holds the raw data as well as aggregated versions of the average messages per user
    "average_messages_per_user": {
        "24": {
            // List of current averages messages per user per day to calculate the aggregate below
            "current": [
                5.2142857142857144,
                6.36231884057971,
                5.903225806451613,
            ],
            // List of historical averages messages per user per day to calculate the aggregate below
            "historical": [
                3.5,
                4.893129770992366,
                5.720430107526882,
            ]
        },
        // Aggregated averages messages per user for the given time length(in days)
        "aggregated": {
            "current": 5.7770270270270272,
            "historical": 5.563380281690141
        }
    },
    // Timestamps at midnight GMT of days your app was used
    "human_timestamps": [
        "2018-02-18T00:00:00",
        "2018-02-19T00:00:00",
        "2018-02-20T00:00:00",
    ],
    // Number of users who've used your app
    "num_users": {
        "24": {
            // List of current users per day to calculate the aggregate below
            "current": [
                14,
                69,
                31,
            ],
            // List of historical users per day to calculate the aggregate below
            "historical": [
                2,
                131,
                93,
            ]
        },
        // Aggregated users count for the given time length(in days)
        "aggregated": {
            // Current number of users in this past {daysAgo}
            "current": 114,
            // Historical number of users over the # of days interval
            "historical": 226
        }
    },
    // Status of the response
    "status": 200,
    // same as human_timestamps, but in time since epoch
    "timestamps": [
        1518912000,
        1518998400,
        1519084800,
    ]
};


/**
 * Example of the Analytics Data Structure response
 * @type {{next_cursor: number, rows: [*]}}
 */
const Analytics = {
    next_cursor: 50,
    // an array containing following data for every intent
    rows: [
        {
            // Percent that users exit an intent
            "exit_rate": 0.11059907834101383,
            // Historical rate that users exist an intent
            "exit_rate_historical": 0.13513513513513514,
            // Name of your intent
            "intent": "LogWater",
            // Optional and only comes back on intents not using the webhook
            "message_groups_agent_response_time": {
                // Median agent response time(in seconds)
                "50_percent": 0.111,
                // 90% agent response time(.1459s)
                "90_percent": 0.14599999999999999
            },
            // Total count of messages sent for an intent. Basically the number of messages users sent to use that
            // intent Ratio of count to message groups count becomes much higher if you don't close the app after an
            // intent
            "message_groups_count": {
                // They unfortunately only return a current property
                "current": 217
            },
            // Total number of times users entered into that intent
            "message_groups_users_count": {
                // They unfortunately only return a current property here
                "current": 35
            }
        },
    ]
};


/**
 * An Analytics class to grab Dialogflow analytics
 * @param tokens - the tokens for the HTTP headers
 * @param daysAgo - number of days you want to grab analytics for. Ex: 1, 7, 30. You can do other number of days, like
 *     135
 * @returns {Promise} - returns a promise with the resp having a property representing the Analytics & Messages Object
 */
module.exports = function Flowlytics( tokens, daysAgo ) {
    // This is shared by both Dialogflow Requests
    const headers = {
        "x-xsrf-token": tokens.xsrf,
        "user-agent": tokens.user_agent,
        "cookie": tokens.cookie,
        "Accept": "application/json, text/plain, */*",
        "Authorization": tokens.auth
    };

    return new Promise( function( resolve, reject ) {
        var promises = [ messages( headers, daysAgo ), analytics( headers, daysAgo ) ];

        return Promise.all( promises ).then( function( results ) {
            resolve( { messages: results[ 0 ], analytics: results[ 1 ] } );
        } ).catch( function( err ) {
            reject( err );
        } );
    } );
};




