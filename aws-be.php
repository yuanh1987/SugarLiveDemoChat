<?php

use Aws\Credentials\CredentialProvider;
use Aws\Exception\AwsException;

require __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createUnsafeImmutable(__DIR__);
$dotenv->load();

$chat = (object)[];
$chat->agent = $_COOKIE['username'];

// DB connect
$db = new SugarLiveDemoChatDatabase();

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        {
            if (!empty($chat->agent)) {
                $contact_ids = $db->select($chat);

                echo json_encode($contact_ids);
            } else {
                echo 'You don\'t have any open contacts';
            }
        }
        break;
    case 'POST':
        {
            $chat->id = $_POST['contact_id'];
            $chat->participant_id = $_POST['participant_id'];

            if (!empty($chat->id) && !empty($chat->participant_id)) {
                $db->insert($chat);
                echo 'Record added successfully';
            } else {
                echo 'You can\'t add the chat entry';
            }

        }
        break;
    case 'DELETE':
        {
            $connect_client = new Aws\Connect\ConnectClient([
                'version' => 'latest',
                'region' => $_ENV['AWS_DEFAULT_REGION'],
                'credentials' => CredentialProvider::env(),
            ]);

            if (!empty($chat->agent)) {
                $contact_ids = $db->select($chat);
            } else {
                echo 'You don\'t have any open contacts.' . "\n";
            }

            if (!empty($chat->agent)) {
                $db->delete($chat);
                echo 'Record deleted successfully';
            } else {
                echo 'You cannot delete this contact.';
            }

            foreach ($contact_ids as $c) {
                $rez = $connect_client->stopContact([
                    'ContactId' => $c['contact_id'],
                    'InstanceId' => $_ENV['AWS_INSTANCE_ID']
                ]);
            }
        }
        break;
    default:
        break;
}
