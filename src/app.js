require('dotenv').config();
const cors = require('cors');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');
const app = express();
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname,"../templates/views"));


app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/auth', authRoutes);

app.use('/', indexRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
