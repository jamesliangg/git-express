import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor } from "express-document-sdk";
import simpleGit from 'simple-git';

// Get the document sandbox runtime.
const { runtime } = addOnSandboxSdk.instance;

// https://developer.adobe.com/express-add-ons/docs/references/addonsdk/instance-clientStorage/
// https://developer.adobe.com/express-add-ons/docs/guides/develop/#storing-and-retrieving-client-side-data
async function initRepository() {
    try {
        const repo = await addOnSandboxSdk.instance.clientStorage.getItem('repository');
        if (repo) {
            console.log('Repository already exists');
        } else {
            const newRepo = {
                commits: [],
                files: {}
            };
            await addOnSandboxSdk.instance.clientStorage.setItem('repository', newRepo);
            console.log('Repository initialized');
        }
    } catch (error) {
        console.log('Failed to initialize repository:', error);
    }
}

function start() {
    // APIs to be exposed to the UI runtime
    // i.e., to the `index.html` file of this add-on.
    const sandboxApi = {
        createRectangle: () => {
            const rectangle = editor.createRectangle();

            // Define rectangle dimensions.
            rectangle.width = 240;
            rectangle.height = 180;

            // Define rectangle position.
            rectangle.translation = { x: 10, y: 10 };

            // Define rectangle color.
            const color = { red: 0.32, green: 0.34, blue: 0.89, alpha: 1 };

            // Fill the rectangle with the color.
            const rectangleFill = editor.makeColorFill(color);
            rectangle.fill = rectangleFill;

            // Add the rectangle to the document.
            const insertionParent = editor.context.insertionParent;
            insertionParent.children.append(rectangle);
        },
        listChildren: () => {
            try {
                console.log("Start of function");
                // https://developer.adobe.com/express/add-ons/docs/references/document-sandbox/document-apis/classes/ExpressRootNode/
                const documentRoot = editor.documentRoot;
                // https://developer.adobe.com/express/add-ons/docs/references/document-sandbox/document-apis/classes/PageList/
                const pages = documentRoot.pages;
                console.log(`Document Root ID: ${documentRoot.id}`);
                console.log(`Number of pages: ${pages.length}`);
                // https://developer.adobe.com/express/add-ons/docs/references/document-sandbox/document-apis/classes/PageNode/
                for (const page of pages) {
                    console.log(`Page: ${page.name} (ID: ${page.id})`);
                    console.log(`Type: ${page.type}`);
                    const pageNodeChildren = page.allChildren;
                    // https://developer.adobe.com/express/add-ons/docs/references/document-sandbox/document-apis/classes/VisualNode/
                    for (const pageNodeChild of pageNodeChildren) {
                        console.log(`Child: ${pageNodeChild.name} (ID: ${pageNodeChild.id})`);
                        console.log(`Type: ${pageNodeChild.type}`);
                        const visualNodeChildren = pageNodeChild.allChildren;
                        for (const visualNodeChild of visualNodeChildren) {
                            // https://developer.adobe.com/express/add-ons/docs/references/document-sandbox/document-apis/classes/TextNode/
                            console.log(`Child: ${visualNodeChild.name} (ID: ${visualNodeChild.id})`);
                            console.log(`Type: ${visualNodeChild.type}`);
                            // https://developer.adobe.com/express/add-ons/docs/references/document-sandbox/document-apis/interfaces/Point/
                            console.log(`Translation: x - ${visualNodeChild.translation.x} y - ${visualNodeChild.translation.y}`)
                        }
                    }
                }
            } catch (error) {
                console.error("Error listing children:", error);
            }
        },
        initRepository: async () => {
            await initRepository();
        },
    };

    // Expose `sandboxApi` to the UI runtime.
    runtime.exposeApi(sandboxApi);
}

start();
