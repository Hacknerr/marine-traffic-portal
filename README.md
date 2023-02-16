# Group 6 Bachelor Product

**marine-traffic-portal**

marine-traffic-portal is a web application that allows you to explore ships in the Trondheimsfjord in real time on a map. This is done by retrieving open AIS data via BarentsWatch's API.

**AIS:** System for automatic identification of ships and their movements.

`Deployment:` This service was deployed on OpenStack using Docker. **Located at:`http://xx.xxx.xx.xx:xxxx/`**

[TOC]
# Endpoints
This web application provides one endpoint:
```
/                                       - Frontpage
```

# How To Use
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## - Features
* Data older than 'x amount of time' is deleted from the database.
* Identical data will be ignored if attempted added to the database.
* Carousel view: Data regarding ships are displayed in a cyclic, scrolling manner. It's used to showcase ships in a visually appealing way, which looks good on a large screen in fullscreen mode.
## - Decisions
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

# Planned implementations
* Displaying the datetime of the most recent data
* Optimize map rendering: The add_markers function creates a Marker object for each coordinate in the list. Creating a large number of markers can slow down the map rendering. Consider clustering markers to reduce the number of markers displayed on the map, or use a more efficient marker rendering library like react-leaflet-markercluster.
* Rewrite Firestore backend connection.

