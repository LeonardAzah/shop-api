export const attachCookiesToResponse = ({ res, refreshToken, accessToken }) => {
  const oneDay = 1000 * 15 * 60;
  const longerExp = 1000 * 60 * 60 * 24 * 7;

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: true,
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: true,
  });
};
