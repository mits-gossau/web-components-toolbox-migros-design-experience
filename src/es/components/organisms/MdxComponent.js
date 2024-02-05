// @ts-check
import { Mutation } from '../web-components-toolbox/src/es/components/prototypes/Mutation.js'

/* global CustomEvent */
/* global self */

/**
* Creates a Wrapper for MDX web components
*
* @export
* @attribute {namespace} namespace
* @type {CustomElementConstructor}
*/
export default class MdxComponent extends Mutation() {
  constructor (options = {}, ...args) {
    super({
      importMetaUrl: import.meta.url,
      mode: 'false',
      mutationObserverInit: {
        attributes: true
      },
      ...options
    }, ...args)

    this.eventListeners = new Map()
    this.listenerEventListener = async event => {
      const property = await this.getAttribute('listener-detail-property-name').split(':').reduce(async (accumulator, propertyName) => {
        // @ts-ignore
        propertyName = propertyName.replace(/-([a-z]{1})/g, (match, p1) => p1.toUpperCase())
        if (accumulator instanceof Promise) accumulator = await accumulator
        if (!accumulator) return {} // error handling, in case the await on fetch does not resolve
        if (accumulator[propertyName]) return accumulator[propertyName]
        if (Array.isArray(accumulator)) return accumulator.map(obj => obj[propertyName])
        return {} // error handling, in case the await on fetch does not resolve
      }, event.detail)
      if (typeof property === 'object') {
        for (const key in property) {
          if (property[key] === 'remove') {
            this.target.removeAttribute(key)
          } else {
            this.target.setAttribute(key, property[key])
          }
        }
      }
    }
  }

  connectedCallback () {
    this.hidden = true
    const showPromises = []
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    if (this.shouldRenderHTML()) showPromises.push(this.renderHTML())
    Promise.all(showPromises).then(() => {
      this.mutationObserveStart(this.target)
      Array.from(this.attributes).forEach(attribute => {
        if (attribute.name && attribute.name.includes('-event-name') && attribute.name !== 'mutation-callback-event-name' && attribute.name !== 'listener-event-name') {
          const type = attribute.name.replace('-event-name', '')
          console.log("request attach listener", attribute.value, type)
          const listener = event => this.dispatchEvent(new CustomEvent(attribute.value || `${this.tagName}-${type}-event`, {
            detail: {
              type,
              origEvent: event,
              target: this.target,
              wrapper: this
            },
            bubbles: true,
            cancelable: true,
            composed: true
          }))
          this.target.addEventListener(type, listener)
          this.eventListeners.set(type, listener)
        }
      })
      if (this.getAttribute('listener-event-name') && this.getAttribute('listener-detail-property-name')) document.body.addEventListener(this.getAttribute('listener-event-name'), this.listenerEventListener)
      this.hidden = false
    })
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    this.eventListeners.forEach((listener, type) => this.target.removeEventListener(type, listener))
    if (this.getAttribute('listener-event-name') && this.getAttribute('listener-detail-property-name')) document.body.removeEventListener(this.getAttribute('listener-event-name'), this.listenerEventListener)
  }

