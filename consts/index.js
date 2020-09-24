const roles = {
  USER: 'user',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
};

const availableForRegistrationRoles = [roles.ADMIN];

const horondiAddress = {
  street: 'Литвиненка',
  city: 'Львів',
  buidingNumber: '8',
  flat: '1',
}

const horondyCityRef = 'db5c88f5-391c-11dd-90d9-001a92567626'

module.exports = {
  roles,
  availableForRegistrationRoles,
  horondiAddress,
  horondyCityRef,
};