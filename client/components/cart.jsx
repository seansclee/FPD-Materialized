import React, { Component } from 'react'
import { connect } from 'react-redux'
import CartItems from './cartItems.jsx'
import { addOneItem, changeOneItem, removeItem } from '../store/item'

class Cart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      guestCart: []
    }
  }

  componentDidMount () {
    const guestCart = this.getGuestCart()
    this.setState({ guestCart })
  }

  getGuestCart = () => {
    return Object.keys(localStorage).slice(1)
    .map(key => JSON.parse(localStorage.getItem(key)))
  }

  createCart = items => {
    const drinksTable = this.props.drinksTable
    return items.map(item => {
      const updatedItem = drinksTable[item.drinkId];
      updatedItem.quantity = item.quantity
      return updatedItem
    })
  }

  mergeCart = guestItems => {
    const orderId = this.props.order.id
    guestItems.forEach(item => {
      item.orderId = orderId
      this.props.addToCart(item)
      })
    localStorage.clear()
  }

  total = items => {
    return items.reduce((acc, pV) => acc + (pV.price * pV.quantity), 0) / 100
  }

  handleChange = (event, drinkId) => {
    if (this.props.isLoggedIn) {
      const item = {
        drinkId,
        quantity: +event.target.value,
        orderId: this.props.order.id
      }
      this.props.changeQuantity(item)
    } else {
      const item = {
        drinkId,
        quantity: +event.target.value
      }
      if (!+event.target.value) localStorage.removeItem(`drinkId${drinkId}`)
      else localStorage.setItem(`drinkId${drinkId}`, JSON.stringify(item))
      const guestCart = this.getGuestCart()
      this.setState({ guestCart })
    }
  }

  handleDelete = event => {
    if (this.props.isLoggedIn) {
      this.props.deleteItem({
        drinkId: +event.target.value,
        orderId: this.props.order.id
      })
    } else {
      localStorage.removeItem(`drinkId${event.target.value}`)
      const guestCart = this.getGuestCart()
      this.setState({ guestCart })
    }
  }

  render () {
    if (!this.props.drinksTable['1']) return null
    const guestCart = this.getGuestCart()
    if (this.props.isLoggedIn) this.mergeCart(guestCart)
    const drinksArr = this.props.isLoggedIn ? this.props.items : guestCart
    const drinks = drinksArr.length ? this.createCart(drinksArr) : drinksArr
    const total = this.total(drinks)
    return (
      <div>
        {drinks.length ? (
          <CartItems drinks={drinks} total={total} handleChange={this.handleChange} handleDelete={this.handleDelete} />
        ) : (
          <h3>Your cart is empty!</h3>
        )}
      </div>
    )
  }
}

const mapStateToProps = ({ drinks, order, user, items, drinksTable }) => ({
  order,
  drinks,
  user,
  items,
  drinksTable,
  isLoggedIn: !!user.id
})

const mapDispatchToProps = dispatch => ({
  addToCart: item => dispatch(addOneItem(item)),
  changeQuantity: item => dispatch(changeOneItem(item)),
  deleteItem: item => dispatch(removeItem(item))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart)
