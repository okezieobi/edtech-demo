import AppDataSrc from '../db';
import AssessmentEntity from '../entities/Assessment';

const AssessmentRepository = AppDataSrc.getRepository(AssessmentEntity).extend({
  // methods not using entity fields come here
});

export default AssessmentRepository;
