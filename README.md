![Flexor-Logo](https://github.com/user-attachments/assets/e5ba7019-f088-4c6f-ac2c-01244f2bcb08)
**Flexor.js**
GitHub release v0.0.1 - 6.5KB - MIT License

_Flexor.js is a lightweight, extensible layout library that enhances CSS Flexbox with a simple, 
attribute-driven API and a robust plugin system. Built for developers who want control without complexity, 
Flexor delivers responsive, dynamic layouts using just two files; flexor.js and 
flexor.css packed with 50 powerful plugins for responsiveness, interactivity, accessibility, and more.
Streamline your layouts with a tool that’s as flexible as you are._

**Features**

**Lightweight**: Core flexor.js and flexor.css are compact, with no dependencies.

**Attribute-Driven**: Configure layouts in HTML using data-flexor (e.g., flex row gap-10px stack-500px).

**Plugin-Powered**: 50 built-in plugins for everything from real-time resizing to performance optimization.

**Responsive Design**: Native stacking and proportions, enhanced by modern APIs like Container Queries.

**Extensible**: Add custom plugins with Flexor.registerPlugin to fit your project.

**Modern**: Leverages Web APIs (e.g., Resize Observer, Web Animation) for cutting-edge features.


**Installation**

Manual Download
Visit the Releases page on GitHub.

Download flexor.js and flexor.css from the latest release.

Include them in your HTML:

![Screenshot from 2025-04-08 03-31-50](https://github.com/user-attachments/assets/5b234ee0-5af6-463c-9198-b722ff70ec44)


**Quick Start**

Create a responsive layout instantly:

-html-

![Screenshot from 2025-04-08 03-32-26](https://github.com/user-attachments/assets/c6676a41-edf9-4c83-a745-05371945eaa6)


flex row: Sets a horizontal Flexbox layout.

gap-10px: Adds a 10px gap between items.

stack-500px: Stacks items vertically below 500px width.

Flexor applies these styles via flexor.js and flexor.css—no extra CSS needed.


**Using Plugins**

Add advanced features by integrating plugins into flexor.js:
Download a plugin (e.g., flexor-resize-observer-plugin.js) from the plugins subfolder in the repo.

Open flexor.js in a text editor.

Copy the plugin’s code (e.g., the Flexor.registerPlugin block) and paste it into flexor.js in the plugin location

![Screenshot from 2025-04-08 03-34-50](https://github.com/user-attachments/assets/c11857a6-533a-46e0-8cf6-59ac348126ee)


Save flexor.js and use the plugin in your HTML:



**Full Plugin List**

flexor-nested-layouts-plugin.js

flexor-resize-observer-plugin.js

flexor-virtual-scroll-plugin.js

flexor-layout-transition-plugin.js

flexor-equal-heights-plugin.js

flexor-infinite-scroll-plugin.js

flexor-accessibility-boost-plugin.js

flexor-content-fit-plugin.js

flexor-auto-columns-plugin.js

flexor-drag-and-drop-plugin.js

flexor-lazy-load-plugin.js

flexor-dynamic-spacing-plugin.js

flexor-breakpoint-preview-plugin.js

flexor-aspect-ratio-plugin.js

flexor-conditional-visibility-plugin.js

flexor-overflow-scroll-plugin.js

flexor-content-alignment-plugin.js

flexor-sticky-plugin.js

flexor-sticky-headers-plugin.js

flexor-gap-fill-plugin.js

flexor-order-switch-plugin.js

flexor-scroll-reveal-plugin.js

flexor-animation-plugin.js

flexor-masonry-plugin.js

flexor-focus-trap-plugin.js

flexor-data-binding-plugin.js

flexor-snap-grid-plugin.js

flexor-load-balance-plugin.js

flexor-rtl-support-plugin.js

flexor-theme-switch-plugin.js

flexor-error-boundary-plugin.js

flexor-print-styles-plugin.js

flexor-undo-redo-plugin.js

flexor-layout-presets-plugin.js

flexor-parallax-plugin.js

flexor-voice-control-plugin.js

flexor-responsive-text-plugin.js

flexor-hover-effects-plugin.js

flexor-background-switch-plugin.js

flexor-collaborative-edit-plugin.js

flexor-breakpoint-sync-plugin.js

flexor-layout-debug-plugin.js

flexor-container-queries-plugin.js

flexor-perf-monitor-plugin.js

flexor-state-manager-plugin.js

flexor-offline-cache-plugin.js

flexor-motion-path-plugin.js

flexor-ssr-prep-plugin.js

flexor-ai-layout-plugin.js

flexor-component-export-plugin.js



**License**
Flexor.js is released under the MIT License (LICENSE). Use, modify, and share it freely.


Get Involved
Issues: Report bugs or request features here.

Discussions: Join us here.

Star: Like what you see? Star the repo!

Created by Grant-Ad-Nauseum. Let’s build better layouts together!

