/* eslint-disable class-methods-use-this */
import AppDataSrc from '../db';
import AppError from '../errors';
import IdValidator from '../validators/Id';

export default class Services {
  dataSrc: typeof AppDataSrc;

  constructor(dataSrc = AppDataSrc) {
    this.dataSrc = dataSrc;
    this.createOne = this.createOne.bind(this);
    this.fetchOne = this.fetchOne.bind(this);
    this.updateOne = this.updateOne.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
    this.validateId = this.validateId.bind(this);
  }

  async createOne(entityClass: any, arg: object): Promise<any> {
    const entity = this.dataSrc.manager.create(entityClass, arg);
    return this.dataSrc.manager.save(entity);
  }

  async validateId(id: string, target: boolean = true): Promise<void> {
    const entity = new IdValidator();
    entity.id = id;
    return entity.validate({ validationError: { target }, forbidUnknownValues: true });
  }

  async fetchOne(entityClass: any, query: any):
        Promise<any> {
    const data = await this.dataSrc.manager.findOne(entityClass, query);
    if (data == null) throw new AppError(`${this.constructor.name} not found`, 'NotFound', { query });
    return data;
  }

  async updateOne(entityClass: any, query: any, arg: object):
    Promise<any> {
    const entity = await this.fetchOne(entityClass, query);
    this.dataSrc.manager.merge(entityClass, entity, arg);
    return this.dataSrc.manager.save(entity);
  }

  async deleteOne(entityClass: any, query: any): Promise<void> {
    const entity = await this.fetchOne(entityClass, query);
    await this.dataSrc.manager.remove(entity);
  }
}
