const Form = require('../models/Form');

exports.submitForm = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, service, stage } = req.body;
    const newForm = new Form({ firstName, lastName, email, phoneNumber, service, stage });
    await newForm.save();
    res.status(201).json({ message: 'Form submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting form', error });
  }
};



exports.getForm = async () => {
  try {
    // Fetch appointments sorted by creation date (newest first)
    const appointments = await Form.find().sort({ createdAt: -1 });

    if (appointments.length === 0) {
      return []; // Return an empty array if no appointments found
    }

    console.log(appointments);
    return appointments; // The most recently added appointment will be first in this array
   
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};

exports.deleteForm = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the form by its id
    const deletedForm = await Form.findByIdAndDelete(id);

    if (!deletedForm) {
      return res.status(404).json({ message: 'Form not found' });
    }

    return res.status(200).json({ message: 'Form deleted successfully', form: deletedForm });
  } catch (error) {
    console.error('Error deleting form:', error);
    return res.status(500).json({ message: 'Server error while deleting form' });
  }
};