# SugarLiveDemoChat

Installation steps:

1. Import the database using the schema file found here: 
   <pre>db/sugarlive-demo-chat-db.sql</pre>
2. Create an environment .env file in the root directory with the following data:
   <pre>AWS_CONTACT_FLOW_ID=""
   AWS_INSTANCE_ID=""
   AWS_API_GATEWAY_ENDPOINT=""
   AWS_ACCESS_KEY_ID=""
   AWS_SECRET_ACCESS_KEY=""
   AWS_DEFAULT_REGION="us-west-2"
   DATABASE_DSN="mysql:dbname=sugarlive-demo-chat-db;host=127.0.0.1"
   DATABASE_USER="root"
   DATABASE_PASSWORD="root"</pre>
3. Run the following command in the root folder of your project:
   <pre>composer install
   npm i</pre>