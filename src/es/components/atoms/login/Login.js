// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global self */
/* global CustomEvent */

/**
 * MDX Login
 * Avatar: https://mdx-web-components.migros.net/?path=/docs/ui-login-avatar--docs
 * Button: https://mdx-web-components.migros.net/?path=/docs/ui-login-button--docs
 * Flyout: https://mdx-web-components.migros.net/?path=/docs/ui-login-flyout--docs
 * 
 * specific settings of those components can be passed by attribute name eg.:
 * 
 * button="{
    'loginbuttonclick': '() => self.open(\'https://migros.account.ch/login\', \'_self\')'
    'language': 'de',
    'size': 'sm',
    'type': 'neutral',
    'dark': true,
    'is-logged-in': true
 * }"
 *
 * avatar="{
    'is-logged-in': true,
    'dark': true,
    'notification': true,
    'size': 'sm',
    'user-initials': 'AW',
    'profile-image-url': 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&amp;w=2776&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'profile-image-alt': 'Alt text for profile image',
    'login-avatar-arialabel': 'Migros Account from: ',
 * }"
 * 
 * flyout="{
    'dark': true,
    'notification-type': 'none',
    'open': true,
    'logout': '() => self.open(\'https://migros.account.ch/logout\', \'_self\')',
    'language': 'de',
    'user-profile-email': 'anita-ulrich@mgb.ch',
    'user-profile-name': 'Anita Ulrich',
    'account-url': 'https://account.migros.ch/account',
    'menuitemgroup': [{'title':'looooooooooooooooooooooooooooong Title','menuItems':[{'label':'I am a Link ','href':'https://account.migros.ch/account','as':'link'},{'label':'I am a Button','href':'#','as':'button'}]},{'title':'Group 2','menuItems':[{'label':'I am a looooooooooooooooooooooooooooong Link','href':'#','as':'link'},{'label':'Link 4','href':'#','as':'link'},{'label':'Link 5','href':'#','as':'link'},{'label':'Link 6','href':'#','as':'link'}]}],
    'notificationlinks': {'notifications':{'cumulusConnection':'https://account.migros.ch/cumulus','mailDeliverability':'https://account.migros.ch/account'}}
 * }"
 * 
 * settings which target all mdx login components
 * 
 * all="{
    'is-logged-in': true,
    'dark': true,
    'language': 'de',
    'size': 'sm',
 * }"
 *
 * show-logout-button
 *
 * @export
 * @class Login
 * @type {CustomElementConstructor}
 * @attribute {
 * }
 */
