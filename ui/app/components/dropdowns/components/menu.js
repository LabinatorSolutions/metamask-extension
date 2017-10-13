const inherits = require('util').inherits
const Component = require('react').Component
const h = require('react-hyperscript')

inherits(Menu, Component)
function Menu () { Component.call(this) }

Menu.prototype.render = function () {
  const { className = '', children, isShowing } = this.props
  return isShowing
    ? h('div', { className: `menu ${className}` }, children)
    : h('noscript')
}

inherits(Item, Component)
function Item () { Component.call(this) }

Item.prototype.render = function () {
  const {
    icon,
    children,
    text,
    className = '',
    onClick,
  } = this.props
  const itemClassName = `menu__item ${className} ${onClick ? 'menu__item--clickable' : ''}`
  const iconComponent = icon ? h('div.menu__item__icon', [icon]) : null
  const textComponent = text ? h('div.menu__item__text', text) : null

  return children
    ? h('div', { className: itemClassName }, children)
    : h('div.menu__item', { className: itemClassName }, [ iconComponent, textComponent ]
      .filter(d => Boolean(d))
    )
}

inherits(Divider, Component)
function Divider () { Component.call(this) }

Divider.prototype.render = function () {
  return h('div.menu__divider')
}

module.exports = { Menu, Item, Divider }
