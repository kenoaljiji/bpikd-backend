import mongoose from 'mongoose';
import Person from '../models/personPost.js';
import { agenda } from '../utils/agenda.js'; // Ensure this path is correct

import moment from 'moment-timezone';

// Assuming 'scheduledPublishTime' is in local time and you want to convert it to UTC

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
    isPublished,
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
      isPublished,
    };

    let workId;

    let workAction; // To track the action taken (created or updated)
    let publicationStatus; // To track publication status (immediately or scheduled)

    // Now convert the ISO format date to UTC with moment-timezone
    const scheduledTimeUTC = moment
      .tz(scheduledPublishTime, 'Europe/Berlin')
      .utc()
      .toISOString();

    if (!existingPerson) {
      const newPerson = new Person({
        person: personData,
        works: [newWork],
        category,
        visibility,
      });

      const savedPerson = await newPerson.save();
      workId = savedPerson.works[savedPerson.works.length - 1]._id; // Assuming `newWork` is the last item in the `works` array
      workAction = 'created';
    } else {
      existingPerson.works.push(newWork);
      const updatedPerson = await existingPerson.save();
      workId = updatedPerson.works[updatedPerson.works.length - 1]._id; // Get the ID of the new work
      workAction = 'added to existing person';
    }

    // Schedule publication if required
    if (publishTime === 'Schedule' && scheduledPublishTime) {
      await agenda.schedule(scheduledTimeUTC, 'publish work', { workId });
      publicationStatus = `scheduled for ${scheduledPublishTime}`;
    } else publicationStatus = 'published immediately';

    const message = `Work ${workAction} and ${publicationStatus}.`;

    /*  return res.status(200).json({ message: 'Success', workId });*/
    return res.status(200).json({ message, workId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
