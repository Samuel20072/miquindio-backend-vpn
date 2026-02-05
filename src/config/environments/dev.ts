export const devConfig = {
  port: parseInt(process.env.APP_PORT ?? '3000', 10),
  database: {
    url: process.env.DB_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  frontend: {
    url: 'http://localhost:4200',
  },
  cors: {
    origin: '*',
  },
};
