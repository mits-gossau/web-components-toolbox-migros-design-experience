# web-components-toolbox-migros-design-experience
The web component toolbox for any CMS but particularly used for [Web Components + Umbraco === Mutobo](http://mutobo.ch/)

## [documentation](https://github.com/mits-gossau/web-components-toolbox-migros-design-experience/tree/master/docs/README.md)

## Updates
replace all "*--light" selectors with :root on tokens! Especially ".klubschule--light" or ".migros--light" at "\node_modules\@migros\mdx-design-tokens\dist\css\03_component\brands\klubschule\light-rem.css" + "\node_modules\@migros\mdx-design-tokens\dist\css\03_component\brands\migros\light-rem.css" otherwise this class would have to be set on the html element within umbraco.

## MDX Sources
- [https://web-components.cf-dev.migros.cloud/?path=/docs/migros-design-experience-mdx-introduction--docs](MDX Storybook)
- [https://git.intern.migros.net/mdx/mdx/-/tree/main/packages/web-components](MDX Web Components)

TODO
- [x] mdx files include
- [x] mdx base token mapping
- [x] mdx sys token mapping
- [ ] mdx component token mapping
    - [x] Button
    - [ ] Accordion
    - [ ] ... check for further components to be mapped (only the Button has been reliably done in the MDX Web Components Project by September 15th 2023,)
- [ ] remove this.removeAttribute('tabindex') from components if they have default indexed children
