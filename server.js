const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB without deprecated options
mongoose.connect('mongodb://localhost:27017/shubhada-developers', {
    useNewUrlParser: true, // Optional but commonly used
    useUnifiedTopology: true // Optional but commonly used
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Schemas and Models
const plotSchema = new mongoose.Schema({
    plotno: { type: String, required: true },
    lengthfeet1: { type: Number, required: true },
    lengthinches1: { type: Number, required: true },
    lengthfeet2: { type: Number, required: true },
    lengthinches2: { type: Number, required: true },
    widthfeet1: { type: Number, required: true },
    widthinches1: { type: Number, required: true },
    widthfeet2: { type: Number, required: true },
    widthinches2: { type: Number, required: true },
    plotarea: { type: String, required: true },
    plotfacing: { type: String, required: true },
    status: { type: String, required: true }
});

const Plot = mongoose.model('Plot', plotSchema);

const enquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true }
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);

const contactSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    mobileNumber: String,
    email: String,
    gender: String,
    project: String,
    message: String
});

const Contact = mongoose.model('Contact', contactSchema);

// Handle form submission for enquiries
app.post('/submit_enquiry', async (req, res) => {
    try {
        const newEnquiry = new Enquiry({
            name: req.body.name,
            mobile: req.body.mobile,
            email: req.body.email
        });

        await newEnquiry.save();
        console.log('Enquiry saved:', newEnquiry);
        res.json({ message: 'Enquiry submitted successfully!' });
    } catch (err) {
        console.error('Error saving enquiry:', err);
        res.status(500).json({ error: 'Unable to save enquiry to database' });
    }
});

// Handle form submission for contact information
app.post('/submit-form', async (req, res) => {
    try {
        const newContact = new Contact(req.body);
        await newContact.save();
        res.status(200).json({ message: 'Data submitted successfully!' });
    } catch (error) {
        console.error('Error saving contact data:', error);
        res.status(500).json({ message: 'Error submitting contact data', error });
    }
});

// Endpoint to get all plots
app.get('/plots', async (req, res) => {
    try {
        const plots = await Plot.find();
        res.json(plots);
    } catch (error) {
        console.error('Error fetching plots:', error);
        res.status(500).send(error);
    }
});

// Serve the HTML file for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
