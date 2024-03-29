# Marine-traffic-portal

Deployed service:
- http://ec2-13-48-126-102.eu-north-1.compute.amazonaws.com/
- http://10.212.169.45/ (Only available on the NTNU internal network)

## General information
This project is the product submission from *Group 6* for the Bachelor thesis subject IDATG2900.

This web application is a maritime monitoring platform, which presents real-time positions 
and relevant information about ships located in the inner Trondheim Fjord. 
The backend component is developed using Python and includes technologies such as Flask, 
SocketIO, CORS, Barentswatch API and MongoDB. In addition, the frontend component is built 
with React.js and uses features such as Server-Sent Events, Leaflet.js and Material UI. 
The application also contains customized functionality that can be activated by interacting 
with the various elements of the user interface. Furthermore, Docker is used to simplify 
the process of running the program in a production environment on other computers, 
which ensures easy portability and operation.

The application depends on the following external service:
- The [BarentsWatch AIS API](https://www.barentswatch.no/artikler/apnedata/) which provides data of vessel positions in real time. The data has been collected by the Norwegian Coastal Administration.

## Endpoints

This web application provides the following endpoints:
```
/                                       - Frontpage
:5000/sse                               - SSE data (for developers)
```

## Deployment

The web application is deployed on:
- http://ec2-13-48-131-46.eu-north-1.compute.amazonaws.com/ (Running in docker on a VM on AWS EC2)
- http://10.212.168.100/ (Running in docker on a VM on SkyHigh. Only available on the NTNU internal network)

The SkyHigh deployment depends on resources supplied by NTNU and will remain accessible only for a limited period in the future.

If you want to run the application locally, you can either build and run the application using Docker Compose, or run the source code.

### Compilation requirements (general)

For the application to be able to compile, you need to add/change the following files:

#### BarentsWatch API access key

Name: ```secrets.txt```  
Location: ```/marine-traffic-portal/server/barentswatch/secrets.txt```

Action: ```Create```

Content:
```python
# Configuration of client secret for connecting to the AIS API
client_secret=your_secret_key
```

#### Frontend eventSource IP

Name: ```Map.jsx```  
Location: ```/marine-traffic-portal/client/src/components/Map/Map.jsx```

Action: ```Change```

Content :

On line 270, input the public IP of your host machine. We suggest you use the command: ``nano -c Map.jsx``
```js
const eventSource = new EventSource('http://PUBLIC_IP:5000/sse');
```

#### Security groups
Port 80, 443, 5000 and 27017 must be added to the security group of your host computer for the web application to work.

### Deployment in Docker

Follow these steps to run the web application with Docker:

1. Clone the repository.
2. Make sure to meet the compilation requirements.
3. Run the following commands to install Docker and necessary latest packages:
    - sudo apt-get update
    - sudo apt-get upgrade -y
    - sudo apt-get install apt-transport-https ca-certificates curl software-properties-common -y
    - curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    - echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    - sudo apt-get update
    - sudo apt-get install docker-ce docker-ce-cli -y
    - docker --version
    - sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    - sudo chmod +x /usr/local/bin/docker-compose
    - docker-compose --version
    
4. Open a terminal window, and navigate to the ```/marine-traffic-portal/``` directory.
5. Run the following command to create and run the Docker container:
   - docker-compose build
   - docker-compose up -d

The docker container is now running on port 80 on the local machine, and can be accessed through a web browser of your choice.

### Compilation requirements (for running the source code)

If you want to run the application without using docker, you need to add/change the following files:

#### MongoDB Client URL

Name: ```mongodb.py```  
Location: ```/marine-traffic-portal/server/database/mongodb.py```

Action: ```Change```

Make sure the IP of the MongoClient url is set to LOCALHOST:
```python
client = pymongo.MongoClient("mongodb://localhost:27017/", w='majority')
```

#### Frontend eventSource IP

Name: ```Map.jsx```  
Location: ```/marine-traffic-portal/client/src/components/map/Map.jsx```

Action: ```Change```

Make sure the IP of the eventSource url is set to LOCALHOST
```js
const eventSource = new EventSource('http://localhost:5000/sse');
```

### Deployment by running the source code

Follow these steps to run the web application using the source code:
1. Clone the repository.
2. Make sure to meet the general compilation requirements.
3. Make sure to meet the source code specific compilation requirements.
4. Download and install the latest version of MongoDB from [here](https://www.mongodb.com/try/download/community). Make sure it's running.
5. Download and install the latest version of Python from [here](https://www.python.org/downloads/).
6. Open a terminal window, and navigate to the ```/marine-traffic-portal``` directory. 
7. Run the following command to run the source code of the backend:
    - ```python server/server.py```
8. Open a new terminal window, and navigate to the ```/marine-traffic-portal/client``` directory. 
9. Run the following command to run the source code of the frontend:
    - ```npm start```
     
The front- and backend is now running, and the web application can be accessed through a web browser of your choice at the url http://localhost:3000/.

## Design choices

### Project structure and dependencies

The project is structured in the following way: (files not shown)

```text
.
├── client
│   ├── public
│   │   └── images
│   └── src
│       └── components
│           ├── Map
│           └── Sidebar
└── server
    ├── api
    ├── database
    └── tools
```

The project structure was created with the goal of responsibility driven design, loose coupling, high cohesion, 
ease of maintenance, and to minimize code duplication overall.

## How To Use
The web application can be accessed through a web browser using the public IP of the host computer on port 80. You can utilize the application's user interface to explore its various functions and features.

## Showcase

![img1](https://user-images.githubusercontent.com/67228655/231865845-56891f06-f871-4a60-9463-2a65e72e6bec.png)
![img2](https://user-images.githubusercontent.com/67228655/231865850-ac2b59b5-995a-4183-9159-0ffd670d753d.png)

## Features

- Interactive map with zoom control for easy navigation and exploration.
- Dynamic and real-time updates of ship data for accurate and up-to-date information.
- Fullscreen map mode for an immersive experience.
- Responsiveness to ensure the application works well on different devices and screen sizes.
- Carousel mode to view multiple ships at once and quickly switch between them.
- Dark mode for improved visibility and reduced eye strain in low-light environments.
- Detailed application information to help users understand the features and capabilities of the application.

## Extra Features

### Test coverage

[PyTest](https://github.com/pytest-dev/pytest) was used for testing. Tests can be be run by first installing the required dependencies, and then running PyTest:
```
pip -r requirements.txt
pip -m pytest test_server.py
```

### Docker Compose

For ease of deployment, a [docker-compose file](docker-compose.yml) is provided,  containing all the necessary information to run the application simultaneously as three Docker containers.

### MongoDB

To store a large amount of data, MongoDB was used. This allows for more control over data management and provides fast local data access.

## Further improvements
Further improvements for the project include rotating boat icons that utilize course over ground data, adding information about wind direction, and displaying the last port of call for each boat.