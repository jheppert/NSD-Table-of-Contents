// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs such as the network by creating a UI which contains
// a full browser environment (see documentation).

var allProjects = [];
var allPages = figma.root.findAll(n => n.type === "PAGE");
const colorGreen = [{ type: 'SOLID', color: { r: 0.007843137718737125, g: 0.6274510025978088, b: 0.29019609093666077 } }];
const colorYellow = [{ type: 'SOLID', color: { r: 1, g: 0.7372549176216125, b: 0.34117648005485535 } }];
const colorRed = [{ type: 'SOLID', color: { r: 0.7960784435272217, g: 0.1764705926179886, b: 0.2078431397676468 } }];
const colorWhite = [{ type: 'SOLID', color: { r: 0.8980392217636108, g: 0.8980392217636108, b: 0.8980392217636108 } }];
var projectsToDisplay = [
  { prefix: "green", displayName: "Finalized Designs", fill: colorGreen },
  { prefix: "yellow", displayName: "Designs Almost Complete", fill: colorYellow },
  { prefix: "red", displayName: "Designs Under Review", fill: colorRed },
  { prefix: "white", displayName: "Shipped", fill: colorWhite }
];

// Initialize the allProjects array
allPages.forEach(currentPage => {

  var currentPagePrefix = pagePrefix(currentPage.name);
  var currentPageObject = {
    "prefix": currentPagePrefix,
    "fullName": currentPage.name,
    "cleanName": "",
    "type": "",
    "status": "",
    "pageLink": "",
    "nodeID": currentPage.id
  }

  if (currentPagePrefix != "unknown") {
    currentPageObject.cleanName = removeFirstCharacters(currentPage.name);
    currentPageObject.type = projectType(currentPageObject.prefix);
    currentPageObject.status = projectStatus(currentPageObject.prefix);
    currentPageObject.pageLink = "https://figma.com/file/" + figma.fileKey + "/?node-id=" + encodeURIComponent(figma.currentPage.id);
  }
  allProjects.push(currentPageObject);

});

console.log(allProjects);

