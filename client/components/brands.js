import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

import { getBrands } from '../store/brand'

const Brands = ({ brands }) => {
  if (!brands.length) return null
  console.log(brands)
  return (
    <div>
      {brands.map(brand => (
        <div key={brand.id}>
          <img src={brand.imageUrl} />
          <NavLink to={`/brands/${brand.id}`}>
            <h2>{brand.name}</h2>
          </NavLink>
        </div>
      ))}
    </div>
  )
}

const mapStateToProps = ({ brands }) => ({
  brands
})

const mapDispatchToProps = {
  getBrands
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Brands)
