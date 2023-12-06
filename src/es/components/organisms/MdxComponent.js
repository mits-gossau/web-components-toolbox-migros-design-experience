// @ts-check
import { Mutation } from '../web-components-toolbox/src/es/components/prototypes/Mutation.js'

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
  *
  * @return {Promise<void>}
  */
  renderCSS () {
    this.css = /* css */``
    return Promise.resolve()
  }
  
  /**
  * renders the html
  *
  * @return {Promise<void>}
  */
  renderHTML () {
    return this.loadDependency()
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
    return !!customElements.get('mdx-button')
  }

  get target () {
    return this.root.querySelector(`:host > *:not(style), ${this.tagName} > *:not(style)`)
  }
}
