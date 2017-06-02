import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import <%= name %> from './'

const defaultProps = {

}

const shallowEl = xtend => shallow(
  <<%= name %> {...defaultProps} {...xtend} />
)

describe('<<%= name %> />', function () {

})
