const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/taskRoutes');
const cors = require('cors')
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig'); // Adjust path as necessary
dotenv.config();

const app = express();
const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors({origin:false}));
app.use('/api', taskRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
