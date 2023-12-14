import { Shadow } from '../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * This component shall simulate some behavior of a controller for pure test and demo purpose
 *
 * @export
 * @class MdxTestComponent
 * @type {CustomElementConstructor}
 */
export default class MdxTestComponent extends Shadow() {
  constructor (options = {}, ...args) {
    super({
      importMetaUrl: import.meta.url,
      mode: 'false',
      ...options
    }, ...args)
  }

  connectedCallback () {
    this.addEventListener('mdx-component-click-event', event => console.log('mdx-test-component test click listener: ', event))
    this.addEventListener('mdx-component-mutation-event', event => console.log('mdx-test-component test mutation listener: ', event))

    const div = document.createElement('div')
    div.innerHTML = '<hr>Below are test buttons. More at: src/es/components/pages/MdxComponents.html<br>'
    this.appendChild(div)
    const checkBtn = document.createElement('button')
    checkBtn.textContent = 'test -> check'
    checkBtn.onclick = () => this.dispatchEvent(new CustomEvent('mdx-set-attribute', {
      detail: {
        attributes: {
          checked: true,
          hello: 'my name is...?'
        }
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
    this.appendChild(checkBtn)
    const unCheckBtn = document.createElement('button')
    unCheckBtn.textContent = 'test -> uncheck'
    unCheckBtn.onclick = () => this.dispatchEvent(new CustomEvent('mdx-set-attribute', {
      detail: {
        attributes: {
          checked: 'remove',
          hello: 'my name is dude'
        }
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
    this.appendChild(unCheckBtn)
  }
}