(async () => {

  // Load the font in the text node before setting the characters
  await figma.loadFontAsync({ family: "Suisse Int'l", style: "Medium" });
  // await figma.loadFontAsync({ family: "Suisse Int'l", style: "Bold" });

  // TODO: Do something here if there are no pages to display

  // Master container
  const tableFrame = figma.createFrame();
  tableFrame.name = "Contents - " + figma.root.name;
  tableFrame.layoutMode = "VERTICAL";
  tableFrame.primaryAxisSizingMode = "AUTO";
  tableFrame.counterAxisSizingMode = "FIXED";
  tableFrame.resizeWithoutConstraints(1000, 500);
  tableFrame.itemSpacing = 0;
  tableFrame.paddingTop = 24;
  tableFrame.paddingRight = 24;
  tableFrame.paddingBottom = 24;
  tableFrame.paddingLeft = 24;
  tableFrame.cornerRadius = 16;
  tableFrame.strokes = [{type: "SOLID", color: {r: 0, g: 0, b: 0}}];
  tableFrame.strokeWeight = 1;

  // File name heading
  const headerText = figma.createText();
  headerText.fontName = { family: "Suisse Int'l", style: "Medium" };
  headerText.characters = figma.root.name;
  headerText.fontSize = 36;
  headerText.setRangeLineHeight(0, headerText.characters.length, {value: 48, "unit": "PIXELS"});
  tableFrame.appendChild(headerText);

  // File Name underline
  const headerTextLine = figma.createLine();
  headerTextLine.strokeWeight = 2;
  headerTextLine.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  headerTextLine.layoutAlign = "STRETCH";
  tableFrame.appendChild(headerTextLine);

  
  for (let index = 0; index < projectsToDisplay.length; index++) {
    // console.log(projectsToDisplay[index].displayName);

    // BEGIN STATUS SECTION GROUP ---------------

    // Container for the group associated with a specific status
    // If no projects are in the container by the end, this will just be removed
    const projectSectionGroup = figma.createFrame();
    projectSectionGroup.name = projectsToDisplay[index].displayName;
    projectSectionGroup.layoutMode = "VERTICAL";
    projectSectionGroup.primaryAxisSizingMode = "AUTO";
    projectSectionGroup.counterAxisSizingMode = "AUTO";
    projectSectionGroup.itemSpacing = 0;
    projectSectionGroup.fills = [];

    // Spacer
    const spacerBeforeProjectStatusHeading = figma.createFrame();
    spacerBeforeProjectStatusHeading.name = "spacer";
    spacerBeforeProjectStatusHeading.resizeWithoutConstraints(100, 24);
    spacerBeforeProjectStatusHeading.layoutAlign = "STRETCH";
    projectSectionGroup.appendChild(spacerBeforeProjectStatusHeading);

    //Project Status Header
    const projectStatusHeadingContainer = figma.createFrame();
    projectStatusHeadingContainer.name = "Status heading";
    projectStatusHeadingContainer.layoutMode = "HORIZONTAL";
    projectStatusHeadingContainer.primaryAxisSizingMode = "AUTO";
    projectStatusHeadingContainer.counterAxisSizingMode = "AUTO";
    projectStatusHeadingContainer.counterAxisAlignItems = "CENTER";
    projectStatusHeadingContainer.itemSpacing = 12;
    projectStatusHeadingContainer.fills = [];
    projectSectionGroup.appendChild(projectStatusHeadingContainer);

    // Colored circle with each status title
    const statusCircle = figma.createEllipse();
    statusCircle.name = "Status indicator";
    statusCircle.resize(20, 20);
    switch (projectsToDisplay[index].prefix) {
      case "green":
        statusCircle.fills = [{ type: 'SOLID', color: { r: 0.007843137718737125, g: 0.6274510025978088, b: 0.29019609093666077 } }];
        break;

      case "yellow":
        statusCircle.fills = [{ type: 'SOLID', color: { r: 1, g: 0.7372549176216125, b: 0.34117648005485535 } }];
        break;

      case "red":
        statusCircle.fills = [{ type: 'SOLID', color: { r: 0.7960784435272217, g: 0.1764705926179886, b: 0.2078431397676468 } }];
        break;

      case "white":
        statusCircle.fills = [{ type: 'SOLID', color: { r: 0.8980392217636108, g: 0.8980392217636108, b: 0.8980392217636108 } }];
        statusCircle.strokes = [{ type: 'SOLID', color: { r: 0.6470588445663452, g: 0.6470588445663452, b: 0.6470588445663452 } }];
        statusCircle.strokeWeight = 0.5;
        break;
    
      default:
        break;
    }
    projectStatusHeadingContainer.appendChild(statusCircle);

    // Heading text for each status
    const projectStatusHeading = figma.createText();
    projectStatusHeading.fontName = { family: "Suisse Int'l", style: "Medium" };
    projectStatusHeading.characters = projectsToDisplay[index].displayName;
    projectStatusHeading.fontSize = 24;
    projectStatusHeading.setRangeLineHeight(0, projectStatusHeading.characters.length, {value: 36, "unit": "PIXELS"});
    projectStatusHeadingContainer.appendChild(projectStatusHeading);

    // Container for the project links
    const projectNamesContainer = figma.createFrame();
    projectNamesContainer.name = "Project links";
    projectNamesContainer.layoutMode = "VERTICAL";
    projectNamesContainer.primaryAxisSizingMode = "AUTO";
    projectNamesContainer.counterAxisSizingMode = "AUTO";
    projectNamesContainer.layoutAlign = "STRETCH";
    projectNamesContainer.paddingLeft = 34;
    projectNamesContainer.itemSpacing = 0;
    projectNamesContainer.fills = [];
    projectSectionGroup.appendChild(projectNamesContainer);

    // Display each project name as a link
    allProjects.forEach((currentProject, i) => {
      if (currentProject.prefix == projectsToDisplay[index].prefix) {
        const text = figma.createText();
        text.fontName = { family: "Suisse Int'l", style: "Medium" };
        text.characters = currentProject.cleanName;
        text.textDecoration = "UNDERLINE";
        text.fontSize = 16;
        text.setRangeLineHeight(0, text.characters.length, {value: 24, "unit": "PIXELS"});
        text.setRangeHyperlink(0, text.characters.length, {type: "NODE", value: currentProject.nodeID});
        projectNamesContainer.appendChild(text);
      }
    }); // END: forEach loop
    if (projectNamesContainer.children.length > 0) {
      tableFrame.appendChild(projectSectionGroup);
    } else {
      projectSectionGroup.remove();
      console.log("No projects for status: " + projectsToDisplay[index].displayName);
    }
  } // END: For loop

  figma.closePlugin();
  // The END
})()




/********************************************************/
/******             HELPER FUNCTIONS               ******/
/********************************************************/


// Returns the plain english version of the emoji prefix
function pagePrefix(somePageName) {
  if(somePageName.startsWith("🟢")) {
   return "green";
  } else if(somePageName.startsWith("🟡")) {
    return "yellow";
  } else if(somePageName.startsWith("🔴")) {
    return "red";
  } else if(somePageName.startsWith("⚪️")) {
    return "white";
  } else if(somePageName.startsWith("✎")) {
    return "pencil";
  } else {
    return "unknown";
  }
}

// Removes the first character hopefully (up to the first space character)
function removeFirstCharacters(somePageName) {
  somePageName = somePageName.substring(somePageName.indexOf(" ") + 1);
  return somePageName;
}

// Return the type of the project
function projectType(somePagePrefix) {
  if (somePagePrefix == "pencil") {
    return "working file";
  } else {
    return "project in flight";
  }
}

// Returns the status of a project
function projectStatus(somePagePrefix) {
  switch (somePagePrefix) {
    case "green":
      return "ready";
      break;

    case "yellow":
      return "almost ready";
      break;

    case "red":
      return "not ready";
      break;

    case "white":
      return "shipped";
      break;

    case "pencil":
      return "active";
      break;

    default:
      return "unknown";
      break;
  }
}