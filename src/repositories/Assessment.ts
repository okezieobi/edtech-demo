/* eslint-disable class-methods-use-this */
import { EntityRepository, Repository } from 'typeorm';

import connection, { AssessmentEntity } from '../entities';

@EntityRepository(AssessmentEntity)
class AssessmentRepository extends Repository<AssessmentEntity> {}

export default async () => {
  const resolvedConnection = await connection();
  return resolvedConnection.getCustomRepository(AssessmentRepository);
};
