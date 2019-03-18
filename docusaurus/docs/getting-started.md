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

After installing docker, follow the instructions on the screen to create a new user. You should see icon of a whale on your top right menu. Before starting Vega, make sure you click the whale icon and confirm that docker is running and that you are logged in.
Next, double click the on the Vega executable. Drag and drop Vega into the applications folder. Vega should now be installed on your Mac.

### Setting up Lyra backend

Every time you start Vega, make sure your docker is running. Start Vega and wait for the all of the components to load. The first time you do this it will take a long time. (5-8 minutes depending on your internet connection) All subsequent times, startup will be faster.

### Loading Data

Drag and drop or select files through the interface. Currently Vega only supports csv, gml and newick files.
Add an name and a jira ID for the current analysis and then click next. The data should take a minute or two to load and will bring you to your new local instance of Lyra.
