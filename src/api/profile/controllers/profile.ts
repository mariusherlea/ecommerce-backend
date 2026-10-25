
export default {
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
            ...(address !== undefined && { address }),
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
        address: updatedUser.address,
      };
    } catch (error) {
      strapi.log.error('Profile update failed', error);
      return ctx.internalServerError('Unable to update profile');
    }
  },
};
