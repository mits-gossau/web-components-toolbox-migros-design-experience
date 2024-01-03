// @ts-check

// THIS FILE REFLECTS THE MDX BUTTON (packages/web-components/src/components/button/button.tsx) IN VANILLA JS FOR DEMO PURPOSES
// IT INCLUDES THE "EXPORTS", "UTILS" AND "SCSS" ALL IN ONE FILE, TO KEEP IT SIMPLE
// use customElements.define (https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define) to load this web component into your DOM

// ↓↓↓ packages/web-components/src/components/button/exports.ts ↓↓↓
/** @typedef {'primary' | 'secondary' | 'tertiary' | 'quaternary'} BUTTON_VARIANTS_INTERFACE */
const BUTTON_VARIANTS = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  quaternary: 'quaternary',
  get default() {
    return this.primary
  }
}

/** @typedef {'sm' | 'md' | 'lg'} BUTTON_SIZES_INTERFACE */
const BUTTON_SIZES = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  get default() {
    return this.md
  }
}

/** @typedef {'button' | 'submit' | 'reset'} BUTTON_TYPE_INTERFACE */
const BUTTON_TYPE = {
  submit: 'submit',
  reset: 'reset',
  button: 'button',
  get default() {
    return this.submit
  }
}

/** @typedef {'button' | 'link'} BUTTON_AS_INTERFACE */
const BUTTON_AS = {
  button: 'button',
  link: 'link',
  get default() {
    return this.button
  }
}
// ↑↑↑ packages/web-components/src/components/button/exports.ts ↑↑↑

/**
* @export
* @class MdxButton
* @type {CustomElementConstructor}
*/
export default class MdxButton extends HTMLElement {
  static get observedAttributes () {
    return ['disabled', 'type', 'as', 'href', 'aria-label', 'target']
  }

  /** @type {boolean} */
  get disabled () {
    return this.hasAttribute('disabled')
  }

  /** @type {BUTTON_VARIANTS_INTERFACE} */
  get variant () {
    return BUTTON_VARIANTS[this.getAttribute('variant')] || BUTTON_VARIANTS.default
  }

  /** @type {BUTTON_SIZES_INTERFACE} */
  get size () {
    return BUTTON_SIZES[this.getAttribute('size')] || BUTTON_SIZES.default
  }

  /** @type {BUTTON_TYPE_INTERFACE} */
  get type () {
    return BUTTON_TYPE[this.getAttribute('type')] || BUTTON_TYPE.default
  }

  /** @type {BUTTON_AS_INTERFACE} */
  get as () {
    return BUTTON_AS[this.getAttribute('as')] || BUTTON_AS.default
  }

  /** @type {string} */
  get href () {
    return this.getAttribute('href') || ''
  }

  /** @type {string} */
  get ariaLabel () {
    return this.getAttribute('aria-label') || ''
  }

  /** @type {string | '_self'} */
  get target () {
    return this.getAttribute('target') || '_self'
  }

