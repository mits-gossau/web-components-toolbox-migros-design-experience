# Documentation for web-components-toolbox-migros-design-experience
The web-components-toolbox-migros-design-experience repository utilizes the web-components-toolbox as a git submodule, enabling developers to implement Migros MDX components easily and effectively. This documentation provides an overview of the toolbox's integration with the Migros Design Experience (MDX) while referring to relevant resources for both the toolbox and MDX.

## Table of Contents:
- Overview
- Integration with web-components-toolbox
- Migros Design Experience (MDX)
- Installation
- Using Figma Tokens in CSS Variables within the web-components-toolbox-migros-design-experience
- Conclusion

## Overview
The web-components-toolbox is designed for creating and managing web components, particularly for use with content management systems like Umbraco. This framework allows developers to build reusable components that are modular, maintainable, and easy to integrate. The web-components-toolbox-migros-design-experience repository builds upon this foundation by providing a collection of components specifically tailored for the Migros brand, ensuring consistency and accessibility across projects.

## Integration with web-components-toolbox
By using the web-components-toolbox as a git submodule, the Migros Design Experience leverages the capabilities of the toolbox to offer a seamless development experience. This integration allows developers to:
- Access a structured framework for building web components.
- Utilize best practices in component design and implementation.
- Maintain minimal overhead while ensuring high performance.
For more details on the toolbox, refer to the web-components-toolbox documentation.

## Migros Design Experience (MDX)
The Migros Design Experience (MDX) provides a comprehensive design system that includes design tokens, accessibility guidelines, and component specifications. It is designed to facilitate collaboration among various disciplines, including business stakeholders, designers, and developers.

### Key Resources
- MDX Storybook: A live demo showcasing available MDX components.
- MDX Web Components Repository: The source code for MDX web components.

### Key Features
- Custom Elements: Defines reusable custom elements that encapsulate their functionality and styles.
- Shadow DOM: Utilizes Shadow DOM for style encapsulation, preventing style conflicts.
- Figma CSS Management: Supports optional export of CSS tokens aka. CSS variables.
- Accessibility Compliance: Ensures that all components adhere to accessibility standards.

## Installation
To set up the web-components-toolbox, follow these steps:
- Clone the Repository:
    - ```git clone --recurse-submodules https://github.com/mits-gossau/web-components-toolbox-migros-design-experience.git```
- Serve the index.html through a web server eg.: apache or install npm development dependencies, which include live-server:
    - ```npm install```
    - ```npm run serve```
    
### Install Dependencies:
- execute ```git submodule update --init --recursive --force``` (Note: Avoid using the --remote flag when opening the project. Using the --remote flag loads the latest Frontend Solution into the Backend Solution and ignores to which commit the parent module points.)

### Other Npm Commands:
Further commands can be found in the [package.json](https://github.com/mits-gossau/web-components-toolbox/blob/master/package.json)

## Using Figma Tokens in CSS Variables within the web-components-toolbox-migros-design-experience
The web-components-toolbox-migros-design-experience repository effectively utilizes design tokens exported from Figma to create CSS variables, which are then mapped to control the styling of web components. This documentation outlines the process of integrating Figma tokens into CSS variables and how these variables are used to manage component styles.

### Overview
Design tokens are a crucial part of modern design systems, providing a consistent way to manage design decisions such as colors, spacing, typography, and more. In the context of the web-components-toolbox-migros-design-experience, these tokens are exported from Figma and transformed into CSS variables that can be easily utilized across web components.

### Key Concepts
- Design Tokens
    - Definition: Design tokens are named entities that store visual design attributes. They represent a single design decision (e.g., color, font size) and can be reused throughout a project.
    - Export from Figma: Tokens are created in Figma and exported in a format that can be consumed by CSS.

### CSS Variables
- Definition: CSS variables (custom properties) allow for dynamic styling in CSS. They can be defined globally and reused throughout stylesheets.
- Usage: By mapping design tokens to CSS variables, developers can easily maintain consistency across components while allowing for easy updates.

### Process of Using Tokens in CSS Variables
1. Exporting Tokens from Figma
    Tokens are defined in Figma and exported as part of the design system. This export typically includes various categories such as colors, typography, spacing, etc.
2. Mapping Tokens to CSS Variables
    Once the tokens are exported as CSS Variables, these are going to be mapped to the consistent naming convention of the [web-components-toolbox](https://github.com/mits-gossau/web-components-toolbox/tree/master/docs/README.md)
3. Implementing CSS Variables in Web Components
    Once this mapping is completed, they can be utilized within client specific web components or within a custom CSS eg. variablesCustom.css to style those web components
    Styling Components: In the component's stylesheet, use the defined CSS variables to style elements. For example:
    ```
    .my-component {
        font-size: var(--{namespaces gets injected if available by Shadow.js}font-size, 1em);
        height: var(--{namespaces gets injected if available by Shadow.js}height, auto);
    }
    ```
    Dynamic Updates: Since CSS variables can be updated at runtime, changing a token value will automatically reflect across all components using that variable.

### Managing Variable Mappings
The repository includes various mappings for MDX components, ensuring that each component adheres to the design system established by the Migros Design Experience:
- MDX Base Token Mapping: General tokens that apply across all components.
- MDX System Token Mapping: Tokens specific to system-level components.
- MDX Component Token Mapping: Specific mappings for individual components like buttons and accordions.

### Conclusion
The integration of Figma design tokens into CSS variables within the web-components-toolbox-migros-design-experience repository allows for a streamlined and consistent approach to styling web components. By mapping these tokens effectively, developers can ensure that their components remain aligned with the overall design system while benefiting from the flexibility and maintainability offered by CSS variables. For further details on specific implementations or additional resources, refer to the MDX Storybook and MDX Web Components Repository.

## Conclusion
This documentation serves as a guide for developers looking to utilize the web-components-toolbox-migros-design-experience effectively while leveraging resources from both the [toolbox](https://github.com/mits-gossau/web-components-toolbox/tree/master/docs/README.md) and [MDX design system](https://wiki.migros.net/display/MDX). For detailed information on specific components or features, please refer to the respective documentation.
