import AppDataSrc from '../db';
import AppError from '../errors';
import IdValidator from '../validators/Id';

interface FindParams {
    relation: string;
    select: Array<string>,
    filter?: string;
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
  }

  async createOne(arg: object): Promise<{ message: string, data: unknown}> {
    const entity = this.dataSrc.manager.create(this.entityClass, arg);
    await this.dataSrc.manager.save(entity);
    return { message: `${this.constructor.name} successfully created`, data: entity };
  }

  async fetchOne(query: any, target: boolean = true):
        Promise<any> {
    const entity = new IdValidator();
    entity.id = query.where.id;
    await entity.validate({ validationError: { target }, forbidUnknownValues: true });
    const data = await this.dataSrc.manager.findOne(this.entityClass, query);
    if (data == null) throw new AppError(`${this.constructor.name} not found`, 'NotFound', { param: 'id', value: query.where.id });
    return data;
  }

  async getOne(entity: any): Promise<{ message: string, data: unknown }> {
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
      .orderBy(`${arg.entity}.createdAt`, 'DESC')
      .getMany();
    let filtered: any;
    if (arg.filter != null) {
      filtered = data.map((e: any) => e[arg.filter!].id === arg.filter);
    }
    return { message: `${this.constructor.name}s successfully retrieved`, data: filtered ?? data };
  }

  async updateOne(arg: object, entity: any): Promise<{ message: string, data: unknown }> {
    this.dataSrc.manager.merge(this.entityClass, entity, arg);
    await this.dataSrc.manager.save(entity);
    return { message: `${this.constructor.name} successfully updated`, data: entity };
  }

  async deleteOne(entity: any): Promise<{ message: string}> {
    await this.dataSrc.manager.remove(entity);
    return { message: `${this.constructor.name} successfully deleted` };
  }
}
