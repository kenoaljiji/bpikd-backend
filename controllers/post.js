import Person from '../models/personPost.js';
import { agenda } from '../utils/agenda.js'; // Ensure this path is correct

import moment from 'moment-timezone';

// Assuming 'scheduledPublishTime' is in local time and you want to convert it to UTC

export const addOrUpdatePersonAndWork = async (req, res) => {
  const data = JSON.parse(req.body.data);

  const {
    person: personData,
    category,
    title,
    content,
    publishTime,
    scheduledPublishTime,
    externalSource,
    visibility,
    isPublished,
  } = data;

  try {
    let existingPerson = await Person.findOne({
      'person.firstName': {
        $regex: new RegExp('^' + personData.firstName + '$', 'i'),
      },
      'person.lastName': {
        $regex: new RegExp('^' + personData.lastName + '$', 'i'),
      },
    });

    let featuredImage;

    if (
      req.files &&
      req.files.featuredImage &&
      req.files.featuredImage.length > 0
    ) {
      const file = req.files.featuredImage[0];
      featuredImage = `${req.protocol}://${req.get('host')}/uploads/${
        file.filename
      }`;
    } else {
      featuredImage = null; // or set a default value or handle the case where there's no featured image
    }

    // Assuming the featured image is uploaded with the field name 'featuredImage
    // Construct media object from uploaded files
    const mediaFiles = {
      images: req.files['images']
        ? req.files['images'].map((file) => ({
            url: `${req.protocol}://${req.get('host')}/uploads/${
              file.filename
            }`,
            name: file.name,
            type: file.mimetype,
          }))
        : [],
      audios: req.files['audios']
        ? req.files['audios'].map((file) => ({
            url: `${req.protocol}://${req.get('host')}/uploads/${
              file.filename
            }`,
            name: file.originalname,
            fileType: file.mimetype,
          }))
        : [],
      videos: req.files['videos']
        ? req.files['videos'].map((file) => ({
            url: `${req.protocol}://${req.get('host')}/uploads/${
              file.filename
            }`,
            name: file.originalname,
            fileType: file.mimetype,
          }))
        : [],
      documents: req.files['documents']
        ? req.files['documents'].map((file) => ({
            url: `${req.protocol}://${req.get('host')}/uploads/${
              file.filename
            }`,
            name: file.originalname,
            fileType: file.mimetype,
          }))
        : [],
    };

    const newWork = {
      title,
      media: mediaFiles,
      content,
      publishTime,
      scheduledPublishTime,
      externalSource,
      visibility,
      isPublished,
    };

    let workId;

    let workAction;
    let publicationStatus;

    // Now convert the ISO format date to UTC with moment-timezone
    const scheduledTimeUTC = moment
      .tz(scheduledPublishTime, 'Europe/Berlin')
      .utc()
      .toISOString();

    if (!existingPerson) {
      const newPerson = new Person({
        person: { ...personData, featured: featuredImage },
        works: [newWork],
        category,
        visibility,
      });

      const savedPerson = await newPerson.save();
      workId = savedPerson.works[savedPerson.works.length - 1]._id;
      workAction = 'created';
    } else {
      existingPerson.works.push(newWork);
      const updatedPerson = await existingPerson.save();
      workId = updatedPerson.works[updatedPerson.works.length - 1]._id;
      workAction = 'added to existing person';
    }

    // Schedule publication if required
    if (publishTime === 'Schedule' && scheduledPublishTime) {
      await agenda.schedule(scheduledTimeUTC, 'publish work', { workId });
      publicationStatus = `scheduled for ${scheduledPublishTime}`;
    } else publicationStatus = 'published immediately';

    const message = `Work ${workAction} and ${publicationStatus}.`;

    return res.status(200).json({ message: message, workId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Display details of a specific person
export const displayPersonDetails = async (req, res) => {
  try {
    const personId = req.params.id; // Assuming the ID is passed as a URL parameter
    const person = await Person.findById(personId);
    res.json(person.person); // Send the 'person' subdocument as the response
  } catch (error) {
    console.error('Failed to fetch person details:', error);
    res.status(500).send('Failed to fetch person details');
  }
};

// Display detailed data of a specific person, including populated works
export const displayPersonData = async (req, res) => {
  console.log(req);
  try {
    const personId = req.params.id;
    const person = await Person.findById(personId).populate('works');
    res.json(person); // Send the entire person document as the response
  } catch (error) {
    console.error('Failed to fetch person data:', error);
    res.status(500).send('Failed to fetch person data');
  }
};

// Display details of all persons
export const getAllPersons = async (req, res) => {
  try {
    const persons = await Person.find(
      {},
      {
        'person.firstName': 1,
        'person.lastName': 1,
        'person.aboutPerson': 1,
        'person.featured': 1,
      }
    );
    res.json(persons); // Send the list of persons as the response
  } catch (error) {
    console.error('Failed to fetch persons:', error);
    res.status(500).send('Failed to fetch persons');
  }
};
