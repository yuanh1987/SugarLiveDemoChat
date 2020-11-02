function routePhoneNumber(phone_number){
    var routing_table = [
         ['+33102030405', 'hplovecraft']
    ];
    var agent_username = false;
    for(let i in routing_table){
         let row = routing_table[i];
         if(row[0] === phone_number){
             agent_username = row[1];
             break;
         }
    }
    return agent_username;
}

function routeCustomer(customerName){
    var table = {
        'HP Lovecraft': 'hplovecraft',
    };
    
    if(table[customerName]){
        return table[customerName];
    }
    return customerName;
}

exports.handler = async (event, contex, callback) => {
    var channel = event['Details']['ContactData']['Channel'];
    if(channel === 'CHAT'){
        
        if(event['Details']['ContactData']['Attributes']['agent_username']){
            var agent_name = event['Details']['ContactData']['Attributes']['agent_username'];
            console.log(`New flow: agent sent ${agent_name}`);
            var resultMap = {
              customerName: agent_name
            };
        } else {
            console.log(event['Details']);
            var resultMap = {
                customerName: routeCustomer(event['Details']['ContactData']['Attributes']['customerName']),
            };
        }
        
    } else if (channel === 'VOICE') {
        var phone_number = event['Details']["ContactData"]['CustomerEndpoint']['Address'];
        var agent = routePhoneNumber(phone_number);
        var resultMap = {
            customerName: agent
        };
    }

    callback(null, resultMap);
};