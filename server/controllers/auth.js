import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // User model to interact with the user document

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      location,
      occupation,
      picturePath,
      friends,
    } = req.body;

    const salt = await bcrypt.genSalt(); // created a random salt, used to encrypt the password
    const passwordHash = await bcrypt.hash(password, salt); // hashed password

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      location,
      occupation,
      picturePath,
      friends,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.staus(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: 'User does not exist' });

    // Authentication
    const isMatch = await bcrypt.compare(password, user.password); //uses the same salt
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // Autherization, user will use the token for services
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); //creating a jwt token for the logged in authenticated user
    delete user.password;
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
