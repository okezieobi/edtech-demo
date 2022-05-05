import AppDataSrc, { AssessmentEntity } from '../db';

const AssessmentRepository = AppDataSrc.getRepository(AssessmentEntity).extend({
  // methods not using entity fields come here
});

export default AssessmentRepository;
