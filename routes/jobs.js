const express = require('express');
const {getAllJobs,
    getOneJob,
    postJob,
    deleteJob,
    updateJob} = require('../controllers/jobs');

const router = express.Router();

router.route('/').get(getAllJobs).post(postJob);
router.route('/:id').patch(updateJob).delete(deleteJob).get(getOneJob)

module.exports = router