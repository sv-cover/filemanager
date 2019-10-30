# filemanager

A rework of Roxy Filemanager for Cover
The original source code can be found at **[Roxy Fileman](http://www.roxyfileman.com)**.

# Cover api
If you want to test the site on your local machine (which you should do!), you
will also need the [cover-api test
script](https://bitbucket.org/cover-webcie/coverapi-tester/) and a recent
version of [PHP](https://secure.php.net) (>=7). You can place the api test
script in the main folder of the project, and then run:
```bash
php -S  127.0.0.1:8080
```
Now you can log in to your local server using the login details in the coverapi tester script!

# Docker instructions
To test the container locally:
 * Copy config/index-default.js to config/index.js
 * Copy config/fileman-default.js to config/fileman.js
 * Execute the command: `docker build -t test/fileman .` to built the container with the tag `test/fileman:latest`
 * Then run the container with the command: 
 ```bash
 docker run -p 3000:3000 -it --init --name "testFileman" -d test/fileman:latest
 ```
 * Try in the browser http://localhost:3000
 * You can persist the storage of the uploads folder using the volumesflag: `-v /path/to/uploads:/usr/src/app/public/uploads` 
    where `/path/to/uploads` is the absolute path to a local folder.
 * See the **[docker docs](https://docs.docker.com/)** for more info on how to use docker.

# Instructions to run locally
 * Install **[Node.js](https://nodejs.org)**.
 * Install **[GraphicsMagick](http://www.graphicsmagick.org/)**.
 * Clone this template.
 * Copy config/index-default.js to config/index.js
 * Copy config/fileman-default.js to config/fileman.js
 * Execute the commands: `npm install && npm start`
 * Try in the browser http://localhost:3000
