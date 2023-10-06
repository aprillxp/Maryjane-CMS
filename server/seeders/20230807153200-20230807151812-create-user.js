'use strict';

const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Users', [{
      username: 'billie',
      email: 'billie@mail.com',
      password: bcrypt.hashSync('billie', bcrypt.genSaltSync(8)),
      role: 'Admin',
      phoneNumber: '081234567892',
      address: 'California',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      username: 'hihi',
      email: 'hihi@mail.com',
      password: bcrypt.hashSync('hihi', bcrypt.genSaltSync(8)),
      role: 'staff',
      phoneNumber: '081234567893',
      address: 'Gotham',
      createdAt: new Date(),
      updatedAt: new Date(),
    }])
      
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null)
  }
};
