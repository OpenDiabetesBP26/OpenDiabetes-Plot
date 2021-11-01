# OpenDiabetes-Plot (2019)
The purpose of this project is to provide a client side GUI for Open Diabetes data in JavaScript and D3. 

Live Preview Site: https://opendiabetes.z6.web.core.windows.net/

## Abstract-Keywords
Diabetes, Dashboards, Client Side JavaScript GUI, Progressive Web App (PWA)

## Technical-Keywords
JavaScript, D3, Crossfilter, React, SCSS, Webpack, JSON, Azure File Storage Hosting, Azure Devops CI/CD

## User Manual
1. Compile the project (Installation Manual) and open index.html
2. At the beginning a loading screen appears showing that the JSON file is loaded
3. (Optional) drop another JSON file with Diabetes data on the top of the view to display this
4. When the page is loaded you see several dashboards for the overall timespan of the data
5. If you want to have a closer view on a shorter timespan use the mousewheel or pinch gesture to zoom into the timespan you want to see.
6. (Optional) For installing on a mobile device to have an app on your smartphone or tablet open the site on this device and click "Add to Home Screen"

## Installation
1. Download and install NodeJs https://nodejs.org/dist/v13.0.1/node-v13.0.1-x64.msi
2. Checkout project
3. go to project root folder
4. Run NPM install: __npm ci__
5. Run __npm run-script build__
6. The compiled site is now in the folder ./dist
7. Open index.html to view the dashboard (If run locally you have to drop the file '2019-11-20-1349_export-data.json' onto the dashboard because the ./ link is only working when hosted

## Develop project
### Debug Mode: 
__npm start__ will compile and open project in __hot reload__ mode 
_(you have just to edit and save the files and your changes will be on the site directly without refresh)_
