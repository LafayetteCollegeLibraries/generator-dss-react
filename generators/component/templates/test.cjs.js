const React = require('react')
const Chai = require('chai')
const expect = Chai.expect
const Enzyme = require('enzyme')
const shallow = Enzyme.shallow
const <%= name %> = require('./')

const defaultProps = {

}

const shallowEl = function (xtend) {
  return shallow(
    <<%= name %> {...defaultProps} {...xtend} />
  )
}

describe('<<%= name %> />', function () {

})
