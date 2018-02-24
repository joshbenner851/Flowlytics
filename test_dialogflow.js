/**
 * Project: Flowlytics
 * File name: test_dialogflow
 * Created by:  joshbenner on 2/24/18.
 *
 * Outside references:
 *
 * Purpose:
 */
"use strict";

const analytics = require( "./index" );

const analyticsObj = analytics( {
    "xsrf": "060672b9-7277-46a3-bca2-068d6190e3d8",
    "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
    "cookie": "_ga=GA1.2.3954341.1507907792; zUserAccessToken=9be32ec2-d0ab-490a-b777-2d6b1e3a8028; _gid=GA1.2.1487028782.1519468177; _gat_gtag_UA_98266305_2=1",
    "auth": "Bearer b2e9d1c2-8fc9-4b83-8a00-5d3347ef43db",
}, 7 );

var messages = analyticsObj.then( function( resp ) {
    console.log( resp.analytics.rows );
} );



