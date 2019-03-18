---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

Vega is an electron based app that allows users to create a local instance of Lyra, with minimal manual setup.

The front-end is written using [React](https://reactjs.org/) and uses an [ElasticSearch](https://www.elastic.co/) backend.

## System Requirements

- [Docker] (https://docs.docker.com/docker-for-mac/install/)

## Installation Instructions for MAC

After you installed docker, you should an icon of a little whale on your top right menu. Click it and make sure docker is running. Drag and drop Vega into the applications folder of your Mac.

### Setting up Lyra backend

Every time you start the app, make sure your docker is running! Start Vega and wait for the all of the components to load. The first time you do this it will take a long time. (5-8 minutes depending on your internet connection) All subsequent times, startup will be fast.

### Loading Data

Drag and drop or select files through the interface. Currently Vega only supports csv, gml and newick files.
Add an name and a jira ID for the current analysis and then click next. The data should take a minute or two to load and should bring you to your new local instance of Lyra.
