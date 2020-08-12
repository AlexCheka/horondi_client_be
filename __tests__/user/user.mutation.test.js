/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');

require('dotenv').config();

let userId;
let token;

const testUser = {
  firstName: 'Petro',
  lastName: 'Tatsenyak',
  email: 'tacjka34@gmail.com',
  password: '12345678Pt',
  phoneNumber: '380666666666',
  role: 'admin',
  address: {
    country: 'Ukraine',
    city: 'Kiev',
    street: 'Shevchenka',
    buildingNumber: '23',
  },
  wishlist: [],
  orders: [],
  comments: [],
};

describe('mutations', () => {
  test('should register user', async () => {
    const {
      firstName, lastName, email, password,
    } = testUser;

    const res = await client.mutate({
      mutation: gql`
        mutation(
          $firstName: String!
          $lastName: String!
          $email: String!
          $password: String!
        ) {
          registerUser(
            user: {
              firstName: $firstName
              lastName: $lastName
              email: $email
              password: $password
            }
          ) {
            _id
            firstName
            lastName
            email
            role
            registrationDate
          }
        }
      `,
      variables: {
        firstName,
        lastName,
        email,
        password,
      },
    });
    userId = res.data.registerUser._id;

    expect(typeof res.data.registerUser._id).toBe('string');
    expect(res.data.registerUser).toHaveProperty(
      'firstName',
      testUser.firstName,
    );
    expect(res.data.registerUser).toHaveProperty('lastName', testUser.lastName);
    expect(res.data.registerUser).toHaveProperty('email', testUser.email);
    expect(res.data.registerUser).toHaveProperty('role', 'user');
    expect(res.data.registerUser).toHaveProperty('registrationDate');
    const date = new Date(
      +res.data.registerUser.registrationDate,
    ).toDateString();
    const dateNow = new Date(Date.now()).toDateString();
    expect(dateNow).toBe(date);
  });

  test('should throw error User with provided email already exist', async () => {
    const {
      firstName, lastName, email, password,
    } = testUser;

    const res = await client
      .mutate({
        mutation: gql`
          mutation(
            $firstName: String!
            $lastName: String!
            $email: String!
            $password: String!
          ) {
            registerUser(
              user: {
                firstName: $firstName
                lastName: $lastName
                email: $email
                password: $password
              }
            ) {
              _id
              firstName
              lastName
              email
              role
              registrationDate
            }
          }
        `,
        variables: {
          firstName,
          lastName,
          email,
          password,
        },
      })
      .catch(err => err);

    expect(res.graphQLErrors.length).toBe(1);
    expect(res.graphQLErrors[0].message).toBe(
      'User with provided email already exists',
    );
  });

  test('should authorize and recive user token', async () => {
    const { email, password } = testUser;

    const res = await client.mutate({
      mutation: gql`
        mutation($email: String!, $password: String!) {
          loginUser(user: { email: $email, password: $password }) {
            _id
            firstName
            lastName
            email
            role
            registrationDate
            token
          }
        }
      `,
      variables: {
        email,
        password,
      },
    });

    expect(res.data.loginUser).toHaveProperty('token');
    expect(typeof res.data.loginUser.token).toBe('string');
    expect(res.data.loginUser).toHaveProperty('firstName', testUser.firstName);
    expect(res.data.loginUser).toHaveProperty('lastName', testUser.lastName);
    expect(res.data.loginUser).toHaveProperty('email', testUser.email);
    expect(res.data.loginUser).toHaveProperty('role', 'user');
    expect(res.data.loginUser).toHaveProperty('registrationDate');

    token = res.data.loginUser.token;
  });

  test('should throw error User with provided email not found', async () => {
    const res = await client
      .mutate({
        mutation: gql`
          mutation {
            loginUser(
              user: { email: "udernotfound@gmail.com", password: "12345678Pt" }
            ) {
              _id
              firstName
              token
            }
          }
        `,
      })
      .catch(err => err);

    expect(res.graphQLErrors.length).toBe(1);
    expect(res.graphQLErrors[0].message).toBe(
      'User with provided email not found',
    );
  });

  test('should throw error Wrong password', async () => {
    const res = await client
      .mutate({
        mutation: gql`
          mutation($email: String!) {
            loginUser(user: { email: $email, password: "12345678pT" }) {
              _id
              firstName
              token
            }
          }
        `,
        variables: {
          email: testUser.email,
        },
      })
      .catch(err => err);

    expect(res.graphQLErrors.length).toBe(1);
    expect(res.graphQLErrors[0].message).toBe('Wrong password');
  });

  test('should update user by id', async () => {
    const {
      email,
      role,
      phoneNumber,
      address,
      wishlist,
      orders,
      comments,
    } = testUser;

    const {
      country, city, street, buildingNumber,
    } = address;

    const res = await client.mutate({
      mutation: gql`
        mutation(
          $userId: ID!
          $email: String!
          $phoneNumber: String!
          $role: String!
          $country: String!
          $city: String!
          $street: String!
          $buildingNumber: String!
          $wishlist: [ID!]!
          $orders: [ID!]!
          $comments: [ID!]!
        ) {
          updateUserById(
            user: {
              firstName: "Updated"
              lastName: "Updated"
              email: $email
              phoneNumber: $phoneNumber
              role: $role
              address: {
                country: $country
                city: $city
                street: $street
                buildingNumber: $buildingNumber
              }
              wishlist: $wishlist
              orders: $orders
              comments: $comments
            }
            id: $userId
          ) {
            firstName
            lastName
            email
            phoneNumber
            role
            address {
              country
              city
              street
              buildingNumber
            }
            wishlist
            orders
            comments
          }
        }
      `,
      context: {
        headers: {
          token,
        },
      },
      variables: {
        userId,
        email,
        role,
        phoneNumber,
        country,
        city,
        street,
        buildingNumber,
        wishlist,
        orders,
        comments,
      },
    });

    expect(res.data.updateUserById).toHaveProperty('firstName', 'Updated');
    expect(res.data.updateUserById).toHaveProperty('lastName', 'Updated');
    expect(res.data.updateUserById).toHaveProperty('email', testUser.email);
    expect(res.data.updateUserById).toHaveProperty(
      'phoneNumber',
      testUser.phoneNumber,
    );
    expect(res.data.updateUserById).toHaveProperty('role', testUser.role);
    expect(res.data.updateUserById).toHaveProperty('address', {
      country: testUser.address.country,
      city: testUser.address.city,
      street: testUser.address.street,
      buildingNumber: testUser.address.buildingNumber,
    });
    expect(res.data.updateUserById).toHaveProperty(
      'wishlist',
      testUser.wishlist,
    );
    expect(res.data.updateUserById).toHaveProperty('orders', testUser.orders);
    expect(res.data.updateUserById).toHaveProperty(
      'comments',
      testUser.comments,
    );
  });

  test('should throw error user with provided id not found', async () => {
    const {
      email,
      role,
      phoneNumber,
      address,
      wishlist,
      orders,
      comments,
    } = testUser;

    const {
      country, city, street, buildingNumber,
    } = address;

    const res = await client
      .mutate({
        mutation: gql`
          mutation(
            $userId: ID!
            $email: String!
            $phoneNumber: String!
            $role: String!
            $country: String!
            $city: String!
            $street: String!
            $buildingNumber: String!
            $wishlist: [ID!]!
            $orders: [ID!]!
            $comments: [ID!]!
          ) {
            updateUserById(
              user: {
                firstName: "Updated"
                lastName: "Updated"
                email: $email
                phoneNumber: $phoneNumber
                role: $role
                address: {
                  country: $country
                  city: $city
                  street: $street
                  buildingNumber: $buildingNumber
                }
                wishlist: $wishlist
                orders: $orders
                comments: $comments
              }
              id: $userId
            ) {
              firstName
              lastName
              email
              phoneNumber
              role
              address {
                country
                city
                street
                buildingNumber
              }
              wishlist
              orders
              comments
            }
          }
        `,
        context: {
          headers: {
            token,
          },
        },
        variables: {
          userId: '23ee481430a0056b8e5cc015',
          email,
          role,
          phoneNumber,
          country,
          city,
          street,
          buildingNumber,
          wishlist,
          orders,
          comments,
        },
      })
      .catch(err => err);

    expect(res.graphQLErrors.length).toBe(1);
    expect(res.graphQLErrors[0].message).toBe(
      'User with provided _id not found',
    );
  });

  test('should update user by token', async () => {
    const {
      email,
      phoneNumber,
      address,
      wishlist,
      orders,
      comments,
    } = testUser;

    const {
      country, city, street, buildingNumber,
    } = address;

    const res = await client.mutate({
      mutation: gql`
        mutation(
          $email: String!
          $phoneNumber: String!
          $country: String!
          $city: String!
          $street: String!
          $buildingNumber: String!
          $wishlist: [ID!]!
          $orders: [ID!]!
          $comments: [ID!]!
        ) {
          updateUserByToken(
            user: {
              firstName: "UpdatedByToken"
              lastName: "UpdatedByToken"
              email: $email
              phoneNumber: $phoneNumber
              role: "user"
              address: {
                country: $country
                city: $city
                street: $street
                buildingNumber: $buildingNumber
              }
              wishlist: $wishlist
              orders: $orders
              comments: $comments
            }
          ) {
            firstName
            lastName
            email
            phoneNumber
            role
            address {
              country
              city
              street
              buildingNumber
            }
            wishlist
            orders
            comments
          }
        }
      `,
      context: {
        headers: {
          token,
        },
      },
      variables: {
        email,
        phoneNumber,
        country,
        city,
        street,
        buildingNumber,
        wishlist,
        orders,
        comments,
      },
    });

    expect(res.data.updateUserByToken).toHaveProperty(
      'firstName',
      'UpdatedByToken',
    );
    expect(res.data.updateUserByToken).toHaveProperty(
      'lastName',
      'UpdatedByToken',
    );
    expect(res.data.updateUserByToken).toHaveProperty('email', testUser.email);
    expect(res.data.updateUserByToken).toHaveProperty(
      'phoneNumber',
      testUser.phoneNumber,
    );
    expect(res.data.updateUserByToken).toHaveProperty('role', 'user');
    expect(res.data.updateUserByToken).toHaveProperty('address', {
      country: testUser.address.country,
      city: testUser.address.city,
      street: testUser.address.street,
      buildingNumber: testUser.address.buildingNumber,
    });
    expect(res.data.updateUserByToken).toHaveProperty(
      'wishlist',
      testUser.wishlist,
    );
    expect(res.data.updateUserByToken).toHaveProperty(
      'orders',
      testUser.orders,
    );
    expect(res.data.updateUserByToken).toHaveProperty(
      'comments',
      testUser.comments,
    );
  });

  test('should throw Invalid authorization token error', async () => {
    const res = await client
      .mutate({
        mutation: gql`
          mutation {
            updateUserByToken(user: { firstName: "UpdatedByToken" }) {
              firstName
              lastName
              email
              role
            }
          }
        `,
      })
      .catch(err => err);

    expect(res.graphQLErrors.length).toBe(1);
    expect(res.graphQLErrors[0].message).toBe('Invalid authorization token');
  });

  test('should throw Invalid authorization token Error', async () => {
    const res = await client
      .mutate({
        mutation: gql`
          mutation {
            updateUserByToken(user: { firstName: "UpdatedByToken" }) {
              firstName
              lastName
              email
              role
            }
          }
        `,
        context: {
          headers: {
            token:
              'eyJ3bGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjA4OWI4MTRjZDQzNDE0NjgzODkxNjAiLCJlbWFpbCI6InRhY2prYTMzNEBnbWFpbC5jb20iLCJpYXQiOjE1OTUwMTA4MTMsImV4cCI6MTU5NTAxNDQxM30.FKxZkqO1Jheij7pPHR3I7y9n3BT9_MK2-i4eCYjuivM',
          },
        },
      })
      .catch(err => err);

    expect(res.networkError.result.errors[0].message).toBe(
      'Context creation failed: Invalid authorization token',
    );
  });

  test('should delete user', async () => {
    const res = await client.mutate({
      mutation: gql`
        mutation($userId: ID!) {
          deleteUser(id: $userId) {
            _id
          }
        }
      `,
      variables: {
        userId,
      },
    });

    expect(res.data.deleteUser._id).toEqual(userId);
  });
});
