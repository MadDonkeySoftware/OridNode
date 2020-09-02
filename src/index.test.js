/* eslint-disable no-unused-expressions */
const chai = require('chai');

const index = require('./index');

describe('index', () => {
  describe('v1', () => {
    it('has parse and generate methods', () => {
      // Assert
      chai.expect(index.v1).to.not.be.null;
      chai.expect(typeof index.v1.parse).to.equal('function');
      chai.expect(typeof index.v1.generate).to.equal('function');
    });
  });
});
