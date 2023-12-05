// @ts-check
import { Mutation } from '../web-components-toolbox/src/es/components/prototypes/Mutation.js'

/* global self */

/**
* Creates a Datepicker
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
  }
  
  connectedCallback () {
    this.hidden = true
    const showPromises = []
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    if (this.shouldRenderHTML()) showPromises.push(this.renderHTML())
    Promise.all(showPromises).then(() => {
      this.mutationObserveStart(this.target)
      Array.from(this.attributes).forEach(attribute => {
        if (attribute.name && attribute.name.includes('-event-name') && attribute.name !== 'mutation-callback-event-name') {
          const type = attribute.name.replace('-event-name', '')
          const listener = event => this.dispatchEvent(new CustomEvent(attribute.key || `${this.tagName}-${type}-event`, {
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
      this.hidden = false
    })
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    this.eventListeners.forEach((listener, type) => this.target.removeEventListener(type, listener))
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
      script.setAttribute('src', '../../../../../node_modules/@migros/mdx-web-components/dist/mdx-web-components/mdx-web-components.esm.js')
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
