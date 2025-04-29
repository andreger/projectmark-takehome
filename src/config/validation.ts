export const validation = {
  resource: {
    url: { min: 10, max: 500 },
    description: { min: 10, max: 500 },
  },
  topic: {
    name: { min: 3, max: 100 },
    content: { min: 10, max: 5000 },
  },
  user: {
    name: { min: 3, max: 100 },
    password: { min: 6, max: 100 },
  },
};
