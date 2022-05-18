// /* eslint-disable class-methods-use-this */
// import IsValidFields from '../validators';

// export default class Services {
//   dataSrc: any;

//   constructor() {
//     this.validateId = this.validateId.bind(this);
//   }

//   async validateId(id: string, target: boolean = true): Promise<void> {
//     const data = new IsValidFields();
//     data.id = id;
//     return data.validate({ groups: ['uuid'], validationError:
// { target }, forbidUnknownValues: true });
//   }

//   async validateFound(arg: any, target: boolean = true) {
//     const response = new IsValidFields();
//     response.$target = arg;
//     return response.validate({ groups: ['notFound'], validationError: { target } });
//   }
// }
