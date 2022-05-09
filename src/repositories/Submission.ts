import AppDataSrc from '../db';
import SubmissionEntity from '../entities/Submissions';
import IdValidator from '../validators/Id';

const SubmissionRepository = AppDataSrc.getRepository(SubmissionEntity).extend({
  async validateSubmissionId(id: string): Promise<void> {
    const submission = new IdValidator();
    submission.id = id;
    return submission
      .validate({ validationError: { target: true }, forbidUnknownValues: true });
  },
});

export default SubmissionRepository;

export { SubmissionEntity };
