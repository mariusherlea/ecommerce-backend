//src/api/profile/controllers/profile.ts

export default {
  // Update authenticated user's profile
  async update(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }

    const body = ctx.request.body ?? {};
    const { fullName, phone, address } = body;

    if (
      (fullName !== undefined && typeof fullName !== 'string') ||
      (phone !== undefined && typeof phone !== 'string') ||
      (address !== undefined && typeof address !== 'string')
    ) {
      return ctx.badRequest('Invalid profile data');
    }

    try {
      const updatedUser = await strapi.db
        .query('plugin::users-permissions.user')
        .update({
          where: { id: user.id },
          data: {
            ...(fullName !== undefined && { fullName }),
            ...(phone !== undefined && { phone }),
            ...(address !== undefined && {
              address_line1: address,
              shippingAddress: address,
            }),
          },
        });

      if (!updatedUser) {
        return ctx.notFound('User not found');
      }

      ctx.body = {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        phone: updatedUser.phone,
        address:
          updatedUser.address_line1 ||
          updatedUser.shippingAddress ||
          '',
      };
    } catch (error) {
      strapi.log.error('Profile update failed', error);
      return ctx.internalServerError('Unable to update profile');
    }
  },

  // Get orders belonging only to the authenticated user
  async orders(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }

    try {
      const orders = await strapi.db
        .query('api::order.order')
        .findMany({
          where: {
            email: user.email,
            publishedAt: {
              $notNull: true,
            },
          },
          populate: {
            items: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

      ctx.body = {
        data: orders.map((order) => ({
          id: order.id,
          total: order.total,
          stare: order.stare,
          createdAt: order.createdAt,
          items: order.items || [],
        })),
      };
    } catch (error) {
      strapi.log.error('Fetching user orders failed', error);
      return ctx.internalServerError('Unable to fetch orders');
    }
  },
};

