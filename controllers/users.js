import User from '../models/user.js';

export const getUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.send(users);
    } catch (error) {
      res.status(500).send(error);
    }
  };

export const getUser = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(404).send({ message: 'User not found' });
    }

    const userID = req.user._id;
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

  export const createUser = async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).send(user);
    } catch (error) {
      res.status(400).send(error);
    }
  };

  export const updateUser = async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.userID, req.body, {
        new: true,
        runValidators: true,
      });
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      res.send(user);
    } catch (error) {
      res.status(400).send(error);
    }
  };

  export const deleteUser = async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.userID);
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      res.send(user);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  export const getUserPseudos= async (userIds) => {
    const userPseudos = [];
  
    for (const userId of userIds) {
      try {
        const user = await API.call(`/users/${userId}`, 'GET');
        console.log('User Details:', user);
  
        if (user && user.pseudo) {
          userPseudos.push(user.pseudo);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      }
    }
  
    return userPseudos;
  }
  
  
  
  
  
  
  