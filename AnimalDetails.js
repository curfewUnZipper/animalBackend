const mongoose = require('mongoose');

const AnimalDetailSchema = new mongoose.Schema({
    animalUID: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      breed: {
        type: String,
        required: true,
        trim: true,
      },
      age: {
        type: Number,
        required: true,
        min: 0, // Ensures age can't be negative
      },
      parity: {
        type: Number,
        required: true,
        min: 0, // Ensures parity can't be negative
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      fathersName: {
        type: String,
        required: true,
        trim: true,
      },
      fullAddress: {
        type: String,
        required: true,
        trim: true,
      },
      aadhaarNo: {
        type: String,
        required: true,
        match: /^[0-9]{12}$/, // Regular expression for 12-digit Aadhaar number
      },
      contactNo: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/, // Regular expression for 10-digit contact number
      },
    },{
    collection:'AnimalInfo',
});

mongoose.model('AnimalInfo',AnimalDetailSchema);