  mutationCallback (mutationList, observer) {
    this.dispatchEvent(new CustomEvent(this.getAttribute('mutation-callback-event-name') || `${this.tagName}-mutation-callback`, {
      detail: {
        mutationList,
        observer,
        target: this.target,
        wrapper: this
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  /**
  * evaluates if a render is necessary
  *
  * @return {boolean}
  */
  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
  * evaluates if a render is necessary
  *
  * @return {boolean}
  */
  shouldRenderHTML () {
    return !this.root.querySelector('script')
  }

  /**
  * renders the css
  * css fixes which may flow into the mdx component when mode false
  *
  * @return {Promise<void>}
  */
  renderCSS () {
    this.css = /* css */`
      :host input[type=radio], :host input[type=checkbox] {
        width: auto;
        height: auto;
        padding: 0;
      }
      /* fix weird side effect from empty mdx styles */
      .select-button__button {
        font-size: 1em;
        & > div {
          line-height: 1.5rem;
        }
      }
    `
    return Promise.resolve()
  }

  /**
  * renders the html
  *
  * @return {Promise<void>}
  */
  renderHTML () {
    return this.loadDependency().then(() => {
      let template
      if ((template = this.root.querySelector('template'))) {
        const templateContent = template.content
        template.remove()
        this.html = templateContent
      }
    })
  }

  /**
  * fetch dependency
  *
  * @returns {Promise<any>}
  */
  loadDependency () {
    // make it global to self so that other components can know when it has been loaded
    return this._loadDependency || (this._loadDependency = new Promise((resolve, reject) => {
      if (document.head.querySelector('#mdx') || this.hasMdx) return resolve(true)
      if (this.getAttribute('mode') === 'false') {
        // Workaround for ShadowDom
        // Tried attachInternals (https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals), which requires "static formAssociated = true" within the MDX WC Class but failed to focus with Error: "An invalid form control with name='mdxCheckbox' is not focusable.", if going this route, everything would have to be handled specifically with internals.setValidity(), internals.checkValidity() and internals.reportValidity()
        // This workaround does hijack the mdx custom element constructors and avoid the ShadowDom to be set, it also fixes the CSS :host selector
        // Note: Referencing the input elements by slots has not worked
        const parentNode = this
        customElements.define = new Proxy(customElements.define, {
          apply:
          /**
           * @param {(name: string, constructor: any, options: { extends: string})=>void} target
           * @param {any} thisArg
           * @param {[name: string, constructor: any, options: { extends: string}]} argArray
           */
          (target, thisArg, argArray) => {
            let [name, constructor, options] = argArray
            if (name.substring(0, 4) === 'mdx-') {
              constructor = class extends constructor {
                constructor(...args) {
                  super(...args)
                  this.fakeShadowRoot = document.createElement('div').attachShadow({ mode: 'open' })
                  this.adoptStyleTimeoutId = null
                  this.adoptedStyleSheetsSetterDidRun = false
                }
                // avoid shadow to be attached
                attachShadow () {}
                // for some reason this makes stencil to put the CSSStyleSheet to the document
                get shadowRoot () { return Object.assign(this, this.fakeShadowRoot, { set adoptedStyleSheets (styleSheets) {} }) }
                set adoptedStyleSheets (styleSheets) {
                  if (this.adoptedStyleSheetsSetterDidRun) return
                  // @ts-ignore
                  clearTimeout(this.adoptStyleTimeoutId)
                  this.adoptStyleTimeoutId = setTimeout(() => {
                    // grab all styles, replace :host and append it to the component
                    // @ts-ignore
                    if (!document.styleSheetMap) document.styleSheetMap = new Map()
                    // @ts-ignore
                    const index = document.styleSheetMap.get(name) !== undefined ? document.styleSheetMap.get(name) : document.styleSheetMap.size
                    // @ts-ignore
                    document.styleSheetMap.set(name, index)
                    // @ts-ignore
                    const cssText = Array.from(document?.adoptedStyleSheets?.[index]?.cssRules || []).reduce((acc, cssRule) => (acc += cssRule.cssText), '')
                    const styleNode = document.createElement('style')
                    parentNode.setCss(cssText, (this.getAttribute('id') ? `#${this.getAttribute('id')}` : name) + ':not([stencil-rocks])', false, false, styleNode, false)
                    this.appendChild(styleNode)
                    // grab all slots and replace it with its reference
                    Array.from(this.querySelectorAll('slot')).forEach((slot, i) => {
                      let slotReference
                      if ((slotReference = this.querySelector(`[slot=${slot.getAttribute('name')}]`))) {
                        slot.replaceWith(slotReference)
                      } else if (i === 0 && !slot.hasAttribute('name')) {
                        slot.replaceWith(this.children[0])
                      }
                    })
                    // add id and name to input field
                    let input
                    if ((input = this.querySelector(`input[placeholder="${this.getAttribute('placeholder')}"]`))) {
                      input.setAttribute('id', this.getAttribute('id'))
                      input.setAttribute('name', this.getAttribute('name'))
                    }
                    this.adoptedStyleSheetsSetterDidRun = true
                  }, 0)
                }
                get adoptedStyleSheets () { return [] }
              }
            }
            return target.apply(thisArg, [name, constructor, options])
          }
        })
      }
      const script = document.createElement('script')
      script.setAttribute('type', 'module')
      script.setAttribute('async', '')
      script.setAttribute('id', 'mdx')
      script.setAttribute('src', `${this.importMetaUrl}../../../../node_modules/@migros/mdx-web-components/dist/mdx-web-components/mdx-web-components.esm.js`)
      // @ts-ignore
      script.onload = () => this.hasMdx
        ? resolve(true)
        : reject(new Error('MdxComponent does not load into the global scope!'))
      document.head.appendChild(script)
    }))
  }

  get hasMdx () {
    return !!self.customElements.get('mdx-button')
  }

  get target () {
    return this.root.querySelector(`:host > *:not(style), ${this.tagName} > *:not(style)`)
  }
}