export default class Login extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.clickEventListener = event => {
      if (event.composedPath().includes(this.mdxLoginAvatar)) {
        event.preventDefault()
        event.stopPropagation()
        if (this.mdxLoginFlyout.hasAttribute('open')) {
          this.mdxLoginFlyout.removeAttribute('open')
        } else {
          this.mdxLoginFlyout.setAttribute('open', 'true')
        }
      }
    }

    this.loginButtonClickEventListener = event => {
      if (event.composedPath().includes(this.mdxLoginButton)) this.mdxLoginButton.loginButtonClick()
    }
  }

  connectedCallback () {
    this.hidden = true
    const showPromises = []
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    if (this.shouldRenderHTML()) showPromises.push(this.renderHTML())
    Promise.all(showPromises).then(() => (this.hidden = false))
    this.addEventListener('click', this.clickEventListener)
    this.addEventListener('loginButtonClick', this.loginButtonClickEventListener)
  }

  disconnectedCallback () {
    this.removeEventListener('click', this.clickEventListener)
    this.removeEventListener('loginButtonClick', this.loginButtonClickEventListener)
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
    return !this.mdxComponent || !this.mdxLoginButton || !this.mdxLoginAvatar || !this.mdxLoginFlyout
  }

  /**
   * renders the css
   *
   * @return {Promise<void>}
   */
  renderCSS () {
    this.css = /* css */`
      :host > mdx-component {
        position: relative;
        width: fit-content;
        display: block;
      }
      :host([is-logged-in=true]:not([show-logout-button])) > mdx-component > mdx-login-button {
        display: none;
      }
      :host([is-logged-in=false]) > mdx-component > mdx-login-avatar, :host([show-logout-button]) > mdx-component > mdx-login-avatar {
        display: none;
      }
      :host([is-logged-in=false]) > mdx-component >  mdx-login-flyout {
        display: none;
      }
      :host > mdx-component > mdx-login-flyout {
        position: absolute;
        right: -50%;
        top: 100%;
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
    if (!this.mdxComponent) this.html = '<mdx-component></mdx-component>'
    // write attributes
    let all
    if (!this.mdxLoginButton) this.html = `<mdx-login-button ${(all = this.getAttributeString(this.getAttribute('all')))} ${this.getAttributeString(this.getAttribute('button'))}></mdx-login-button>`
    // bug fix login-button listens to is-loggedin attribute instead of is-logged-in as the avatar does
    if (this.mdxLoginButton.hasAttribute('is-logged-in')) this.mdxLoginButton.setAttribute('is-loggedin', this.mdxLoginButton.getAttribute('is-logged-in'))
    // stencil sucks and can't parse attribute objects, here it recommends script tags: https://stenciljs.com/docs/properties
    if (this.mdxLoginButton.hasAttribute('loginbuttonclick')) this.mdxLoginButton.loginButtonClick = eval(this.mdxLoginButton.getAttribute('loginbuttonclick'))
    if (!this.mdxLoginAvatar) this.html = `<mdx-login-avatar ${all || (all = this.getAttributeString(this.getAttribute('all')))} ${this.getAttributeString(this.getAttribute('avatar'))}></mdx-login-avatar>`
    if (!this.mdxLoginFlyout) this.html = `<mdx-login-flyout ${all || this.getAttributeString(this.getAttribute('all'))} ${this.getAttributeString(this.getAttribute('flyout'))}></mdx-login-flyout>`
    // stencil sucks and can't parse attribute objects, here it recommends script tags: https://stenciljs.com/docs/properties
    if (this.mdxLoginFlyout.hasAttribute('menuitemgroup')) this.mdxLoginFlyout.menuItemGroup = JSON.parse(this.mdxLoginFlyout.getAttribute('menuitemgroup'))
    if (this.mdxLoginFlyout.hasAttribute('notificationlinks')) this.mdxLoginFlyout.notificationLinks = JSON.parse(this.mdxLoginFlyout.getAttribute('notificationlinks'))
    if (this.mdxLoginFlyout.hasAttribute('logout')) this.mdxLoginFlyout.logout = eval(this.mdxLoginFlyout.getAttribute('logout'))
    // put the components in order
    if (!this.mdxComponent.contains(this.mdxLoginButton)) this.mdxComponent.appendChild(this.mdxLoginButton)
    if (!this.mdxComponent.contains(this.mdxLoginAvatar)) this.mdxComponent.appendChild(this.mdxLoginAvatar)
    if (!this.mdxComponent.contains(this.mdxLoginFlyout)) this.mdxComponent.appendChild(this.mdxLoginFlyout)
    this.setAttribute('is-logged-in', this.root.querySelector('[is-logged-in=true]') ? 'true' : 'false')
    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../organisms/MdxComponent.js`,
        name: 'mdx-component'
      }
    ])
  }

  getAttributeString(attribute) {
    let settings
    return Object.keys((settings = Login.parseAttribute(attribute) || {})).reduce((acc, key) => `${acc} ${key}='${typeof settings[key] === 'object' ? JSON.stringify(settings[key]) : settings[key]}'`, '')
  }

  get mdxComponent () {
    return this.root.querySelector('mdx-component')
  }

  get mdxLoginButton () {
    return this.root.querySelector('mdx-login-button')
  }

  get mdxLoginFlyout () {
    return this.root.querySelector('mdx-login-flyout')
  }

  get mdxLoginAvatar () {
    return this.root.querySelector('mdx-login-avatar')
  }
}
