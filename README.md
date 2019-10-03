# LinkedIn v2 API Request

Please refer to Linkedin v2 API reference here

https://developer.linkedin.com/docs/guide/v2/organizations/follower-statistics

## Run on local

```
git clone https://github.com/jstortoise/linkedin-v2.git
cd linkedin-v2
npm install
npm start
```

Now, go to http://localhost:4001

## Get OAuth2 Access Token

Open your web browser and type the following URL

http://locahost:4001/auth/linkedin

Now, you can get accessToken

## API request

```
GET http://localhost:4001/auth/linkedin/api/:token
```

`:token` - Please copy your oauth token here