  // ↓↓↓ packages/web-components/src/utils/isExternalUrl.ts ↓↓↓
  /**
   * @param {string} href
   * @return {boolean}
   */
  #isExternalURL (href) {
    if (!window) {
      throw new Error('window is not defined')
    }
    try {
      const base = new URL(`${window.location.protocol}//${window.location.host}`)
      return new URL(href, base).origin !== location.origin
    } catch (e) {
      return false;
    }
  }
  // ↑↑↑ packages/web-components/src/utils/isExternalUrl.ts ↑↑↑

  constructor () {
    super()

    this.shadow = this.attachShadow({ mode: 'open' })
    // reflect default values as attribute
    if (!this.hasAttribute('variant')) this.setAttribute('variant', BUTTON_VARIANTS.default)
    if (!this.hasAttribute('size')) this.setAttribute('size', BUTTON_SIZES.default)
    if (!this.hasAttribute('as')) this.setAttribute('as', BUTTON_AS.default)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'as' && oldValue !== newValue) {
      this.button?.remove()
      return this.renderHTML()
    }
    this.button?.setAttribute(name, this[name.replace(/-(.{1})/, (match, p1) => p1.toUpperCase())])
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.shadow.querySelector(':host > style[_css]')
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML () {
    return !this.button
  }

  // ↓↓↓ packages/web-components/src/components/button/button.scss ↓↓↓
  /**
   * renders the css
   * @return {void}
   */
  renderCSS () {
    const style = document.createElement('style')
    style.setAttribute('_css', '')
    style.textContent = /* css */`
      :host .button {
        align-items: center;
        box-sizing: border-box;
        cursor: pointer;
        display: inline-flex;
        max-width: 100%;
        text-align: center;
        text-decoration: none;
        justify-content: center;
        transition: color linear 0.2s;
      
        &:focus-visible {
          border-radius: var(--mdx-comp-keyboard-focus-border-radius-default);
          outline-color: var(--mdx-comp-keyboard-focus-color-default);
          outline-style: solid;
          outline-width: var(--mdx-comp-keyboard-focus-border-width-default);
          outline-offset: 2px;
        }
      
        &:hover {
          transition: var(--mdx-comp-button-transition-hover-fade-in-out);
        }
      
        &__icon {
          display: flex;
          align-items: center;
        }
      }
      
      :host([variant='primary'][size='sm']) .button {
        font: var(--mdx-comp-button-primary-small-font-default);
        color: var(--mdx-comp-button-primary-small-color-default);
        background-color: var(--mdx-comp-button-primary-small-background-color-default);
        border: var(--mdx-comp-button-primary-small-border-width-default) solid
          var(--mdx-comp-button-primary-small-border-color-default);
        border-radius: var(--mdx-comp-button-primary-small-border-radius-default);
        gap: var(--mdx-comp-button-primary-small-gap-icon-text-default);
        width: var(--mdx-comp-button-small-sizing-button-width);
        height: var(--mdx-comp-button-small-sizing-button-height);
        padding-right: var(--mdx-comp-button-primary-small-padding-horizontal-default);
        padding-left: var(--mdx-comp-button-primary-small-padding-horizontal-default);
      
        &:hover {
          color: var(--mdx-comp-button-primary-small-color-hover);
          background-color: var(--mdx-comp-button-primary-small-background-color-hover);
          border: var(--mdx-comp-button-primary-small-border-width-hover) solid
            var(--mdx-comp-button-primary-small-border-color-hover);
          border-radius: var(--mdx-comp-button-primary-small-border-radius-hover);
          padding-right: var(--mdx-comp-button-primary-small-padding-horizontal-hover);
          padding-left: var(--mdx-comp-button-primary-small-padding-horizontal-hover);
        }
      
        &:disabled {
          color: var(--mdx-comp-button-primary-small-color-disabled);
          background-color: var(--mdx-comp-button-primary-small-background-color-disabled);
          border: var(--mdx-comp-button-primary-small-border-width-disabled) solid
            var(--mdx-comp-button-primary-small-border-color-disabled);
          border-radius: var(--mdx-comp-button-primary-small-border-radius-disabled);
          padding-right: var(--mdx-comp-button-primary-small-padding-horizontal-disabled);
          padding-left: var(--mdx-comp-button-primary-small-padding-horizontal-disabled);
        }
      }
      
      :host([variant='secondary'][size='sm']) .button {
        font: var(--mdx-comp-button-secondary-small-font-default);
        color: var(--mdx-comp-button-secondary-small-color-default);
        background-color: var(--mdx-comp-button-secondary-small-background-color-default);
        border: var(--mdx-comp-button-secondary-small-border-width-default) solid
          var(--mdx-comp-button-secondary-small-border-color-default);
        border-radius: var(--mdx-comp-button-secondary-small-border-radius-default);
        gap: var(--mdx-comp-button-secondary-small-gap-icon-text-default);
        width: var(--mdx-comp-button-small-sizing-button-width);
        height: var(--mdx-comp-button-small-sizing-button-height);
        padding-right: var(--mdx-comp-button-secondary-small-padding-horizontal-default);
        padding-left: var(--mdx-comp-button-secondary-small-padding-horizontal-default);
      
        &:hover {
          color: var(--mdx-comp-button-secondary-small-color-hover);
          background-color: var(--mdx-comp-button-secondary-small-background-color-hover);
          border: var(--mdx-comp-button-secondary-small-border-width-hover) solid
            var(--mdx-comp-button-secondary-small-border-color-hover);
          border-radius: var(--mdx-comp-button-secondary-small-border-radius-hover);
          padding-right: var(--mdx-comp-button-secondary-small-padding-horizontal-hover);
          padding-left: var(--mdx-comp-button-secondary-small-padding-horizontal-hover);
        }
      
        &:disabled {
          color: var(--mdx-comp-button-secondary-small-color-disabled);
          background-color: var(--mdx-comp-button-secondary-small-background-color-disabled);
          border: var(--mdx-comp-button-secondary-small-border-width-disabled) solid
            var(--mdx-comp-button-secondary-small-border-color-disabled);
          border-radius: var(--mdx-comp-button-secondary-small-border-radius-disabled);
          padding-right: var(--mdx-comp-button-secondary-small-padding-horizontal-disabled);
          padding-left: var(--mdx-comp-button-secondary-small-padding-horizontal-disabled);
        }
      }
      
      :host([variant='tertiary'][size='sm']) .button {
        font: var(--mdx-comp-button-tertiary-small-font-default);
        color: var(--mdx-comp-button-tertiary-small-color-default);
        background-color: var(--mdx-comp-button-tertiary-small-background-color-default);
        border: var(--mdx-comp-button-tertiary-small-border-width-default) solid
          var(--mdx-comp-button-tertiary-small-border-color-default);
        border-radius: var(--mdx-comp-button-tertiary-small-border-radius-default);
        gap: var(--mdx-comp-button-tertiary-small-gap-icon-text-default);
        width: var(--mdx-comp-button-small-sizing-button-width);
        height: var(--mdx-comp-button-small-sizing-button-height);
        padding-right: var(--mdx-comp-button-tertiary-small-padding-horizontal-default);
        padding-left: var(--mdx-comp-button-tertiary-small-padding-horizontal-default);
      
        &:hover {
          color: var(--mdx-comp-button-tertiary-small-color-hover);
          background-color: var(--mdx-comp-button-tertiary-small-background-color-hover);
          border: var(--mdx-comp-button-tertiary-small-border-width-hover) solid
            var(--mdx-comp-button-tertiary-small-border-color-hover);
          border-radius: var(--mdx-comp-button-tertiary-small-border-radius-hover);
          padding-right: var(--mdx-comp-button-tertiary-small-padding-horizontal-hover);
          padding-left: var(--mdx-comp-button-tertiary-small-padding-horizontal-hover);
        }
      
        &:disabled {
          color: var(--mdx-comp-button-tertiary-small-color-disabled);
          background-color: var(--mdx-comp-button-tertiary-small-background-color-disabled);
          border: var(--mdx-comp-button-tertiary-small-border-width-disabled) solid
            var(--mdx-comp-button-tertiary-small-border-color-disabled);
          border-radius: var(--mdx-comp-button-tertiary-small-border-radius-disabled);
          padding-right: var(--mdx-comp-button-tertiary-small-padding-horizontal-disabled);
          padding-left: var(--mdx-comp-button-tertiary-small-padding-horizontal-disabled);
        }
      }
      
      :host([variant='quaternary'][size='sm']) .button {
        font: var(--mdx-comp-button-quaternary-small-font-default);
        color: var(--mdx-comp-button-quaternary-small-color-default);
        background-color: var(--mdx-comp-button-quaternary-small-background-color-default);
        border: var(--mdx-comp-button-quaternary-small-border-width-default) solid
          var(--mdx-comp-button-quaternary-small-border-color-default);
        border-radius: var(--mdx-comp-button-quaternary-small-border-radius-default);
        gap: var(--mdx-comp-button-quaternary-small-gap-icon-text-default);
        width: var(--mdx-comp-button-small-sizing-button-width);
        height: var(--mdx-comp-button-small-sizing-button-height);
        padding-right: var(--mdx-comp-button-quaternary-small-padding-horizontal-default);
        padding-left: var(--mdx-comp-button-quaternary-small-padding-horizontal-default);
      
        &:hover {
          color: var(--mdx-comp-button-quaternary-small-color-hover);
          background-color: var(--mdx-comp-button-quaternary-small-background-color-hover);
          border: var(--mdx-comp-button-quaternary-small-border-width-hover) solid
            var(--mdx-comp-button-quaternary-small-border-color-hover);
          border-radius: var(--mdx-comp-button-quaternary-small-border-radius-hover);
          padding-right: var(--mdx-comp-button-quaternary-small-padding-horizontal-hover);
          padding-left: var(--mdx-comp-button-quaternary-small-padding-horizontal-hover);
        }
      
        &:disabled {
          color: var(--mdx-comp-button-quaternary-small-color-disabled);
          background-color: var(--mdx-comp-button-quaternary-small-background-color-disabled);
          border: var(--mdx-comp-button-quaternary-small-border-width-disabled) solid
            var(--mdx-comp-button-quaternary-small-border-color-disabled);
          border-radius: var(--mdx-comp-button-quaternary-small-border-radius-disabled);
          padding-right: var(--mdx-comp-button-quaternary-small-padding-horizontal-disabled);
          padding-left: var(--mdx-comp-button-quaternary-small-padding-horizontal-disabled);
        }
      }
      
      :host([variant='primary'][size='md']) .button {
        font: var(--mdx-comp-button-primary-medium-font-default);
        color: var(--mdx-comp-button-primary-medium-color-default);
        background-color: var(--mdx-comp-button-primary-medium-background-color-default);
        border: var(--mdx-comp-button-primary-medium-border-width-default) solid
          var(--mdx-comp-button-primary-medium-border-color-default);
        border-radius: var(--mdx-comp-button-primary-medium-border-radius-default);
        gap: var(--mdx-comp-button-primary-medium-gap-icon-text-default);
        width: var(--mdx-comp-button-medium-sizing-button-width);
        height: var(--mdx-comp-button-medium-sizing-button-height);
        padding-right: var(--mdx-comp-button-primary-medium-padding-horizontal-default);
        padding-left: var(--mdx-comp-button-primary-medium-padding-horizontal-default);
      
        &:hover {
          color: var(--mdx-comp-button-primary-medium-color-hover);
          background-color: var(--mdx-comp-button-primary-medium-background-color-hover);
          border-color: var(--mdx-comp-button-primary-medium-border-color-hover);
          border: var(--mdx-comp-button-primary-medium-border-width-hover) solid
            var(--mdx-comp-button-primary-medium-border-color-hover);
          border-radius: var(--mdx-comp-button-primary-medium-border-radius-hover);
          padding-right: var(--mdx-comp-button-primary-medium-padding-horizontal-hover);
          padding-left: var(--mdx-comp-button-primary-medium-padding-horizontal-hover);
        }
      
        &:disabled {
          color: var(--mdx-comp-button-primary-medium-color-disabled);
          background-color: var(--mdx-comp-button-primary-medium-background-color-disabled);
          border: var(--mdx-comp-button-primary-medium-border-width-disabled) solid
            var(--mdx-comp-button-primary-medium-border-color-disabled);
          border-radius: var(--mdx-comp-button-primary-medium-border-radius-disabled);
          padding-right: var(--mdx-comp-button-primary-medium-padding-horizontal-disabled);
          padding-left: var(--mdx-comp-button-primary-medium-padding-horizontal-disabled);
        }
      }
      
      :host([variant='secondary'][size='md']) .button {
        font: var(--mdx-comp-button-secondary-medium-font-default);
        color: var(--mdx-comp-button-secondary-medium-color-default);
        background-color: var(--mdx-comp-button-secondary-medium-background-color-default);
        border: var(--mdx-comp-button-secondary-medium-border-width-default) solid
          var(--mdx-comp-button-secondary-medium-border-color-default);
        border-radius: var(--mdx-comp-button-secondary-medium-border-radius-default);
        gap: var(--mdx-comp-button-secondary-medium-gap-icon-text-default);
        width: var(--mdx-comp-button-medium-sizing-button-width);
        height: var(--mdx-comp-button-medium-sizing-button-height);
        padding-right: var(--mdx-comp-button-secondary-medium-padding-horizontal-default);
        padding-left: var(--mdx-comp-button-secondary-medium-padding-horizontal-default);
      
        &:hover {
          color: var(--mdx-comp-button-secondary-medium-color-hover);
          background-color: var(--mdx-comp-button-secondary-medium-background-color-hover);
          border: var(--mdx-comp-button-secondary-medium-border-width-hover) solid
            var(--mdx-comp-button-secondary-medium-border-color-hover);
          border-radius: var(--mdx-comp-button-secondary-medium-border-radius-hover);
          padding-right: var(--mdx-comp-button-secondary-medium-padding-horizontal-hover);
          padding-left: var(--mdx-comp-button-secondary-medium-padding-horizontal-hover);
        }
      
        &:disabled {
          color: var(--mdx-comp-button-secondary-medium-color-disabled);
          background-color: var(--mdx-comp-button-secondary-medium-background-color-disabled);
          border: var(--mdx-comp-button-secondary-medium-border-width-disabled) solid
            var(--mdx-comp-button-secondary-medium-border-color-disabled);
          border-radius: var(--mdx-comp-button-secondary-medium-border-radius-disabled);
          padding-right: var(--mdx-comp-button-secondary-medium-padding-horizontal-disabled);
          padding-left: var(--mdx-comp-button-secondary-medium-padding-horizontal-disabled);
        }
      }
      
      :host([variant='tertiary'][size='md']) .button {
        font: var(--mdx-comp-button-tertiary-medium-font-default);
        color: var(--mdx-comp-button-tertiary-medium-color-default);
        background-color: var(--mdx-comp-button-tertiary-medium-background-color-default);
        border: var(--mdx-comp-button-tertiary-medium-border-width-default) solid
          var(--mdx-comp-button-tertiary-medium-border-color-default);
        border-radius: var(--mdx-comp-button-tertiary-medium-border-radius-default);
        gap: var(--mdx-comp-button-tertiary-medium-gap-icon-text-default);
        width: var(--mdx-comp-button-medium-sizing-button-width);
        height: var(--mdx-comp-button-medium-sizing-button-height);
        padding-right: var(--mdx-comp-button-tertiary-medium-padding-horizontal-default);
        padding-left: var(--mdx-comp-button-tertiary-medium-padding-horizontal-default);
      
        &:hover {
          color: var(--mdx-comp-button-tertiary-medium-color-hover);
          background-color: var(--mdx-comp-button-tertiary-medium-background-color-hover);
          border: var(--mdx-comp-button-tertiary-medium-border-width-hover) solid
            var(--mdx-comp-button-tertiary-medium-border-color-hover);
          border-radius: var(--mdx-comp-button-tertiary-medium-border-radius-hover);
          padding-right: var(--mdx-comp-button-tertiary-medium-padding-horizontal-hover);
          padding-left: var(--mdx-comp-button-tertiary-medium-padding-horizontal-hover);
        }
      
        &:disabled {
          color: var(--mdx-comp-button-tertiary-medium-color-disabled);
          background-color: var(--mdx-comp-button-tertiary-medium-background-color-disabled);
          border: var(--mdx-comp-button-tertiary-medium-border-width-disabled) solid
            var(--mdx-comp-button-tertiary-medium-border-color-disabled);
          border-radius: var(--mdx-comp-button-tertiary-medium-border-radius-disabled);
          padding-right: var(--mdx-comp-button-tertiary-medium-padding-horizontal-disabled);
          padding-left: var(--mdx-comp-button-tertiary-medium-padding-horizontal-disabled);
        }
      }
      
      :host([variant='quaternary'][size='md']) .button {
        font: var(--mdx-comp-button-quaternary-medium-font-default);
        color: var(--mdx-comp-button-quaternary-medium-color-default);
        background-color: var(--mdx-comp-button-quaternary-medium-background-color-default);
        border: var(--mdx-comp-button-quaternary-medium-border-width-default) solid
          var(--mdx-comp-button-quaternary-medium-border-color-default);
        border-radius: var(--mdx-comp-button-quaternary-medium-border-radius-default);
        gap: var(--mdx-comp-button-quaternary-medium-gap-icon-text-default);
        width: var(--mdx-comp-button-medium-sizing-button-width);
        height: var(--mdx-comp-button-medium-sizing-button-height);
        padding-right: var(--mdx-comp-button-quaternary-medium-padding-horizontal-default);
        padding-left: var(--mdx-comp-button-quaternary-medium-padding-horizontal-default);
      
        &:hover {
          color: var(--mdx-comp-button-quaternary-medium-color-hover);
          background-color: var(--mdx-comp-button-quaternary-medium-background-color-hover);
          border: var(--mdx-comp-button-quaternary-medium-border-width-hover) solid
            var(--mdx-comp-button-quaternary-medium-border-color-hover);
          border-radius: var(--mdx-comp-button-quaternary-medium-border-radius-hover);
          padding-right: var(--mdx-comp-button-quaternary-medium-padding-horizontal-hover);
          padding-left: var(--mdx-comp-button-quaternary-medium-padding-horizontal-hover);
        }
      
        &:disabled {
          color: var(--mdx-comp-button-quaternary-medium-color-disabled);
          background-color: var(--mdx-comp-button-quaternary-medium-background-color-disabled);
          border: var(--mdx-comp-button-quaternary-medium-border-width-disabled) solid
            var(--mdx-comp-button-quaternary-medium-border-color-disabled);
          border-radius: var(--mdx-comp-button-quaternary-medium-border-radius-disabled);
          padding-right: var(--mdx-comp-button-quaternary-medium-padding-horizontal-disabled);
          padding-left: var(--mdx-comp-button-quaternary-medium-padding-horizontal-disabled);
        }
      }
      
      :host([variant='primary'][size='lg']) .button {
        font: var(--mdx-comp-button-primary-large-font-default);
        color: var(--mdx-comp-button-primary-large-color-default);
        background-color: var(--mdx-comp-button-primary-large-background-color-default);
        border: var(--mdx-comp-button-primary-large-border-width-default) solid
          var(--mdx-comp-button-primary-large-border-color-default);
        border-radius: var(--mdx-comp-button-primary-large-border-radius-default);
        gap: var(--mdx-comp-button-primary-large-gap-icon-text-default);
        width: var(--mdx-comp-button-large-sizing-button-width);
        height: var(--mdx-comp-button-large-sizing-button-height);
        padding-right: var(--mdx-comp-button-primary-large-padding-horizontal-default);
        padding-left: var(--mdx-comp-button-primary-large-padding-horizontal-default);
      
        &:hover {
          color: var(--mdx-comp-button-primary-large-color-hover);
          background-color: var(--mdx-comp-button-primary-large-background-color-hover);
          border: var(--mdx-comp-button-primary-large-border-width-hover) solid
            var(--mdx-comp-button-primary-large-border-color-hover);
          border-radius: var(--mdx-comp-button-primary-large-border-radius-hover);
          padding-right: var(--mdx-comp-button-primary-large-padding-horizontal-hover);
          padding-left: var(--mdx-comp-button-primary-large-padding-horizontal-hover);
        }
      
        &:disabled {
          color: var(--mdx-comp-button-primary-large-color-disabled);
          background-color: var(--mdx-comp-button-primary-large-background-color-disabled);
          border: var(--mdx-comp-button-primary-large-border-width-disabled) solid
            var(--mdx-comp-button-primary-large-border-color-disabled);
          border-radius: var(--mdx-comp-button-primary-large-border-radius-disabled);
          padding-right: var(--mdx-comp-button-primary-large-padding-horizontal-disabled);
          padding-left: var(--mdx-comp-button-primary-large-padding-horizontal-disabled);
        }
      }
      
      :host([variant='secondary'][size='lg']) .button {
        font: var(--mdx-comp-button-secondary-large-font-default);
        color: var(--mdx-comp-button-secondary-large-color-default);
        background-color: var(--mdx-comp-button-secondary-large-background-color-default);
        border: var(--mdx-comp-button-secondary-large-border-width-default) solid
          var(--mdx-comp-button-secondary-large-border-color-default);
        border-radius: var(--mdx-comp-button-secondary-large-border-radius-default);
        gap: var(--mdx-comp-button-secondary-large-gap-icon-text-default);
        width: var(--mdx-comp-button-large-sizing-button-width);
        height: var(--mdx-comp-button-large-sizing-button-height);
        padding-right: var(--mdx-comp-button-secondary-large-padding-horizontal-default);
        padding-left: var(--mdx-comp-button-secondary-large-padding-horizontal-default);
      
        &:hover {
          color: var(--mdx-comp-button-secondary-large-color-hover);
          background-color: var(--mdx-comp-button-secondary-large-background-color-hover);
          border: var(--mdx-comp-button-secondary-large-border-width-hover) solid
            var(--mdx-comp-button-secondary-large-border-color-hover);
          border-radius: var(--mdx-comp-button-secondary-large-border-radius-hover);
          padding-right: var(--mdx-comp-button-secondary-large-padding-horizontal-hover);
          padding-left: var(--mdx-comp-button-secondary-large-padding-horizontal-hover);
        }
      
        &:disabled {
          color: var(--mdx-comp-button-secondary-large-color-disabled);
          background-color: var(--mdx-comp-button-secondary-large-background-color-disabled);
          border: var(--mdx-comp-button-secondary-large-border-width-disabled) solid
            var(--mdx-comp-button-secondary-large-border-color-disabled);
          border-radius: var(--mdx-comp-button-secondary-large-border-radius-disabled);
          padding-right: var(--mdx-comp-button-secondary-large-padding-horizontal-disabled);
          padding-left: var(--mdx-comp-button-secondary-large-padding-horizontal-disabled);
        }
      }
      
      :host([variant='tertiary'][size='lg']) .button {
        font: var(--mdx-comp-button-tertiary-large-font-default);
        color: var(--mdx-comp-button-tertiary-large-color-default);
        background-color: var(--mdx-comp-button-tertiary-large-background-color-default);
        border: var(--mdx-comp-button-tertiary-large-border-width-default) solid
          var(--mdx-comp-button-tertiary-large-border-color-default);
        border-radius: var(--mdx-comp-button-tertiary-large-border-radius-default);
        gap: var(--mdx-comp-button-tertiary-large-gap-icon-text-default);
        width: var(--mdx-comp-button-large-sizing-button-width);
        height: var(--mdx-comp-button-large-sizing-button-height);
        padding-right: var(--mdx-comp-button-tertiary-large-padding-horizontal-default);
        padding-left: var(--mdx-comp-button-tertiary-large-padding-horizontal-default);
      
        &:hover {
          color: var(--mdx-comp-button-tertiary-large-color-hover);
          background-color: var(--mdx-comp-button-tertiary-large-background-color-hover);
          border: var(--mdx-comp-button-tertiary-large-border-width-hover) solid
            var(--mdx-comp-button-tertiary-large-border-color-hover);
          border-radius: var(--mdx-comp-button-tertiary-large-border-radius-hover);
          padding-right: var(--mdx-comp-button-tertiary-large-padding-horizontal-hover);
          padding-left: var(--mdx-comp-button-tertiary-large-padding-horizontal-hover);
        }
      
        &:disabled {
          color: var(--mdx-comp-button-tertiary-large-color-disabled);
          background-color: var(--mdx-comp-button-tertiary-large-background-color-disabled);
          border: var(--mdx-comp-button-tertiary-large-border-width-disabled) solid
            var(--mdx-comp-button-tertiary-large-border-color-disabled);
          border-radius: var(--mdx-comp-button-tertiary-large-border-radius-disabled);
          padding-right: var(--mdx-comp-button-tertiary-large-padding-horizontal-disabled);
          padding-left: var(--mdx-comp-button-tertiary-large-padding-horizontal-disabled);
        }
      }
      
      :host([variant='quaternary'][size='lg']) .button {
        font: var(--mdx-comp-button-quaternary-large-font-default);
        color: var(--mdx-comp-button-quaternary-large-color-default);
        background-color: var(--mdx-comp-button-quaternary-large-background-color-default);
        border: var(--mdx-comp-button-quaternary-large-border-width-default) solid
          var(--mdx-comp-button-quaternary-large-border-color-default);
        border-radius: var(--mdx-comp-button-quaternary-large-border-radius-default);
        gap: var(--mdx-comp-button-quaternary-large-gap-icon-text-default);
        width: var(--mdx-comp-button-large-sizing-button-width);
        height: var(--mdx-comp-button-large-sizing-button-height);
        padding-right: var(--mdx-comp-button-quaternary-large-padding-horizontal-default);
        padding-left: var(--mdx-comp-button-quaternary-large-padding-horizontal-default);
      
        &:hover {
          color: var(--mdx-comp-button-quaternary-large-color-hover);
          background-color: var(--mdx-comp-button-quaternary-large-background-color-hover);
          border: var(--mdx-comp-button-quaternary-large-border-width-hover) solid
            var(--mdx-comp-button-quaternary-large-border-color-hover);
          border-radius: var(--mdx-comp-button-quaternary-large-border-radius-hover);
          padding-right: var(--mdx-comp-button-quaternary-large-padding-horizontal-hover);
          padding-left: var(--mdx-comp-button-quaternary-large-padding-horizontal-hover);
        }
      
        &:disabled {
          color: var(--mdx-comp-button-quaternary-large-color-disabled);
          background-color: var(--mdx-comp-button-quaternary-large-background-color-disabled);
          border: var(--mdx-comp-button-quaternary-large-border-width-disabled) solid
            var(--mdx-comp-button-quaternary-large-border-color-disabled);
          border-radius: var(--mdx-comp-button-quaternary-large-border-radius-disabled);
          padding-right: var(--mdx-comp-button-quaternary-large-padding-horizontal-disabled);
          padding-left: var(--mdx-comp-button-quaternary-large-padding-horizontal-disabled);
        }
      }
      
      :host([variant='primary'][size='sm'][full-width]) .button,
      :host([variant='primary'][size='md'][full-width]) .button,
      :host([variant='primary'][size='lg'][full-width]) .button,
      :host([variant='secondary'][size='sm'][full-width]) .button,
      :host([variant='secondary'][size='md'][full-width]) .button,
      :host([variant='secondary'][size='lg'][full-width]) .button,
      :host([variant='tertiary'][size='sm'][full-width]) .button,
      :host([variant='tertiary'][size='md'][full-width]) .button,
      :host([variant='tertiary'][size='lg'][full-width]) .button,
      :host([variant='quaternary'][size='sm'][full-width]) .button,
      :host([variant='quaternary'][size='md'][full-width]) .button,
      :host([variant='quaternary'][size='lg'][full-width]) .button {
        width: 100%;
      }    
    `
    this.shadow.appendChild(style)
  }
  // ↑↑↑ packages/web-components/src/components/button/button.scss ↑↑↑

  /**
   * Render HTML
   * @return {void}
   */
  renderHTML () {
    const div = document.createElement('div')
    div.innerHTML = this.as === BUTTON_AS.button
      ? /* HTML */`
        <button part="button" class="button" type="${this.type}" ${this.disabled ? 'disabled' : ''}>
          <slot></slot>
        </button>
      `
      : /* HTML */`
        <a
          part="button"
          class="button"
          href="${this.href}"
          aria-label="${this.ariaLabel}"
          target="${this.target}"
          rel="${this.#isExternalURL(this.href) ? 'noreferrer' : ''}"
        >
          <slot></slot>
        </a>
      `
    this.shadow.appendChild(div.children[0])
  }

  get button () {
    return this.shadow.querySelector('a,button')
  }
}
