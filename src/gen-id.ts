import crypto from 'crypto';
export const genId = (payload: any) => {
  const random = crypto.randomBytes(16).toString('hex');

  if (!payload.user) {
    return random;
  }

  return `${payload.user.id}:${random}`;
};
