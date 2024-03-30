import mongoose from 'mongoose';
import Person from '../models/personPost.js'; // Adjust the path as necessary

export const addOrUpdatePersonAndWork = async (req, res) => {
  const {
    person: personData,
    category,
    title,
    media,
    content,
    publishTime,
    scheduledPublishTime,
    externalSource,
    visibility,
  } = req.body;

  try {
    let existingPerson = await Person.findOne({
      'person.firstName': personData.firstName,
      'person.lastName': personData.lastName,
      'person.featured': personData.featured,
    });

    const newWork = {
      title,
      media,
      content,
      publishTime,
      scheduledPublishTime,
      externalSource,
      visibility,
    };

    // If person does not exist, create a new one
    if (!existingPerson) {
      const newPerson = new Person({
        person: personData,
        works: [newWork], // Initialize the works array with the new work
        category,
        visibility,
      });

      await newPerson.save();
      return res.status(201).json(newPerson);
    } else {
      // If the person exists, add the new work to their list of works
      existingPerson.works.push(newWork);

      await existingPerson.save();
      return res.status(200).json(existingPerson);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
