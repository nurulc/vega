---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

Vega is an electron based app that allows users to create a local instance of Lyra, with minimal manual setup.

The front-end is written using [React](https://reactjs.org/) and uses an [ElasticSearch](https://www.elastic.co/) backend.

## System Requirements

- [Docker] (https://docs.docker.com/docker-for-mac/install/)
- About 4Gb of free space on your computer

## Installation Instructions for MAC

1. Install docker https://docs.docker.com/docker-for-mac/install/
2. Follow the login instruction on the screen to create a docker user
3. Click on the whale, on the top right menu of your screen to confirm your docker is running and you are logged in.
4. Double click the on the Vega executable
5. Drag and drop Vega into the applications folder.
6. Go to your installed apps, and find Vega

### Setting up Lyra backend

1. Every time you start Vega, make sure your docker is running and you are logged in by checking the docker icon on your menu tray.
2. Start Vega and wait for the all of the components to load. The first time you do this it will take a long time. (5-8 minutes depending on your internet connection) All subsequent times, startup will be faster.

### Loading Data

1. Drag and drop or select files through the interface. Currently Vega only supports csv, gml and newick files.
2. Add an name and a jira ID for the current analysis and then click next. The data should take a minute or two to load
3. Vega will bring you to your new dashboard when it is done loading. 
