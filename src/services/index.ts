/* eslint-disable class-methods-use-this */
import AppDataSrc from '../db';
import AppError from '../errors';
import IdValidator from '../validators/Id';

interface FindParams {
    relation: string;
    select: Array<string>,
    where: Array<any>,
    entity: string;
}

export default class Services {
  dataSrc: typeof AppDataSrc;

  entityClass: any;

  constructor(entityClass: any = undefined, dataSrc = AppDataSrc) {
    this.dataSrc = dataSrc;
    this.entityClass = entityClass;
    this.createOne = this.createOne.bind(this);
    this.fetchAll = this.fetchAll.bind(this);
    this.fetchOne = this.fetchOne.bind(this);
    this.updateOne = this.updateOne.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
    this.getOne = this.getOne.bind(this);
    this.validateId = this.validateId.bind(this);
  }

  async createOne(arg: object): Promise<{ message: string, data: unknown}> {
    const entity = this.dataSrc.manager.create(this.entityClass, arg);
    await this.dataSrc.manager.save(entity);
    return { message: `${this.constructor.name} successfully created`, data: entity };
  }

  async validateId(id: string, target: boolean = true): Promise<void> {
    const entity = new IdValidator();
    entity.id = id;
    return entity.validate({ validationError: { target }, forbidUnknownValues: true });
  }

  async fetchOne(query: any):
        Promise<any> {
    const data = await this.dataSrc.manager.findOne(this.entityClass, query);
    if (data == null) throw new AppError(`${this.constructor.name} not found`, 'NotFound', { query });
    return data;
  }

  async getOne(query: any): Promise<{ message: string, data: unknown }> {
    const entity = await this.fetchOne(query);
    return {
      message: `${this.constructor.name} successfully retrieved`,
      data: entity,
    };
  }

  async fetchAll(arg: FindParams)
      : Promise<{ message: string, data: Array<unknown> }> {
    const data = await this.dataSrc.manager.createQueryBuilder(this.entityClass, arg.entity)
      .leftJoinAndSelect(`${arg.entity}.${arg.relation}`, arg.relation)
      .select(arg.select)
      .where(arg.where[0] ?? '', arg.where[1] ?? {})
      .orderBy(`${arg.entity}.createdAt`, 'DESC')
      .getMany();
    return { message: `${this.constructor.name}s successfully retrieved`, data };
  }

  async updateOne(arg: object, query: any): Promise<{ message: string, data: any }> {
    const entity = await this.fetchOne(query);
    this.dataSrc.manager.merge(this.entityClass, entity, arg);
    await this.dataSrc.manager.save(entity);
    return { message: `${this.constructor.name} successfully updated`, data: entity };
  }

  async deleteOne(query: any): Promise<{ message: string }> {
    const entity = await this.fetchOne(query);
    await this.dataSrc.manager.remove(entity);
    return { message: `${this.constructor.name} successfully deleted` };
  }
}
