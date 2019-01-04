---
id: us-desktop
title: User Stories: App Base
sidebar_label: App Base
---

Base features for desktop app

## Select files from computer

As a user, I want to select files from my computer to open for an analysis.

- [[VIZ-146](https://shahcompbio.atlassian.net/browse/VIZ-146)] Add input to select from file system instead of drag and drop

- I want to select multiple types, or multiple files for one type
- I want to make sure they're compatible with dashboard (file type, required columns)
- I want to make sure I'm not adding duplicate files
- I want to delete if I add the wrong file

## Describe metadata for current analysis

As a user, I want to describe what the metadata of the current analysis is, so I can refer back to it later.

- I need to add a title and brief description
- I want to be able to add other metadata (library, sample) as needed
- Analysis ID should be auto-generated, to prevent collision of IDs.

* [[VIZ-148](https://shahcompbio.atlassian.net/browse/VIZ-148)] Store parsed input files
* [[VIZ-150](https://shahcompbio.atlassian.net/browse/VIZ-150)] Check to see if analysis name already exists

## History of past analyses

As a user, I want to see a summary of all analyses I have opened using this dashboard.

- [[VIZ-149](https://shahcompbio.atlassian.net/browse/VIZ-149)] Create binding relationship between files and analysis name in relations table
- [[VIZ-155](https://shahcompbio.atlassian.net/browse/VIZ-155)] UI layer to render list of previous analyses

As a user, I want to be able to select one of the analysis in the history, so I don't have to reselect the files for the same analysis.

- [[VIZ-156](https://shahcompbio.atlassian.net/browse/VIZ-156)] Clicking on analysis in list should select that analysis
- [[VIZ-157](https://shahcompbio.atlassian.net/browse/VIZ-157)] Switch to dashboard view after selection of analysis (can be dummy dashboard initially)

## Connection to remote instance

As a user, I want to connect to the remote (web-based) instance of the dashboard, so I can view any of their datasets on my local instance.

- [[VIZ-161](https://shahcompbio.atlassian.net/browse/VIZ-161)] UI layer to login as user
- [[VIZ-162](https://shahcompbio.atlassian.net/browse/VIZ-162)] Authenticate user with nginx layer (web-side)
- [[VIZ-163](https://shahcompbio.atlassian.net/browse/VIZ-163)] Scrape list of analyses from remote database (ElasticSearch)
- [[VIZ-164](https://shahcompbio.atlassian.net/browse/VIZ-164)] UI part to show list of analyses in remote instance
- [[VIZ-165](https://shahcompbio.atlassian.net/browse/VIZ-165)] Interaction to select analysis
- [[VIZ-166](https://shahcompbio.atlassian.net/browse/VIZ-166)] Scrape data for specific analysis from ElasticSearch to local instance

As a user, I want to upload my current analysis to the remote instance, so I can easily share my data with other collaborators.

- [[VIZ-167](https://shahcompbio.atlassian.net/browse/VIZ-167)] Set up new global instance for users to push into
- [[VIZ-168](https://shahcompbio.atlassian.net/browse/VIZ-168)] UI part to publish dashboard
- [[VIZ-169](https://shahcompbio.atlassian.net/browse/VIZ-169)] Scrape local database for specific analysis and push to ElasticSearch (make sure that entries are similar)
