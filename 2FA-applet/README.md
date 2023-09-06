# 2FA-applet

## Twilio Setup

### Install Twilio CLI

Macos

```
brew tap twilio/brew && brew install twilio
```

Windows

```
scoop bucket add twilio-scoop https://github.com/twilio/scoop-twilio-cli
scoop install twilio
```

Linux

```
wget -qO- https://twilio-cli-prod.s3.amazonaws.com/twilio_pub.asc \
  | sudo apt-key add -
sudo touch /etc/apt/sources.list.d/twilio.list
echo 'deb https://twilio-cli-prod.s3.amazonaws.com/apt/ /' \
  | sudo tee /etc/apt/sources.list.d/twilio.list
sudo apt update
sudo apt install -y twilio
```

Docker

```
docker run -it --rm twilio/twilio-cli bash
```

Npm

```
npm install -g twilio-cli
```

#### Login into Twilio CLI

for this you need to acquire:

ACCOUNT_SID and AUTH_TOKEN

You can find the Auth Token in the Account Info pane of the [Console Dashboard page](https://console.twilio.com/?frameUrl=%2Fconsole%3F_ga%3D2.245783552.549853343.1649763806-804730721.1649763806%26x-target-region%3Dus1).
![How to find tokens](https://support.twilio.com/hc/article_attachments/5015061068443/dashboard.png)

Your account's Auth Token is hidden by default. Click show to display the token, and hide to conceal it again.

```
twilio login
```

Account credentials now stored locally on your machine.  
Unix machine path:

```
/Users/${username}/.twilio-cli/config.json
```

PROFILE_ID: name of profile you've just created

```
twilio profiles:use PROFILE_ID
```

Alternatively you can setup those variables for Twilio-cli locally:

```
export TWILIO_ACCOUNT_SID=""
```

```
export TWILIO_AUTH_TOKEN=""
```

#### Install serverless toolkit:

```
twilio plugins:install @twilio-labs/plugin-serverless
```

### Create Twilio verification service:

Go to [Twilio Console](https://console.twilio.com/us1/develop/verify/services?frameUrl=%2Fconsole%2Fverify%2Fservices%3Fx-target-region%3Dus1)

press "Create new service", name it as you like. You'll be redirected to service page.
Save that "SERVICE SID" value you will need it later to update enviromental variable "VERIFY_SERVICE_SID" of the project.

## Download and install project

use node v.16 for this project

```
git clone git@github.com:salemove/integr-applets.git
```

```
cd integr-applets/2FA-applet/verify-service
```

Create .env file

```
cat env.example >> .env
```

Open .env file and manually add all secret values from your Twilio account.  
Atricle on how to obtain API_KEY_ID, API_KEY_SECRET you can find on [Glia Developer Portal](https://docs.glia.com/glia-support/docs/how-to-get-a-user-api-key).  
GLIA_BASE_URL should be prompted itself if it doesn't work please contact Glia Team

Install dependencies

```
npm install
```

## Client setup

All files of the client part are placed in /client folder of this repository.
This folder includes the react application and applet.html file which we upload to Glia Hub
from dashboard (read below how to upload applet) and provide iframe with a link of our deployed application on twilio.
Also, applet.html file includes all Glia API services and provides data using (query params) to the application link in iframe src attribute.

### How to run front-end locally

Open your folder with repository in terminal and go to /client folder:

```
cd 2FA-applet/client
```

Build all packages:

```
yarn
```

Start your application (it will automatically open this application on localhost:3000):

```
yarn start
```

In order to make application work fine locally please comment lines with window.parent.postMessage in all files where it's used (don't forget to redo it when you will push changes. It should be done, because we can't send postMessages outside of Glia Dashboard correctly.

### How to build front-end

Open your folder with repository in terminal and go to /client folder:

```
cd 2FA-applet/client
```

Build all packages:

```
yarn
```

Build your application:

```
yarn build
```

If you want to run you build you can just open
index.html file from /client/build folder in your browser. It's not required to build it because
we don't do any build commands during deployment proccess too.

## Theaming

We have 3 themes in our application based on 3 available statuses that user can see.

Statuses with its theme names:

```
PRE-VERIFICATION - noAuthorizedTheme
ERROR - errorTheme
VERIFIED - successTheme
```

All theme objects placed in:

```
2FA-applet/client/src/utils/themes.js
```

Colors used for themes placed in:

```
2FA-applet/client/src/utils/colors.js
```

Theme chnaging is handled by react-jss ThemeProvider and state
with current theme in App.jsx component. Path to App.jsx:

```
2FA-applet/client/src/App.jsx
```

## Deployment

### Applet file upload

On this step we should take the applet.html file from a /client folder and
upload it in GliaHub when we do any updates in this file. For example, iframe changes or API connection.

First of all, you should go to applet.html. Path to this file:

```
/2FA-applet/client/applet.html
```

Set a value of siteId and serviceLink variables in this file. [Where can you find the site id?](https://docs.glia.com/glia-support/docs/where-can-i-find-the-site-id)
Do not forget to save your changed applet.html file with your siteId.

Log in into Glia Hub [Glia Hub login page](https://app.glia.com/login)
(If you login from Ukraine use VPN).

Go to admin panel from the sidebar or follow [this link](https://app.glia.com/#/admin)

Press "Advanced" button in the bottom of the sidebar

Choose Applets category from the left sidebar with Categories

Find applet with name "2FA" and click pencil icon in the last column in order to edit an Applet

You will see a new screen with Applet parameters, You can change its name, description, HTML file and applet icon (it should be SVG or PNG). Press Choose file over against "Upload an HTML file with applet source code" field. It should be your updated the applet.html file (up to 1Mb).

Refresh Glia Hub in your browser

Go to 2FA tab in your [dashboard](https://app.glia.com/#/) to check your changes

### Twilio upload

There is "build.sh" script created to build and deploy project for your convenience.  
Path: 2FA-applet/build.sh  
Make it executable

```
chmod 755 build.sh
```

Check that 2FA-applet/verify-service/.env file containts all neccesary variables and simply run script:

```
./build.sh
```

Now you should have you twilio project up and running!

### Phone input

International phone input is created with Twilio library "International Telephone Input".
All docs about how does this input work and what configurations it has you may find [here](https://github.com/jackocnr/intl-tel-input).
