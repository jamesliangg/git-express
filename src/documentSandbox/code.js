/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor, colorUtils, constants } from "express-document-sdk";
const { runtime } = addOnSandboxSdk.instance;

function start() {
  runtime.exposeApi({
    log: (...args) => {
      console.log(...args);
    },
    createShape(width, height) {
      const rect = editor.createRectangle();
      rect.width = width;
      rect.height = height;
      rect.translation = { x: 50, y: 50 };
      // appending the rect object to the scene
      editor.context.insertionParent.children.append(rect);
      this.log("Shape created.");
    },
    listChildren() {
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
    }
    });
}

start();
