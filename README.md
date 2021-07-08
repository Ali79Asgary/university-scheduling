
## Installing

Navigate into the repository folder, run the following command to install dependencies:

```
npm install . 
```

## Starting The Server

Do not forget to have a Mongodb instance running on your server (Default port is 27017).  
run the following command to start a nodejs server running on port 3000
```
node .
```

## Deployment : Docker And Docker Swarm

You can build the docker image locally using the provided docker file.  
```
docker build . -t "repo-name:tag"
```
There is a prebuilt and supported version of the image in our own docker hub repository [Here](https://hub.docker.com/repository/docker/smileahappysmile/university-scheduling)).

Clearly, you should not forget persistance. In a development environment you can use the docker-swarm.yaml file provided in the repository to create a swarm consisting of one app docker image and one mongodb instance.  

In order to create the swarm, navigate to the main project file and run the following command.
```
docker-compose up
```


