export default abstract class Services {
  repository: any;

  constructor(repository: any) {
    this.repository = repository;
  }

  async createOne(repoProp: string, arg: object) {
    const repo = await this.repository();
    const newEntity = repo.create(arg);
    return repo.save(newEntity);
  }

  async listAll() {
    const repo = await this.repository();
    return repo.find();
  }

  async updateOne(arg: object, entity: object) {
    const repo = await this.repository();
    const data = { ...entity, ...arg };
    return repo.save(data);
  }
}
