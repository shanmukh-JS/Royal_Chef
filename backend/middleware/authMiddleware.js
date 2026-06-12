const protectAdmin = (req, res, next) => {
  req.admin = {
    id: 1,
    email: 'admin@restaurant.com',
    name: 'Restaurant Admin'
  };

  next();
};

module.exports = {
  protectAdmin
};