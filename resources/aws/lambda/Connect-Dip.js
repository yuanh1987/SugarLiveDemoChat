/*
Please create the following environment variables:
SUGAR_URL: the domain, without the protocol. e.g. myinstance.com
SUGAR_USER: the username for the API user
SUGAR_PWD:  the password for the API user
*/

const https = require('https');

function getContactByPhoneNumber(auth_token, phone_number){
    return new Promise(function (resolve) {
        var postData = JSON.stringify({
            fields : 'first_name',
            filter : [
                {
                    phone_mobile: phone_number
                }
            ]
        });
        
        let options = {
            hostname: process.env.SUGAR_URL,
            port: 443,
            method: "GET",
            path: "/rest/v11_5/Contacts/filter/",
            headers: {
                "OAuth-Token": auth_token,
                'Content-Type': 'application/json'
            }
        }
		var req = https.request(options, (res) => {
			var body = '';
			res.on('data', (d) => {body += d;});
			res.on('end', function() {
                resolve(JSON.parse(body));
            });
		});

		req.on('error', (e) => {console.error('did not find the contact'); console.error(e);});
		req.write(postData);
		req.end();
    });
}

function sugarLogin(){
	return new Promise(function (resolve) {
		var postData = JSON.stringify({
	        	"client_id": "sugar",
		        "grant_type": "password",
		        "password": process.env.SUGAR_PWD,
		        "platform": "base",
		        "username": process.env.SUGAR_USER

		});
		
		var options = {
			hostname: process.env.SUGAR_URL,
			port: 443,
			path: '/rest/v11_5/oauth2/token',
			method: 'POST',
			headers: {'Content-Type': 'application/json'}
		};

		var req = https.request(options, (res) => {
			var body = '';
			res.on('data', (d) => {body += d;});
			res.on('end', function() {
		        let data = JSON.parse(body);
                resolve(data.access_token);
            });
		});

		req.on('error', (e) => {console.error(e);});
		req.write(postData);
		req.end();
	}); // Promise return
}

exports.handler = async (event, contex, callback) => {
	if ( event['Details']["ContactData"]['Channel'] == 'CHAT') {
	    var resultMap = {
	        firstName: ''
	    }
	    callback(null, resultMap);
	}
	else {
	    var phone_number = event['Details']["ContactData"]['CustomerEndpoint']['Address'];
	    console.log("Searching for " + phone_number);
	    
		let token = await sugarLogin();
		console.log("TOKEN " + token);
	    let contact_data = await getContactByPhoneNumber(token, phone_number);
	    console.log(contact_data.records[0].first_name);
	    
	    var resultMap = {
	        firstName: contact_data.records[0].first_name,
	    }
	    callback(null, resultMap);
	}
};