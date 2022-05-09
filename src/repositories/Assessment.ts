import AppDataSrc from '../db';
import AssessmentEntity from '../entities/Assessment';
import IdValidator from '../validators/Id';

const AssessmentRepository = AppDataSrc.getRepository(AssessmentEntity).extend({
  // methods not using entity fields come here
  async validateAssessmentId(id: string): Promise<void> {
    const assessment = new IdValidator();
    assessment.id = id;
    return assessment
      .validate({ validationError: { target: true }, forbidUnknownValues: true });
  },
});

export default AssessmentRepository;

export { AssessmentEntity };
