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

import "@spectrum-web-components/styles/typography.css";
import "@spectrum-web-components/theme/src/themes.js";
import "@spectrum-web-components/theme/theme-light.js";
import "@spectrum-web-components/theme/express/theme-light.js";
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/sp-theme.js";

import "@spectrum-web-components/button/sp-button.js";

import addOnUISdk, { ClientStorage } from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
// import { simpleGit } from 'simple-git';

addOnUISdk.ready.then(async () => {
  console.log("addOnUISdk is ready for use.");

  // Get the Authoring Sandbox.
  const { runtime } = addOnUISdk.instance;
  const sandboxProxy = await runtime.apiProxy("documentSandbox");

  const docApiButton = document.getElementById("docApi");
  docApiButton.addEventListener("click", async () => {
    sandboxProxy.log("Document sandbox up and running.");
  });

  const createRectangleButton = document.getElementById("createRectangle");
  createRectangleButton.addEventListener("click", async () => {
    sandboxProxy.createShape(100, 100);
  });

  const listChildrenButton = document.getElementById("listChildren");
    listChildrenButton.addEventListener("click", async () => {
        sandboxProxy.listChildren();
    });

    const initRepoButton = document.getElementById("initRepo");
    initRepoButton.addEventListener("click", async () => {
      let store = addOnUISdk.instance.clientStorage;
      try {
        const repo = await store.getItem('repository');
        if (repo) {
          console.log('Repository already exists');
        } else {
          const newRepo = {
            commits: [],
            files: {}
          };
          await store.setItem('repository', newRepo);
          console.log('Repository initialized');
        }
        console.log("Value stored in client storage:", repo);
      } catch (error) {
        console.log('Failed to initialize repository:', error);
      }
    });

  // Enabling CTA elements only when the addOnUISdk is ready
  docApiButton.disabled = false;
    createRectangleButton.disabled = false;
    listChildrenButton.disabled = false;
    initRepoButton.disabled = false;
});
