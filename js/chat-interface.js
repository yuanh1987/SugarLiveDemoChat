$(window).bind('beforeunload', function(){
    if (window.hasOwnProperty('chatSession')) {
        window.chatSession.endChat();
        delete window.chatSession;
        return 'Are you sure you want to leave?';
    }
});

$(document).ready((a) => {
    connect.ChatInterface.init({
        containerId: 'root' // This is the id of the container where you want the widget to reside
    });

    $('#menu-chat').on('click', function() {
        $('#ChangeSC').addClass('initialized');
    });

    $('#widgetButton').on('click', function() {
        if (!Cookies.get('username')) {
            window.$('#exampleModal').modal('show');
        } else {
            if (window.hasOwnProperty('chatSession')){
                window.chatSession.endChat();
                delete window.chatSession;
            } else {
                initiateChat();
            }
        }
    });

    $('#ChangeSC').on('click', function() {
        SC = $("input[type=radio][name=SC]:checked").val();
        username = $("input[type=radio][name=SC]:checked").data('alias');
        if (SC === undefined) {
            alert("Please select a SC or press Close");
        }
        else {
            Cookies.set('username', username, { expires: 30});
            window.$('#exampleModal').modal('hide');
        }

        if(!$('#ChangeSC').hasClass('initialized')) {
            if (window.hasOwnProperty('chatSession')){
                window.chatSession.endChat();
                delete window.chatSession;
            } else {
                initiateChat();
            }
        }
    });

    $('a.aws_get').on( 'click', (function() {
        $('#contacts-table').modal('show');

        $('.x-button').on('click', function() {
            $('#contacts-table').modal('hide');
        });

        $.ajax({
            method: "GET",
            url: "aws-be.php"
        })
            .done(function( msg ) {
                var contacts = JSON.parse(msg);
                var contactRow;
                console.log(contacts.length);
                if (contacts.length != 0){
                    $("#classTable tbody").find('tr').remove();
                    contacts.forEach(function (item) {
                        contactRow += `<tr>
                                <td>${item['contact_id']}</td>
                                <td>${item['created_at']}</td>
                            </tr>`;
                    });

                    $("#classTable").append(contactRow);
                } else {
                    $("#classTable tbody").find('tr').remove();
                }
            });
    }));
    $('a.aws_delete, .delete-btn').on( 'click', (function() {
        $.ajax({
            method: "DELETE",
            url: "aws-be.php"
        })
            .done(function( msg ) {
            });
    }));
});

function initiateChat() {
    let username = Cookies.get('username');
    let customerName = $("input[type=radio][name=SC]:checked").val();

    $('.section-chat').toggle();

    var contactFlowId = ""; // TODO: Fill in
    var instanceId = ""; // TODO: Fill in
    var apiGatewayEndpoint = ""; // TODO: Fill in with the API Gateway endpoint created by your CloudFormation template

    connect.ChatInterface.initiateChat({
        name: 'Awesome customer',
        region: "us-west-2", // TODO: Fill in
        apiGatewayEndpoint: apiGatewayEndpoint,
        contactAttributes: JSON.stringify({
            "agent_username": username
        }),
        contactFlowId: contactFlowId,
        instanceId: instanceId
    },successHandler, failureHandler);

}

function successHandler(chatSession) {
    $.ajax({
        method: "POST",
        url: "aws-be.php",
        data: { contact_id: chatSession.contactId, participant_id: chatSession.thisParticipant.participantId }
    })
        .done(function( msg ) {
        });

    window.chatSession = chatSession;
    $('#section-chat').fadeIn(400);
    chatSession.onChatDisconnected(function(data) {
        debugger;
        $.ajax({
            method: "DELETE",
            url: `aws-be.php?contact_id=${chatSession.contactId}`,
        })
            .done(function( msg ) {
            });

        $('#section-chat').hide('slide');
        delete window.chatSession;

        $('#ChangeSC').removeClass('initialized');
    });
}

function failureHandler(error) {
    $('#ChangeSC').removeClass('initialized');
}
