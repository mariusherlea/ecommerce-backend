
//src/api/profile/routes/profile.ts

export default {
  routes: [
    {
      method: 'PUT',
      path: '/profile',
      handler: 'profile.update',
      config: {
        auth: {},
      },
    },
    {
      method: 'GET',
      path: '/profile/orders',
      handler: 'profile.orders',
      config: {
        auth: {},
      },
    },
  ],
};
